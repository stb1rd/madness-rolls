import { assertEquals } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import { cleanActivityCell } from './cleanActivityCell.ts';

Deno.test('empty', () => {
  assertEquals(cleanActivityCell('-', '-'), []);
});

Deno.test({ name: 'simple' }, () => {
  assertEquals(cleanActivityCell('Кобура с автоподзарядом\nЧестолюбивый ассасин', 'Безумие\nКинетическая дрожь\nДиверсант'), [
    ['Кобура с автоподзарядом', 'Честолюбивый ассасин'],
    ['Безумие', 'Кинетическая дрожь', 'Диверсант'],
  ]);
});

Deno.test('trim \\r', () => {
  assertEquals(cleanActivityCell('Кобура с автоподзарядом', 'Честолюбивый ассасин\r'), [
    ['Кобура с автоподзарядом'],
    ['Честолюбивый ассасин'],
  ]);
});
