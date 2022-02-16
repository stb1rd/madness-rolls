const setUpInventory = async () => {
  const whiteTypes = [
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

  const items: Array<{
    type: string;
    name: string;
    hash: number;
  }> = [];

  const itemDefsRaw = await Deno.readTextFile('./src/data/itemDefinitionsResponse.json');
  const itemDefs = Object.values(JSON.parse(itemDefsRaw));
  // deno-lint-ignore no-explicit-any
  itemDefs.forEach(({ itemTypeDisplayName, displayProperties: { name }, hash }: any) => {
    if (whiteTypes.includes(itemTypeDisplayName)) {
      items.push({ type: itemTypeDisplayName, name, hash });
    }
  });

  const fileName = './src/data/inventory.json';
  await Deno.writeTextFile(fileName, JSON.stringify(items));
  console.log(`success :: ${fileName} :: total ${items.length}`);
};

setUpInventory();
