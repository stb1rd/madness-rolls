import { readCSV } from 'https://deno.land/x/csv@v0.7.3/mod.ts';
import { cleanActivityCell } from './cleanActivityCell/cleanActivityCell.ts';
import { renderRollSet } from './renderRollSet/renderRollSet.ts';

const READ_CSV_OPTIONS = {
  lineSeparator: '\r\n',
};

const files = [
  'Рейды',
  'Подземелья',
  'Горнило',
  '"Авангард"',
  'Гамбит',
  'Эпизоды_сезоны',
  'Ротатор экзотический миссий',
  'Мировой лут пул и затерянные секторы',
  'Другие источники',
  'Пункты назначения',
].map((s) => `./src/data/rollsCSV/Оружие Destiny 2 от MadnessBuccaneer - ${s}.csv`);

const main = async () => {
  let fileContents = '';
  let total = 0;
  let totalRollCount = 0;

  await Promise.all(
    files.map(async (file) => {
      const f = await Deno.open(file);

      for await (const row of readCSV(f, READ_CSV_OPTIONS)) {
        const cells: string[] = [];
        for await (const cell of row) {
          cells.push(cell);
        }
        const [icon, title, damage, type, pve1, pve2, pvp1, pvp2] = cells;
        if (!icon && title) {
          try {
            const { wishList, wishListCount } = await renderRollSet(title, {
              PVE: cleanActivityCell(pve1, pve2),
              PVP: cleanActivityCell(pvp1, pvp2),
            });
            fileContents += wishList;
            ++total;
            totalRollCount += wishListCount;
          } catch (error) {
            console.log('ERR while processing ::', title);
            console.log(error);
          }
        }
      }

      f.close();
    })
  );

  const resultFileName = './wish_list.txt';
  const meta = `total of ${total} weapons and ${totalRollCount} rolls`;
  const header = `title:Madness wishes\ndescription:${meta}, last update: ${new Date().toLocaleString()}\n\n`;
  await Deno.writeTextFile(resultFileName, header + fileContents);
  console.log(`success :: ${resultFileName} :: ${meta}`);
};

main();
