const CLASSIFIED_CATEGORY = 3109687656;
const OBSOLETE_HASHES = [
  1561789734, // firefly for ace of spades
];
const NO_CAP_HASH = 2759499571;

const WHITE_TYPES_EN = [
  'Pulse Rifle',
  'Hand Cannon',
  'Trait',
  'Trace Rifle',
  'Scout Rifle',
  'Auto Rifle',
  'Sword',
  'Rocket Launcher',
  'Machine Gun',
  'Sidearm',
  'Shotgun',
  'Submachine Gun',
  'Sniper Rifle',
  'Grenade Launcher',
  'Combat Bow',
  'Fusion Rifle',
  'Linear Fusion Rifle',
];

const WHITE_TYPES_RU = [
  'Импульсная винтовка',
  'Револьвер',
  'Особенность',
  'Лучевая винтовка',
  'Винтовка разведчика',
  'Автомат',
  'Меч',
  'Ракетная установка',
  'Пулемет',
  'Пистолет',
  'Дробовик',
  'Пистолет-пулемет',
  'Снайперская винтовка',
  'Гранатомет',
  'Боевой лук',
  'Плазменная винтовка',
  'Линейно-плазменная винтовка',
];

const PERK_LOCALE_EN = 'Trait';
const PERK_LOCALE_RU = 'Особенность';

const setUpInventory = async () => {
  const inventoryItems: Array<{
    type: string;
    name: string;
    hash: number;
    itemCategoryHashes?: number[];
  }> = [];

  // const types = new Map();

  const itemDefsRaw = await Deno.readTextFile('./src/data/itemDefinitionsResponseRu.json');
  const itemDefs = Object.values(JSON.parse(itemDefsRaw));
  // deno-lint-ignore no-explicit-any
  itemDefs.forEach(
    ({
      itemTypeDisplayName,
      displayProperties: { name },
      hash,
      itemCategoryHashes,
      quality: { versions: [{ powerCapHash = 0 }] = [{}] } = {},
    }: any) => {
      // types.set(itemTypeDisplayName, '');
      if (
        WHITE_TYPES_RU.includes(itemTypeDisplayName) &&
        !itemCategoryHashes.includes(CLASSIFIED_CATEGORY) &&
        !OBSOLETE_HASHES.includes(hash)
      ) {
        if (itemTypeDisplayName === PERK_LOCALE_RU || (itemTypeDisplayName !== PERK_LOCALE_RU && powerCapHash === NO_CAP_HASH)) {
          inventoryItems.push({ type: itemTypeDisplayName, name, hash });
        }
      }
    }
  );

  const fileName = './src/data/inventory.json';
  await Deno.writeTextFile(fileName, JSON.stringify(inventoryItems));
  console.log(`success :: ${fileName} :: total ${inventoryItems.length}`);
};

setUpInventory();
