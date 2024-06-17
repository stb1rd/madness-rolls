import { assertEquals } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import { renderRollSet } from './renderRollSet.ts';

Deno.test({ name: 'small PVE' }, async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [
      ['Фугасный снаряд'], // 3038247973
      ['Светлячок'], // 3824105627
    ],
    PVP: [],
  });

  const expect = `// Вершитель рока
//notes: PVE-SS
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVE-S
dimwishlist:item=2171478765&perks=3038247973
dimwishlist:item=2171478765&perks=3824105627

`;

  assertEquals(renderResult.wishList, expect);
});

Deno.test({ name: 'small PVP' }, async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [],
    PVP: [
      ['Фугасный снаряд'], // 3038247973
      ['Светлячок'], // 3824105627
    ],
  });

  const expect = `// Вершитель рока
//notes: PVP-SS
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVP-S
dimwishlist:item=2171478765&perks=3038247973
dimwishlist:item=2171478765&perks=3824105627

`;

  assertEquals(renderResult.wishList, expect);
});

Deno.test({ name: 'small PVE with different length' }, async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [
      ['Фугасные боеприпасы'], // 3038247973
      ['Светлячок', 'Запас патронов'], // 3824105627 2578928832
    ],
    PVP: [],
  });

  const expect = `// Вершитель рока
//notes: PVE-SS
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVE-AS
dimwishlist:item=2171478765&perks=2578928832,3038247973

//notes: PVE-S
dimwishlist:item=2171478765&perks=3038247973
dimwishlist:item=2171478765&perks=3824105627

//notes: PVE-A
dimwishlist:item=2171478765&perks=2578928832

`;

  assertEquals(renderResult.wishList, expect);
});

Deno.test({ name: 'full' }, async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [
      ['Фугасный снаряд', 'Осмос', 'Запас патронов'], // 3038247973 1774574192 2578928832
      ['Светлячок', 'Жажда адреналина', 'Безумие'], // 3824105627 11612903 4104185692
    ],
    PVP: [
      ['Фугасный снаряд', 'Молотьба', 'Убийственный вихрь', 'Туннельное зрение'], // 3038247973 2726471870 2450788523 2946784966
      ['Глаз бури', 'Киллерский магазин', 'Первый выстрел', 'Светлячок'], // 699525795 1015611457 47981717 3824105627
    ],
  });

  const expect = `// Вершитель рока
//notes: PVE-S, PVP-S
dimwishlist:item=2171478765&perks=3038247973

//notes: PVE-SS
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVE-AS
dimwishlist:item=2171478765&perks=1774574192,3824105627
dimwishlist:item=2171478765&perks=11612903,3038247973

//notes: PVE-BS
dimwishlist:item=2171478765&perks=2578928832,3824105627
dimwishlist:item=2171478765&perks=3038247973,4104185692

//notes: PVE-AA
dimwishlist:item=2171478765&perks=11612903,1774574192

//notes: PVE-BA
dimwishlist:item=2171478765&perks=11612903,2578928832
dimwishlist:item=2171478765&perks=1774574192,4104185692

//notes: PVE-BB
dimwishlist:item=2171478765&perks=2578928832,4104185692

//notes: PVE-A
dimwishlist:item=2171478765&perks=1774574192
dimwishlist:item=2171478765&perks=11612903

//notes: PVE-B
dimwishlist:item=2171478765&perks=2578928832
dimwishlist:item=2171478765&perks=4104185692

//notes: PVE-S
dimwishlist:item=2171478765&perks=3824105627

//notes: PVP-SS
dimwishlist:item=2171478765&perks=699525795,3038247973

//notes: PVP-AS
dimwishlist:item=2171478765&perks=699525795,2726471870
dimwishlist:item=2171478765&perks=1015611457,3038247973

//notes: PVP-BS
dimwishlist:item=2171478765&perks=699525795,2450788523
dimwishlist:item=2171478765&perks=47981717,3038247973

//notes: PVP-AA
dimwishlist:item=2171478765&perks=1015611457,2726471870

//notes: PVP-BA
dimwishlist:item=2171478765&perks=1015611457,2450788523
dimwishlist:item=2171478765&perks=47981717,2726471870

//notes: PVP-BB
dimwishlist:item=2171478765&perks=47981717,2450788523

//notes: PVP-A
dimwishlist:item=2171478765&perks=2726471870
dimwishlist:item=2171478765&perks=1015611457

//notes: PVP-B
dimwishlist:item=2171478765&perks=2450788523
dimwishlist:item=2171478765&perks=47981717

//notes: PVP-S
dimwishlist:item=2171478765&perks=699525795

`;

  assertEquals(renderResult.wishList, expect);
});
