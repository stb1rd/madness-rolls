import { SortService, Direction } from 'https://deno.land/x/sort@v1.1.1/mod.ts';
import { InventoryItemEntity } from '../setUpInventory.ts';
import { RollSet } from '../types/rolls.ts';

const madnessTraitFails = new Map([['Фугасные боеприпасы', 'Фугасный снаряд']]);

enum Grades {
  G10 = '10/10',
  G7 = '7/10',
  G4 = '4/10',
}

const ACTIVITIES = ['PVE', 'PVP'] as const;

export const correctTrait = (trait: string) => madnessTraitFails.get(trait) || trait;

export const renderRollSet = async (name: string, rollSet: RollSet): Promise<string> => {
  const inventoryRaw = await Deno.readTextFile('./src/data/inventory/inventory.json');
  const inventory: InventoryItemEntity[] = JSON.parse(inventoryRaw);
  const weapon = inventory.find(({ name: invName }) => invName === name);

  if (!weapon) {
    throw new Error(`ERR :: weapon not found :: ${name}`);
  }

  let wishList = '';

  const traitsAndLabels = new Map<string, string[]>();
  const bakeRoll = (perks: number[], activity: typeof ACTIVITIES[number], grade: Grades) => {
    const key = SortService.sort(perks, Direction.ASCENDING).join(',');
    const label = [activity, grade].join(' ');
    const dupe = traitsAndLabels.get(key);
    if (dupe) {
      traitsAndLabels.set(key, [...dupe, label]);
    } else {
      traitsAndLabels.set(key, [label]);
    }
  };

  const populateWishlist = () => {
    const labelsAndTraits = new Map<string, string[]>();
    [...traitsAndLabels]
      .sort((a, b) => (a[1].length > b[1].length ? -1 : a[1].length < b[1].length ? 1 : 0))
      .forEach(([traits, labels]) => {
        const key = labels.join(', ');
        const dupe = labelsAndTraits.get(key);
        if (dupe) {
          labelsAndTraits.set(key, [...dupe, traits]);
        } else {
          labelsAndTraits.set(key, [traits]);
        }
      });

    [...labelsAndTraits].forEach(([label, traits]) => {
      wishList += `//notes: ${label}\n`;
      wishList += traits.map((trait) => `dimwishlist:item=${weapon.hash}&perks=${trait}`).join('\n');
      wishList += '\n\n';
    });
  };

  for (const activity of ACTIVITIES) {
    const invTraits = new Map<string, InventoryItemEntity>();
    rollSet[activity].forEach((set) => {
      set.forEach((traitName) => {
        const trait = correctTrait(traitName);
        const invTrait = inventory.find(({ name: invName }) => invName === trait);
        if (!invTrait) {
          throw new Error(`ERR :: ${name} :: trait not found :: ${traitName}`);
        }
        invTraits.set(trait, invTrait);
      });
    });

    const getInvTrait = (title: string) => invTraits.get(correctTrait(title));

    const traits = rollSet[activity].sort(({ length }) => -length);

    if (!traits.length && !traits[0]?.length && !traits[1]?.length) {
      continue;
    }

    bakeRoll([getInvTrait(traits[1][0])!.hash, getInvTrait(traits[0][0])!.hash], activity, Grades.G10);

    if (traits[0].length === 1) {
      bakeRoll([getInvTrait(traits[1][0])!.hash], activity, Grades.G7);
      bakeRoll([getInvTrait(traits[0][0])!.hash], activity, Grades.G7);
      continue;
    }

    traits[1].slice(1).forEach((traitName) => {
      bakeRoll([getInvTrait(traits[0][0])!.hash, getInvTrait(traitName)!.hash], activity, Grades.G7);
    });
    traits[0].slice(1).forEach((traitName) => {
      bakeRoll([getInvTrait(traits[1][0])!.hash, getInvTrait(traitName)!.hash], activity, Grades.G7);
    });

    if (traits[0].slice(1).length >= 1 && traits[1].slice(1).length >= 1) {
      traits[0].slice(1).forEach((traitName0) => {
        traits[1].slice(1).forEach((traitName1) => {
          bakeRoll([getInvTrait(traitName0)!.hash, getInvTrait(traitName1)!.hash], activity, Grades.G4);
        });
      });
    }
  }

  populateWishlist();
  return wishList;
};
