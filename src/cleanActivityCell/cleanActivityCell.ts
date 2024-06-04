const madnessFails = new Map([
  ['Изгой-СтрекозаИзгой - Полоса удач', 'Изгой - Стрекоза/Полоса удач'],
  [
    'Киллерский магазин - Усиленные резервы Дальномер - Полоса удач/Усиленные резервы',
    'Киллерский магазин/Дальномер - Полоса удач/Усиленные резервы',
  ],
]);

export const cleanActivityCell = (cell1: string, cell2: string): string[][] => {
  if (['', '-', 'Слишком много роллов'].includes(cell1) || ['', '-', 'Слишком много роллов'].includes(cell2)) {
    return [];
  }

  return [cleanSingleCell(cell1), cleanSingleCell(cell2)];
};

const cleanSingleCell = (cell: string): string[] => {
  const cleanCell = cell.replace(/"|Curated Roll \(|\)|\r/g, '').replace(/^\//, '');
  const correctCell = madnessFails.get(cleanCell) || cleanCell;
  return correctCell.split(/\n/);
};
