import { normalizeName } from './normalizeName.ts';

const CLASSIFIED_CATEGORY = 3109687656;
const OBSOLETE_HASHES = [
  1561789734, // firefly for ace of spades
  3580904580, // какого и зачем в апихе два одинаковых шотика Легенда об Акрии
  1744115122, // какого и зачем в апихе два одинаковых шотика Легенда об Акрии
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
  'Глефа',
] as const;

const PERK_LOCALE_EN = 'Trait';
const PERK_LOCALE_RU = 'Особенность' as const;

interface ItemDefEntity {
  itemTypeDisplayName: typeof WHITE_TYPES_RU[number];
  displayProperties: { name: string };
  hash: number;
  itemCategoryHashes: number[];
  quality: { versions: Array<{ powerCapHash: number }> };
  crafting: { outputItemHash: number };
  equippable: boolean;
}

export interface InventoryItemEntity {
  type: typeof WHITE_TYPES_RU[number];
  name: string;
  hash: number;
  itemCategoryHashes?: number[];
}

const setUpInventory = async () => {
  const inventoryItems: InventoryItemEntity[] = [];

  const itemDefsRaw = await Deno.readTextFile('./src/data/inventory/itemDefinitionsResponseRu.json');
  const itemDefs: ItemDefEntity[] = Object.values(JSON.parse(itemDefsRaw));
  itemDefs.forEach(
    ({
      itemTypeDisplayName,
      displayProperties: { name },
      hash,
      itemCategoryHashes,
      quality: { versions = [] } = {},
      crafting,
      equippable,
    }) => {
      if (
        WHITE_TYPES_RU.includes(itemTypeDisplayName) &&
        !itemCategoryHashes.includes(CLASSIFIED_CATEGORY) &&
        !OBSOLETE_HASHES.includes(hash) &&
        !crafting &&
        name &&
        (itemTypeDisplayName === PERK_LOCALE_RU || versions.find(({ powerCapHash }) => powerCapHash === NO_CAP_HASH)) &&
        (itemTypeDisplayName === PERK_LOCALE_RU || equippable)
      ) {
        // console.log(`${name} :: ${itemTypeDisplayName} :: ${equippable}`);
        inventoryItems.push({ type: itemTypeDisplayName, name: normalizeName(name), hash });
      }
    }
  );

  inventoryItems.map(({ name: originalName, type: originalType }) => {
    if (originalType !== PERK_LOCALE_RU) {
      const dupes = inventoryItems.filter(({ name: dupeName, type: dupeType }) => dupeType !== PERK_LOCALE_RU && originalName === dupeName);
      if (dupes.length > 1) {
        console.log(`weapon dupes found :: ${dupes.length} :: ${originalName} :: ${dupes.map(({ hash }) => hash).join(', ')}`);
      }
    }
  });

  const fileName = './src/data/inventory/inventory.json';
  await Deno.writeTextFile(fileName, JSON.stringify(inventoryItems, null, '\t'));
  console.log(`success :: ${fileName} :: total of ${inventoryItems.length} weapons and traits`);
};

setUpInventory();
