import { readCSV } from 'https://deno.land/x/csv/mod.ts';
import { cleanActivityCell } from './cleanActivityCell/cleanActivityCell.ts';
import { renderRollSet } from './renderRollSet/renderRollSet.ts';

const READ_CSV_OPTIONS = {
  lineSeparator: '\r\n',
};

const files = [
  'Пункты назначения',
  'Рейды',
  'Мероприятия (BETA)',
  'Вендоры (BETA)',
  'Мировой лут пул (BETA)',
  'Сезоны',
  'Гамбит',
  '"Авангард"',
  'Горнило',
  'Подземелья',
].map((s) => `./src/data/rollsCSV/Оружие Destiny 2 от MadnessBuccaneer - ${s}.csv`);

const main = async () => {
  let fileContents = 'title:Madness wishes\n';
  let total = 0;

  await Promise.all(
    files.map(async (file) => {
      const f = await Deno.open(file);

      for await (const row of readCSV(f, READ_CSV_OPTIONS)) {
        const cells: string[] = [];
        for await (const cell of row) {
          cells.push(cell);
        }
        const [icon, title, damage, type, pve, pvp] = cells;
        if (!icon && title) {
          try {
            const wish = await renderRollSet(title, { PVE: cleanActivityCell(pve), PVP: cleanActivityCell(pvp) });
            fileContents += wish;
            ++total;
          } catch (error) {
            console.log(error.message);
          }
        }
      }

      f.close();
    })
  );

  const resultFileName = './wish_list.txt';
  await Deno.writeTextFile(resultFileName, fileContents);
  console.log(`success :: ${resultFileName} :: total of ${total} weapons`);
};

main();
