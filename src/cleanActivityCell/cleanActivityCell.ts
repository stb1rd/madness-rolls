const madnessFails = new Map([
  ['Изгой-СтрекозаИзгой - Полоса удач', 'Изгой - Стрекоза/Полоса удач'],
  [
    'Киллерский магазин - Усиленные резервы Дальномер - Полоса удач/Усиленные резервы',
    'Киллерский магазин/Дальномер - Полоса удач/Усиленные резервы',
  ],
]);

export const cleanActivityCell = (cell: string): string[][] => {
  if (['', '-', 'Слишком много роллов'].includes(cell)) {
    return [];
  }

  const cleanCell = cell.replace(/"|Curated Roll \(|\)|\n|\r/g, '').replace(/^\//, '');
  const correctCell = madnessFails.get(cleanCell) || cleanCell;
  return correctCell.split(' - ').map((x) => x.split('/'));
};
