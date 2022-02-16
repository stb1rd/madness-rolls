import { assertEquals } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import { renderRollSet } from './renderRollSet.ts';

Deno.test('nothing', () => {
  const result = renderRollSet('', { pve: [[]], pvp: [[]] });
  assertEquals(result, '');
});

Deno.test('everything', () => {
  const renderResult = renderRollSet('khvostov', {
    pve: [
      ['perk-1-1', 'perk-1-2', 'perk-1-3'],
      ['perk-2-1', 'perk-2-2'],
    ],
    pvp: [
      ['perk-3-1', 'perk-3-2'],
      ['perk-4-1', 'perk-4-2', 'perk-4-2'],
    ],
  });

  const md = `## khvostov
### PVE
#### 100%
\`name:khvostov and perkname:perk-1-1 and perkname:perk-2-1\`

`;

  assertEquals(renderResult, md);
});
