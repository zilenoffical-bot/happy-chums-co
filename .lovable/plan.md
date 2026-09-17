# Dinamikus panda animáció

## Változtatások
- A képkockánként ugráló animáció helyett a panda folyamatosan, lágy gyorsulással bújik elő a Kilépés panel mögül.
- A panda feje finoman követi az egér irányát, miközben előbújva enyhén lebeg.
- A két szem külön rétegen, valós időben követi az egérmutatót, és a szemgolyók a szemük határán belül maradnak.
- Az egér levételekor a panda ugyanilyen folyamatos mozgással visszabújik a panel mögé.

## Technikai részletek
- Egy tiszta, teljes panda pózt használok alapként a meglévő képsorból.
- A szemkövetést a panda helyzetéből számított, korlátozott vízszintes és függőleges elmozdulás vezérli.
- A panel marad elöl, így a mancsok és a test továbbra is annak felső peremére támaszkodnak.
