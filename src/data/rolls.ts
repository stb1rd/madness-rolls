interface RollSets {
  [key: string]: RollSet;
}

export type RollSet = {
  [key in 'PVP' | 'PVE']: string[][];
};

export const rollSets: RollSets = {
  Лисичка: {
    PVE: [
      ['Изгой', 'Стреляй-подбирай'],
      ['Надгробие', 'Фугасный снаряд', 'Магазин для множественных убийств'],
    ],
    PVP: [
      ['Убийственный вихрь', 'На бис', 'Туннельное зрение'],
      ['Гармония', 'Фугасный снаряд'],
    ],
  },
};
