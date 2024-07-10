# Роллы великого и могучего MadnessBucaneer-а для DIM

Чистить волт и сравнивать руками было неудобно - поэтому я прифигел написал маппер для этой [офигенной гугл-таблицы](https://docs.google.com/spreadsheets/d/1wzWC9J-CpcO07n6HLuH7WoMuXlPkkZM9WRqRSlyLt08/edit#gid=968214664). Некоторые фичи остались только там, типа что откуда падает.

## Как работает маппер

Пример - Утрата (Адаптивный пулемет)
1 ячейка:
Восстановление
С четвертого раза получится
Жизнеобеспечение

2 ячейка:
Смертельная серия
Усиленные резервы
Сосредоточенная ярость

Ранг SS будет только у одного ролла - "Восстановление" + "Смертельная серия", так как оба перка лучшие
Ранг AS будет у 2 роллов, так как один перк лучший, а другой на втором месте. Примеры - "Восстановление" + "Усиленные резервы", "С четвертого раза получится" + "Смертельная серия"
И так далее по аналогии

## Как юзать

- Идем в [DIM/Settings/Wishlist](https://app.destinyitemmanager.com/settings)
- Копируем туда `https://raw.githubusercontent.com/stb1rd/madness-rolls/main/wish_list.txt`
- Сортируем по типу-названию
- Ищем что-то подобное

```
wishlistnotes:PVE-SS
wishlistnotes:PVE-AS
wishlistnotes:PVE-AA
wishlistnotes:PVE-AB
---
wishlistnotes:PVP-SS
wishlistnotes:PVP-AS
wishlistnotes:PVP-AA
wishlistnotes:PVP-AB
```

...

- PROFIT

## Как обновлять

- обновить CSV (control + option + f, d, c // меню файл, option + down // переход на следующий лист)
- открываем DIM, смотрим запросы, находим Manifest, находим `ru/DestinyInventoryItemDefinition`, берем его GUID
- `yarn fetch-inv PASTE_GUID_HERE`
- `yarn make-inv`
- `yarn make-a-wish`

## Баги

- Пси герметика V
- Старый, но надежный
- Глиссандо-47
- КАБАНИЙ БИВЕНЬ
