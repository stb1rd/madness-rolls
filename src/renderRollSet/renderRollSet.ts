import { SortService, Direction } from 'https://deno.land/x/sort@v1.1.1/mod.ts';
import { InventoryItemEntity } from '../setUpInventory/setUpInventory.ts';
import { normalizeName as normalizeInvName } from '../setUpInventory/normalizeName.ts';
import { RollSet } from '../types/rolls.ts';

const madnessTraitFails = new Map([
  ['Фугасные боеприпасы', 'Фугасный снаряд'],
  ['Фгуасный снаряд', 'Фугасный снаряд'],
  ['Магазин для множественных убийтв', 'Магазин для множественных убийств'],
  ['Магазин для множестенных убийств', 'Магазин для множественных убийств'],
  ['Магазин для множественных убйиств', 'Магазин для множественных убийств'],
  ['Монитор пульса', 'Датчик пульса'],
  ['Электрошок', 'Электрозаряд'],
  ['Сосредточенная ярость', 'Сосредоточенная ярость'],
  ['Идеальный треуголник', 'Идеальный треугольник'],
  ['Кинетический взрыв', 'КИНЕТИЧЕСКАЯ ДРОЖЬ'],
  ['Дестабилизирующие патроны', 'ДЕСТАБИЛИЗИРУЮЩИЕ БОЕПРИПАСЫ'],
  ['Дестаб. боеприпасы', 'ДЕСТАБИЛИЗИРУЮЩИЕ БОЕПРИПАСЫ'],
  ['Дестабилизирующие боерипасы', 'ДЕСТАБИЛИЗИРУЮЩИЕ БОЕПРИПАСЫ'],
  ['Дестабилизирующие боеп.', 'ДЕСТАБИЛИЗИРУЮЩИЕ БОЕПРИПАСЫ'],
  ['Дестабилиризующие боеп.', 'ДЕСТАБИЛИЗИРУЮЩИЕ БОЕПРИПАСЫ'],
  ['Лекарство', 'Препарат'],
  ['Магазин для мн. убийств', 'МАГАЗИН ДЛЯ МНОЖЕСТВЕННЫХ УБИЙСТВ'],
  ['До боли', 'ЧЕРЕЗ БОЛЬ'],
  ['Круг жизни', 'ЖИЗНЕННЫЙ ЦИКЛ'],
  ['Контролирумая очередь', 'КОНТРОЛИРУЕМАЯ ОЧЕРЕДЬ'],
  ['Оттакливающая связь', 'Отталкивающая связь'],
  ['Кобура с автоподзарядкой', 'КОБУРА С АВТОПОДЗАРЯДОМ'],
]);

const madnessWeaponFails = new Map([
  ['Житель пустоши М5', 'Житель пустоши M5'],
  ['Воспоминания Беренгера', 'Воспоминание Беренгера'],
  ['Рангильд-Д', 'Рагнгильд-Д'],
  ['ПВ-5 Снорри', 'ПВ5 Снорри'],
  ['Фортисиммо-11', 'Фортиссимо-11'],
  ['Лодброк-С', 'ЛОДБРОК-C'],
  ['Похоронная песнь - 22', 'Похоронная песнь – 22'],
  ['Марсилий-С', 'МАРСИЛИЙ-C'],
  ['Благовение Микела', 'БЛАГОГОВЕНИЕ МИКЕЛА'],
  ['Когда-нибудь', 'ОДНАЖДЫ'],
  ['Презрение Шипа', 'ПРЕЗРЕНИЕ БРАЙЕРА'],
  ['Предшественник Астианатка IV', 'ПРЕДШЕСТВЕННИК АСТИАНАКТА IV'],
  ['Новотихоокенская эпитафия', 'НОВОТИХООКЕАНСКАЯ ЭПИТАФИЯ'],
  ['Возмездие мученника', 'ВОЗМЕЗДИЕ МУЧЕНИКА'],
]);

const preSearchClean = (name: string) => name.toLowerCase().trim();
const normalizeName = (name: string) => preSearchClean(madnessWeaponFails.get(normalizeInvName(name)) || normalizeInvName(name));
const correctTrait = (trait: string) => madnessTraitFails.get(trait) || trait;

type Grades = 'S' | 'A' | 'B';

const ACTIVITIES = ['PVE', 'PVP'] as const;
const ANY_TRAIT = 'Любой перк';
const ADEPT = 'адепт';

const gradesDict = new Map<number, Grades>([
  [0, 'S'],
  [1, 'A'],
  [2, 'B'],
]);

