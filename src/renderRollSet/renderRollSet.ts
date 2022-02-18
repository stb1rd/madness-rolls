import { SortService, Direction } from 'https://deno.land/x/sort@v1.1.1/mod.ts';
import { RollSet } from '../data/rolls.ts';
import { InventoryItemEntity } from '../setUpInventory.ts';

export const renderRollSet = async (name: string, rollSet: RollSet): Promise<string> => {
  const inventoryRaw = await Deno.readTextFile('./src/data/inventory.json');
  const inventory: InventoryItemEntity[] = JSON.parse(inventoryRaw);
  const weapon = inventory.find(({ name: invName }) => invName === name);

  if (!weapon) {
    throw new Error(`ERR :: weapon not found :: ${name}`);
  }

  let wishList = '';
  const bakeRoll = (perks: number[]) =>
    (wishList += `dimwishlist:item=${weapon.hash}&perks=${SortService.sort(perks, Direction.ASCENDING).join(',')}\n`);

  for (const activity of ['PVE', 'PVP'] as const) {
    // console.log('rollSet', rollSet);
    // console.log('activity', activity);
    const invTraits = new Map<string, InventoryItemEntity>();
    rollSet[activity].forEach((set) => {
      set.forEach((traitName) => {
        const invTrait = inventory.find(({ name: invName }) => invName === traitName);
        if (!invTrait) {
          throw new Error(`ERR :: trait not found :: ${traitName}`);
        }
        invTraits.set(traitName, invTrait);
      });
    });

    const traits = rollSet[activity].sort(({ length }) => -length);

    if (!traits.length && !traits[0]?.length && !traits[1]?.length) {
      continue;
    }

    wishList += `\n//notes: ${activity} perks 10/10\n`;
    bakeRoll([invTraits.get(traits[1][0])!.hash, invTraits.get(traits[0][0])!.hash]);

    if (traits[0].length === 1) {
      wishList += `\n//notes: ${activity} perks 7/10\n`;
      bakeRoll([invTraits.get(traits[1][0])!.hash]);
      bakeRoll([invTraits.get(traits[0][0])!.hash]);
      continue;
    }

    wishList += `\n//notes: ${activity} perks 7/10\n`;
    traits[1].slice(1).forEach((traitName) => {
      bakeRoll([invTraits.get(traits[0][0])!.hash, invTraits.get(traitName)!.hash]);
    });
    traits[0].slice(1).forEach((traitName) => {
      bakeRoll([invTraits.get(traits[1][0])!.hash, invTraits.get(traitName)!.hash]);
    });

    wishList += `\n//notes: ${activity} perks 4/10\n`;
    traits[0].slice(1).forEach((traitName0) => {
      traits[1].slice(1).forEach((traitName1) => {
        bakeRoll([invTraits.get(traitName0)!.hash, invTraits.get(traitName1)!.hash]);
      });
    });
  }

  return wishList;
};
