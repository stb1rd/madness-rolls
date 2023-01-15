const [guid] = Deno.args;
if (!guid) {
  throw new Error('нужно передать GUID вот так: yarn fetch-inv PASTE_GUID_HERE');
}
const path = `https://www.bungie.net/common/destiny2_content/json/ru/DestinyInventoryItemDefinition-${guid}.json`;
console.log('path', path);
const response = await fetch(path);
Deno.writeTextFile('src/data/inventory/itemDefinitionsResponseRu.json', JSON.stringify(await response.json()));
