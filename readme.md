# Роллы великого и могучего MadnessBucaneer-а для DIM

Чистить волт и сравнивать руками было неудобно - поэтому я прифигел написал маппер для этой [офигенной гугл-таблицы](https://docs.google.com/spreadsheets/d/1wzWC9J-CpcO07n6HLuH7WoMuXlPkkZM9WRqRSlyLt08/edit#gid=968214664). Некоторые фичи остались только там, типа что откуда падает.

## Как юзать

- Идем в [DIM/Settings/Wishlist](https://app.destinyitemmanager.com/settings)
- Копируем туда `https://raw.githubusercontent.com/stb1rd/madness-rolls/main/wish_list.txt`
- Сортируем по типу-названию
- Ищем что-то подобное
```
wishlistnotes:PVE@10/10
wishlistnotes:PVE@7/10
wishlistnotes:PVE@4/10
---
wishlistnotes:PVP@10/10
wishlistnotes:PVP@7/10
wishlistnotes:PVP@4/10
```
...
- PROFIT

## Как обновлять
- обновить CSV (control + option + f // меню файл, option + down // переход на следующий лист)
- открываем DIM, смотрим запросы, находим Manifest, находим `ru/DestinyInventoryItemDefinition`, берем его GUID
- `yarn fetch-inv PASTE_GUID_HERE`
- `yarn make-inv'
- 'yarn make-a-wish`

## Bugs
- БОГОУБИЙЦА
- Мертвый груз
- Уроженец Рииса // trait sort
