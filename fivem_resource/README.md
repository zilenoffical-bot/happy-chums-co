# FiveM Egyedi Pause Menü - Telepítési Útmutató

Ez a mappa tartalmazza a kész FiveM resource konfigurációt és a kliensoldali Lua scriptet.

## 🚀 Telepítési Lépések

### 1. Alkalmazás buildelése
Futtasd a build parancsot a projekt gyökerében:
```bash
npm run build
```
Ez legenerálja a `dist/` mappát a kész, optimalizált HTML, JS és CSS fájlokkal.

### 2. FiveM resource mappa létrehozása
Hozd létre a szervered resources mappájában az új resource-t (pl. `pausemenu`):
```text
resources/
  └── [custom]/
       └── pausemenu/
            ├── fxmanifest.lua
            ├── config.lua
            ├── client.lua
            └── dist/
                 ├── index.html
                 └── assets/
                      ├── *.js
                      ├── *.css
                      └── ...
```

### 3. Másold be a fájlokat
- Másold ide a `fivem_resource/fxmanifest.lua` fájlt
- Másold ide a `fivem_resource/config.lua` fájlt
- Másold ide a `fivem_resource/client.lua` fájlt
- Másold a projekt gyökerében lévő `dist/` mappát ide a `pausemenu/dist/` helyre

### 4. Engedélyezés a server.cfg-ben
Nyisd meg a `server.cfg` fájlodat és add hozzá:
```cfg
ensure pausemenu
```

---

## 🎮 Funkciók és Működés

1. **ESC billentyű kezelése**:
   - A `client.lua` automatikusan letiltja az alapértelmezett GTA V pause menüt (`DisableControlAction(0, 199, true)`).
   - ESC lenyomásakor megnyitja ezt a modern NUI menüt, és az egérfókuszt átadja (`SetNuiFocus(true, true)`).
   - ESC újbóli megnyomására a menü bezáródik és visszatér a játékhoz.

2. **Lecsatlakozás (Disconnect)**:
   - A jobb alsó, kompakt gombra kattintva megerősítés után a FiveM `ExecuteCommand("disconnect")` parancsa fut le.
   - **NEM zárja be az egész játékot** (nem 'quit'), csupán visszatér a FiveM főmenüjébe / szerverlistájába.
   - Hover esetén finom, diszkrét rázkódás (`subtle-disconnect-shake`) és élénk neon kiemelés (`disconnect-neon-highlight`) hívja fel rá a figyelmet a kompakt méret megtartása mellett.

3. **Várostérkép**:
   - A Térkép csempére kattintva a menü bezárul, és a FiveM azonnal megnyitja a natív GTA V frontend pause térképet (`ActivateFrontendMenu`).

4. **Karakter- és Szerveradatok**:
   - A menü automatikusan megkapja és kezeli a játékosszámot, pinget és karakternevet a `SendNUIMessage`-en keresztül.
