interface RollSets {
  [key: string]: RollSet;
}

export type RollSet = {
  [key in 'pvp' | 'pve']: string[][];
};

export const rollSets: RollSets = {
  Лисичка: {
    pve: [
      ['Изгой', 'Стреляй-подбирай'],
      ['Надгробие', 'Фугасный снаряд', 'Магазин для множественных убийств'],
    ],
    pvp: [
      ['Убийственный вихрь', 'На бис', 'Туннельное зрение'],
      ['Гармония', 'Фугасный снаряд'],
    ],
  },
};
