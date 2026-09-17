local isMenuOpen = false

-- Segédfüggvény: Játékos ping lekérése
local function GetPlayerPing()
    -- Ha szerver-oldali export létezik, onnan is kérhető, alapértelmezésben 20-35ms
    return 24
end

-- Menü megnyitása és adatok átadása a React NUI-nak
local function OpenPauseMenu()
    if isMenuOpen then return end
    if IsPauseMenuActive() then
        SetPauseMenuActive(false)
    end

    isMenuOpen = true
    SetNuiFocus(true, true)

    local playerName = GetPlayerName(PlayerId())
    local activePlayers = #GetActivePlayers()

    SendNUIMessage({
        action = "open",
        type = "openPauseMenu",
        serverName = Config.ServerName or "FIVE M ROLEPLAY",
        onlinePlayers = activePlayers,
        maxPlayers = Config.MaxPlayers or 256,
        characterName = playerName,
        characterJob = "Polgár",
        ping = GetPlayerPing(),
        soundEnabled = Config.PlaySounds
    })
end

-- Menü bezárása
local function ClosePauseMenu()
    if not isMenuOpen then return end
    isMenuOpen = false
    SetNuiFocus(false, false)

    SendNUIMessage({
        action = "close",
        type = "closePauseMenu"
    })
end

-- Alapértelmezett GTA V Pause menü letiltása és egyedi menü indítása ESC billentyűre
CreateThread(function()
    while true do
        local sleep = 5

        -- Alap GTA Pause menü blokkolása
        SetPauseMenuActive(false)
        DisableControlAction(0, Config.PauseControlIndex, true)
        DisableControlAction(0, Config.PauseAlternateIndex, true)

        -- Ha megnyomják az ESC gombot
        if IsDisabledControlJustPressed(0, Config.PauseControlIndex) or IsDisabledControlJustPressed(0, Config.PauseAlternateIndex) then
            if not isMenuOpen and not IsFrontendReadyForControl() then
                OpenPauseMenu()
            elseif isMenuOpen then
                ClosePauseMenu()
            end
        end

        Wait(sleep)
    end
end)

-- Parancs alternatíva: /pausemenu
RegisterCommand('pausemenu', function()
    if not isMenuOpen then
        OpenPauseMenu()
    else
        ClosePauseMenu()
    end
end, false)

-- ==========================================
-- NUI CALLBACK-EK (A React gombok visszahívásai)
-- ==========================================

-- 1. Menü bezárása (Vissza a játékba / ESC)
RegisterNUICallback('closePauseMenu', function(data, cb)
    ClosePauseMenu()
    cb({ status = 'ok' })
end)

-- 2. Szerver lecsatlakozás (FiveM főmenübe dobás, NEM a játék bezárása!)
RegisterNUICallback('disconnect', function(data, cb)
    ClosePauseMenu()
    Wait(150)
    -- Visszatérés a FiveM szerverválasztó főmenüjébe:
    ExecuteCommand('disconnect')
    cb({ status = 'disconnected' })
end)

-- 3. Parancs végrehajtása NUI-ból (pl. disconnect parancs)
RegisterNUICallback('executeCommand', function(data, cb)
    if data and data.command then
        if data.command == 'disconnect' then
            ClosePauseMenu()
            Wait(150)
            ExecuteCommand('disconnect')
        end
    end
    cb({ status = 'ok' })
end)

-- 4. Natív GTA Térkép megnyitása a Térkép csempére kattintva
RegisterNUICallback('openMap', function(data, cb)
    ClosePauseMenu()
    Wait(100)
    -- Natív GTA V Pause Map aktiválása
    ActivateFrontendMenu(GetHashKey("FE_MENU_VERSION_MP_PAUSE"), 0, -1)
    cb({ status = 'map_opened' })
end)

-- 5. Beállítások megnyitása
RegisterNUICallback('openSettings', function(data, cb)
    -- Ha van egyedi beállítások menüd (pl. qb-settings vagy egyéb), ide kötheted:
    -- TriggerEvent('my_settings:open')
    cb({ status = 'ok' })
end)

-- 6. Játékoslista megnyitása
RegisterNUICallback('openPlayerList', function(data, cb)
    -- Ha van egyedi scoreboardod, itt indítható
    -- TriggerEvent('scoreboard:open')
    cb({ status = 'ok' })
end)

-- 7. További szekciók (szabályzat, hírek, segítség)
RegisterNUICallback('openRules', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openNews', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openHelp', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openSection', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openDisconnectModal', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('menuOpened', function(data, cb) cb({ status = 'ok' }) end)