export const renderRollSet = async (name: string, rollSet: RollSet): Promise<{ wishList: string; wishListCount: number }> => {
  const inventoryRaw = await Deno.readTextFile('./src/data/inventory/inventory.json');
  const inventory: InventoryItemEntity[] = JSON.parse(inventoryRaw);
  const weapon = inventory.find(({ name: invName }) => preSearchClean(invName) === normalizeName(name));
  const adept = inventory.find(({ name: invName }) => preSearchClean(invName) === normalizeName(`${name} (${ADEPT})`));

  if (!weapon) {
    throw new Error(`ERR :: оружие не найдено :: ${normalizeName(name)}`);
  }

  let wishList = `// ${name}\n`;
  let wishListCount = 0;

  const traitsAndLabels = new Map<string, string[]>();

  const bakeRoll = (perks: number[] | string[], activity: (typeof ACTIVITIES)[number], grades: Grades[]) => {
    const key = SortService.sort(perks, Direction.ASCENDING).join(',');
    const label = `${activity}-${grades.join('')}`;
    const dupe = traitsAndLabels.get(key);
    if (dupe) {
      traitsAndLabels.set(key, [...dupe, label]);
    } else {
      traitsAndLabels.set(key, [label]);
    }
  };

  const populateWishlist = () => {
    const labelsAndTraits = new Map<string, string[]>();
    [...traitsAndLabels]
      .sort((a, b) => (a[1].length > b[1].length ? -1 : a[1].length < b[1].length ? 1 : 0))
      .forEach(([traits, labels]) => {
        const key = labels.join(', ');
        const dupe = labelsAndTraits.get(key);
        if (dupe) {
          labelsAndTraits.set(key, [...dupe, traits]);
        } else {
          labelsAndTraits.set(key, [traits]);
        }
      });

    [...labelsAndTraits].forEach(([label, traits]) => {
      const weaponHashes = [weapon.hash, ...(adept ? [adept.hash] : [])];
      if (traits[0]?.includes(ANY_TRAIT)) {
        wishList += `//notes: ${label} (${traits[0]})\n`;
        weaponHashes.forEach((hash, i) => {
          if (i === 1) {
            wishList += '\n';
          }
          wishList += `dimwishlist:item=${hash}`;
          wishListCount++;
        });
      } else {
        let perfection = '';
        if ([[ACTIVITIES[0], 2].join('@'), [ACTIVITIES[1], 2].join('@')].includes(label)) {
          perfection = `(${traits[0]
            .split(',')
            .map((hash) => inventory.find(({ hash: invHash }) => String(invHash) === hash)?.name || '')
            .join(', ')})`;
        }
        if (perfection) {
          wishList += `//notes: ${label} ${perfection}\n`;
        } else {
          wishList += `//notes: ${label}\n`;
        }
        weaponHashes.forEach((hash, i) => {
          if (i === 1) {
            wishList += '\n';
          }
          wishList += traits
            .map((trait) => {
              wishListCount++;
              return `dimwishlist:item=${hash}&perks=${trait}`;
            })
            .join('\n');
        });
      }
      wishList += '\n\n';
    });
  };

  for (const activity of ACTIVITIES) {
    const firstTraits = [rollSet[activity][0]?.[0], rollSet[activity][1]?.[0]].join(' - ');
    if (firstTraits?.includes(ANY_TRAIT)) {
      bakeRoll([firstTraits], activity, ['S']);
      continue;
    }

    const invTraits = new Map<string, InventoryItemEntity>();
    rollSet[activity].forEach((set) => {
      set.forEach((traitName) => {
        const trait = correctTrait(traitName);
        const invTrait = inventory.find(({ name: invName, hash }) => {
          if (traitName === 'Система автоспуска') {
            if (weapon.type === 'Дробовик') {
              return hash === 2117683199;
            } else {
              return hash === 4267945040;
            }
          } else if (traitName === 'Просветленное действие') {
            return hash === 3828510309;
          } else {
            return preSearchClean(invName) === preSearchClean(trait);
          }
        });
        if (!invTrait) {
          throw new Error(`ERR :: перк не найден:: ${traitName} :: ${name}`);
        }
        invTraits.set(trait, invTrait);
      });
    });

    const getInvTrait = (title: string) => invTraits.get(correctTrait(title));

    const traitsCols = rollSet[activity].sort(({ length }) => -length);

    if (!traitsCols.length && !traitsCols[0]?.length && !traitsCols[1]?.length) {
      continue;
    }

    // console.log('traits', traits);
    // traits [ [ "Светлячок" ], [ "Фугасный снаряд" ] ]

    traitsCols[0].forEach((leftTrait, leftI) => {
      traitsCols[1].forEach((rightTrait, rightI) => {
        if (leftI < 3 && rightI < 3)
          bakeRoll(
            [getInvTrait(leftTrait)!.hash, getInvTrait(rightTrait)!.hash],
            activity,
            [gradesDict.get(leftI)!, gradesDict.get(rightI)!].sort(() => leftI - rightI)
          );
      });
    });

    traitsCols[1].forEach((trait, i) => {
      if (i < 3) bakeRoll([getInvTrait(trait)!.hash], activity, [gradesDict.get(i)!]);
    });

    traitsCols[0].forEach((trait, i) => {
      if (i < 3) bakeRoll([getInvTrait(trait)!.hash], activity, [gradesDict.get(i)!]);
    });

    // if (traits[1]) {
    //   bakeRoll([getInvTrait(traits[1][0])!.hash, getInvTrait(traits[0][0])!.hash], activity, ['S', 'S']);
    // }

    // if (traits[0].length === 1) {
    //   bakeRoll([getInvTrait(traits[1][0])!.hash], activity, ['A', 'S']);
    //   bakeRoll([getInvTrait(traits[0][0])!.hash], activity, ['A', 'S']);
    //   continue;
    // }

    // if (traits[1]) {
    //   traits[1].slice(1).forEach((traitName) => {
    //     bakeRoll([getInvTrait(traits[0][0])!.hash, getInvTrait(traitName)!.hash], activity, 1);
    //   });
    //   traits[0].slice(1).forEach((traitName) => {
    //     bakeRoll([getInvTrait(traits[1][0])!.hash, getInvTrait(traitName)!.hash], activity, 1);
    //   });

    //   if (traits[0].slice(1).length >= 1 && traits[1].slice(1).length >= 1) {
    //     traits[0].slice(1).forEach((traitName0) => {
    //       traits[1].slice(1).forEach((traitName1) => {
    //         bakeRoll([getInvTrait(traitName0)!.hash, getInvTrait(traitName1)!.hash], activity, 1);
    //       });
    //     });
    //   }
    // }
  }

  populateWishlist();
  return { wishList, wishListCount };
};
