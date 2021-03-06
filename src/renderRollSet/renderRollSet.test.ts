import { assertEquals } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import { renderRollSet } from './renderRollSet.ts';

Deno.test('small PVE', async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [
      ['Фугасный снаряд'], // 3038247973
      ['Светлячок'], // 3824105627
    ],
    PVP: [],
  });

  const expect = `//notes: PVE@10/10
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVE@7/10
dimwishlist:item=2171478765&perks=3038247973
dimwishlist:item=2171478765&perks=3824105627

`;

  assertEquals(renderResult, expect);
});

Deno.test('small PVP', async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [],
    PVP: [
      ['Фугасный снаряд'], // 3038247973
      ['Светлячок'], // 3824105627
    ],
  });

  const expect = `//notes: PVP@10/10
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVP@7/10
dimwishlist:item=2171478765&perks=3038247973
dimwishlist:item=2171478765&perks=3824105627

`;

  assertEquals(renderResult, expect);
});

Deno.test('small PVE with wrong name', async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [
      ['Фугасные боеприпасы'], // 3038247973
      ['Светлячок'], // 3824105627
    ],
    PVP: [],
  });

  const expect = `//notes: PVE@10/10
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVE@7/10
dimwishlist:item=2171478765&perks=3038247973
dimwishlist:item=2171478765&perks=3824105627

`;

  assertEquals(renderResult, expect);
});

Deno.test('any trait', async () => {
  const renderResult = await renderRollSet('Полуправда', {
    PVE: [['Любой перк'], ['Любой перк кроме "Гармонии"']],
    PVP: [],
  });

  const expect = `//notes: PVE@10/10 (Любой перк - Любой перк кроме "Гармонии")
dimwishlist:item=3257091166

`;

  assertEquals(renderResult, expect);
});

Deno.test('small PVE with different length', async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [
      ['Фугасные боеприпасы'], // 3038247973
      ['Светлячок', 'Запас патронов'], // 3824105627 3418782618
    ],
    PVP: [],
  });

  const expect = `//notes: PVE@10/10
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVE@7/10
dimwishlist:item=2171478765&perks=3038247973,3418782618

`;

  assertEquals(renderResult, expect);
});

Deno.test('small PVE adepts', async () => {
  const renderResult = await renderRollSet('Присяжные в тупике SR4', {
    PVE: [
      ['Фугасные боеприпасы'], // 3038247973
      ['Светлячок', 'Запас патронов'], // 3824105627 3418782618
    ],
    PVP: [],
  });

  const expect = `//notes: PVE@10/10
dimwishlist:item=4281371574&perks=3038247973,3824105627
dimwishlist:item=681067419&perks=3038247973,3824105627

//notes: PVE@7/10
dimwishlist:item=4281371574&perks=3038247973,3418782618
dimwishlist:item=681067419&perks=3038247973,3418782618

`;

  assertEquals(renderResult, expect);
});

Deno.test('full', async () => {
  const renderResult = await renderRollSet('Вершитель рока', {
    PVE: [
      ['Фугасный снаряд', 'Осмос', 'Запас патронов'], // 3038247973 1774574192 3418782618
      ['Светлячок', 'Жажда адреналина', 'Безумие'], // 3824105627 11612903   4104185692
    ],
    PVP: [
      ['Фугасный снаряд', 'Молотьба', 'Убийственный вихрь', 'Туннельное зрение'], // 3038247973 2726471870 2450788523 2946784966
      ['Глаз бури', 'Киллерский магазин', 'Первый выстрел', 'Светлячок'], // 699525795 1015611457 47981717 3824105627
    ],
  });

  const expect = `//notes: PVE@10/10, PVP@7/10
dimwishlist:item=2171478765&perks=3038247973,3824105627

//notes: PVE@7/10
dimwishlist:item=2171478765&perks=1774574192,3824105627
dimwishlist:item=2171478765&perks=3418782618,3824105627
dimwishlist:item=2171478765&perks=11612903,3038247973
dimwishlist:item=2171478765&perks=3038247973,4104185692

//notes: PVE@4/10
dimwishlist:item=2171478765&perks=11612903,1774574192
dimwishlist:item=2171478765&perks=11612903,3418782618
dimwishlist:item=2171478765&perks=1774574192,4104185692
dimwishlist:item=2171478765&perks=3418782618,4104185692

//notes: PVP@10/10
dimwishlist:item=2171478765&perks=699525795,3038247973

//notes: PVP@7/10
dimwishlist:item=2171478765&perks=699525795,2726471870
dimwishlist:item=2171478765&perks=699525795,2450788523
dimwishlist:item=2171478765&perks=699525795,2946784966
dimwishlist:item=2171478765&perks=1015611457,3038247973
dimwishlist:item=2171478765&perks=47981717,3038247973

//notes: PVP@4/10
dimwishlist:item=2171478765&perks=1015611457,2726471870
dimwishlist:item=2171478765&perks=1015611457,2450788523
dimwishlist:item=2171478765&perks=1015611457,2946784966
dimwishlist:item=2171478765&perks=47981717,2726471870
dimwishlist:item=2171478765&perks=47981717,2450788523
dimwishlist:item=2171478765&perks=47981717,2946784966
dimwishlist:item=2171478765&perks=2726471870,3824105627
dimwishlist:item=2171478765&perks=2450788523,3824105627
dimwishlist:item=2171478765&perks=2946784966,3824105627

`;

  assertEquals(renderResult, expect);
});

Deno.test('small PVE bugs', async () => {
  const renderResult = await renderRollSet('ВИДЕНИЕ', {
    PVE: [
      ['Система автоспуска', 'Излишки'], // 4267945040 3436462433
      ['Рубака', 'Один за всех'], // 4082225868 4049631843
    ],
    PVP: [
      ['Система автоспуска', 'Убийственный вихрь'], // 4267945040 2450788523
      ['Киллерский магазин', 'Рубака'], // 1015611457 4082225868
    ],
  });

  const expect = `//notes: PVE@10/10, PVP@7/10
dimwishlist:item=2414141462&perks=4082225868,4267945040

//notes: PVE@7/10
dimwishlist:item=2414141462&perks=3436462433,4082225868
dimwishlist:item=2414141462&perks=4049631843,4267945040

//notes: PVE@4/10
dimwishlist:item=2414141462&perks=3436462433,4049631843

//notes: PVP@10/10
dimwishlist:item=2414141462&perks=1015611457,4267945040

//notes: PVP@7/10
dimwishlist:item=2414141462&perks=1015611457,2450788523

//notes: PVP@4/10
dimwishlist:item=2414141462&perks=2450788523,4082225868

`;

  assertEquals(renderResult, expect);
});
