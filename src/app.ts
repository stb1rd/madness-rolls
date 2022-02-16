import { rollSets } from './data/rolls.ts';

const main = async () => {
  // let fileContents = '# DIM search queries\n\n';
  // const appendToFile = (v: string, breakNum = 1) => (fileContents += `${v}${'\n'.repeat(breakNum)}`);
  // const renderRoll = (name: string, type: string, perks: string[], operator: string) => {
  //   appendToFile(`### ${type}\n\`\`\``);
  //   appendToFile(`name:${name} ${perks.map((perk) => `${operator} perkname:${perk}`).join(' ')}`);
  //   appendToFile(`\`\`\``);
  // };
  // Object.entries(rollSets).map(([name, roll]) => {
  //   appendToFile(`## ${name}`, 2);
  //   if (roll.pve) {
  //     renderRoll(name, 'PVE // godroll', roll.pve.god, 'and');
  //   }
  // });
  // await Deno.writeTextFile('./searches.md', fileContents);
  // console.log('write success');
};

main();
