import { assertEquals } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import { cleanActivityCell } from './cleanActivityCell.ts';

Deno.test('empty', () => {
  assertEquals(cleanActivityCell('-'), []);
});

Deno.test('simple', () => {
  assertEquals(cleanActivityCell('Полоса удач - Киллерский магазин'), [['Полоса удач'], ['Киллерский магазин']]);
});

Deno.test('trim \\r', () => {
  assertEquals(cleanActivityCell('Полоса удач - Киллерский магазин\r'), [['Полоса удач'], ['Киллерский магазин']]);
});

Deno.test('curated', () => {
  const input = `"Curated Roll (Изгой-Стрекоза)\nИзгой - Полоса удач"`;
  assertEquals(cleanActivityCell(input), [['Изгой'], ['Стрекоза', 'Полоса удач']]);
});
