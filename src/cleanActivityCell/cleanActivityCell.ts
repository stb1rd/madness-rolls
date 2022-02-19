const madnessFails = new Map([
  ['Изгой-СтрекозаИзгой - Полоса удач', 'Изгой - Стрекоза/Полоса удач'],
  [
    'Киллерский магазин - Усиленные резервы Дальномер - Полоса удач/Усиленные резервы',
    'Киллерский магазин/Дальномер - Полоса удач/Усиленные резервы',
  ],
]);

export const cleanActivityCell = (cell: string): string[][] => {
  if (cell === '-') {
    return [];
  }

  const cleanCell = cell.replace(/"|Curated Roll \(|\)|\n|\r/g, '');
  const correctCell = madnessFails.get(cleanCell) || cleanCell;
  return correctCell.split(' - ').map((x) => x.split('/'));
};
