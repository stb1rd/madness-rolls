import { readCSV } from 'https://deno.land/x/csv/mod.ts';
import { renderRollSet } from './renderRollSet/renderRollSet.ts';

const files = ['./src/data/rollsCSV/Оружие Destiny 2 от MadnessBuccaneer - Пункты назначения.csv'];

const main = async () => {
  let fileContents = '# Madness wishes\n';
  let total = 0;

  await Promise.all(
    files.map(async (file) => {
      const f = await Deno.open(file);

      for await (const row of readCSV(f)) {
        const cells: string[] = [];
        for await (const cell of row) {
          cells.push(cell);
        }
        const [icon, title, damage, type, pve, pvp] = cells;
        if (!icon && title) {
          try {
            const wish = await renderRollSet(title, {
              PVE: pve === '-' ? [] : pve.split(' - ').map((x) => x.split('/')),
              PVP:
                pvp === '-\r'
                  ? []
                  : pvp
                      .split('\r')[0]
                      .split(' - ')
                      .map((x) => x.split('/')),
            });
            fileContents += wish;
            console.log(`wish added :: ${++total} :: ${title}`);
          } catch (error) {
            console.log(error.message);
          }
        }
      }

      f.close();
    })
  );

  // files.forEach(async (file) => {
  //   const f = await Deno.open(file);

  //   for await (const row of readCSV(f)) {
  //     const cells: string[] = [];
  //     for await (const cell of row) {
  //       cells.push(cell);
  //     }
  //     const [icon, title, damage, type, pve, pvp] = cells;
  //     if (!icon && title) {
  //       try {
  //         const wish = await renderRollSet(title, {
  //           PVE: pve === '-' ? [] : pve.split(' - ').map((x) => x.split('/')),
  //           PVP:
  //             pvp === '-\r'
  //               ? []
  //               : pvp
  //                   .split('\r')[0]
  //                   .split(' - ')
  //                   .map((x) => x.split('/')),
  //         });
  //         appendToFile(wish);
  //         console.log(`wish added :: ${++total} :: ${title}`);
  //       } catch (error) {
  //         console.log(error.message);
  //       }
  //     }
  //   }

  //   f.close();
  // });

  const resultFileName = './wish_list.txt';
  await Deno.writeTextFile(resultFileName, fileContents);
  console.log(`success :: ${resultFileName}`);
};

main();
