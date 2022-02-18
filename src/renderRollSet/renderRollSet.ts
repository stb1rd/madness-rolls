import { SortService, Direction } from 'https://deno.land/x/sort@v1.1.1/mod.ts';
import { InventoryItemEntity } from '../setUpInventory.ts';
import { RollSet } from '../types/rolls.ts';

const madnessTraitFails = new Map([['Фугасные боеприпасы', 'Фугасный снаряд']]);

export const correctTrait = (trait: string) => madnessTraitFails.get(trait) || trait;

export const renderRollSet = async (name: string, rollSet: RollSet): Promise<string> => {
  const inventoryRaw = await Deno.readTextFile('./src/data/inventory/inventory.json');
  const inventory: InventoryItemEntity[] = JSON.parse(inventoryRaw);
  const weapon = inventory.find(({ name: invName }) => invName === name);

  if (!weapon) {
    throw new Error(`ERR :: weapon not found :: ${name}`);
  }

  let wishList = '';
  const bakeRoll = (perks: number[]) =>
    (wishList += `dimwishlist:item=${weapon.hash}&perks=${SortService.sort(perks, Direction.ASCENDING).join(',')}\n`);

  for (const activity of ['PVE', 'PVP'] as const) {
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
    // const traits = SortService.sort(rollSet[activity], [{ fieldName: 'length', direction: Direction.DESCENDING }]);

    if (!traits.length && !traits[0]?.length && !traits[1]?.length) {
      continue;
    }

    wishList += `//notes: ${activity} 10/10\n`;
    bakeRoll([getInvTrait(traits[1][0])!.hash, getInvTrait(traits[0][0])!.hash]);
    wishList += '\n';

    if (traits[0].length === 1) {
      wishList += `//notes: ${activity} 7/10\n`;
      bakeRoll([getInvTrait(traits[1][0])!.hash]);
      bakeRoll([getInvTrait(traits[0][0])!.hash]);
      wishList += '\n';
      continue;
    }

    wishList += `//notes: ${activity} 7/10\n`;
    traits[1].slice(1).forEach((traitName) => {
      bakeRoll([getInvTrait(traits[0][0])!.hash, getInvTrait(traitName)!.hash]);
    });
    traits[0].slice(1).forEach((traitName) => {
      bakeRoll([getInvTrait(traits[1][0])!.hash, getInvTrait(traitName)!.hash]);
    });
    wishList += '\n';

    if (traits[0].slice(1).length >= 1 && traits[1].slice(1).length >= 1) {
      wishList += `//notes: ${activity} 4/10\n`;
      traits[0].slice(1).forEach((traitName0) => {
        traits[1].slice(1).forEach((traitName1) => {
          bakeRoll([getInvTrait(traitName0)!.hash, getInvTrait(traitName1)!.hash]);
        });
      });
      wishList += '\n';
    }
  }

  return wishList;
};
