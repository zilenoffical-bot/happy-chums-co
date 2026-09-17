export const fxmanifestCode = `fx_version 'cerulean'
game 'gta5'

author 'Crafty Menu Maker'
description 'FiveM Custom Grid Pause Menu (Modern React + Tailwind)'
version '1.0.0'

ui_page 'dist/index.html'

files {
    'dist/index.html',
    'dist/assets/**',
    'dist/**'
}

client_scripts {
    'config.lua',
    'client.lua'
}
`;

export const configLuaCode = `Config = {}

-- Szerver alapadatok a Pause Menühöz
Config.ServerName = "NIGHT CITY ROLEPLAY"
Config.MaxPlayers = 256
Config.DiscordLink = "https://discord.gg/yourserver"
Config.WebsiteLink = "https://yourserver.hu"

-- Billentyűzet gomb az ESC mellett (alapértelmezett: ESC / Pause gomb letiltása és átvétele)
Config.PauseControlIndex = 199 -- INPUT_FRONTEND_PAUSE (ESC)
Config.PauseAlternateIndex = 200 -- INPUT_FRONTEND_PAUSE_ALTERNATE

-- Engedélyezve legyen-e a hang a menüben
Config.PlaySounds = true
`;

export const clientLuaCode = `local isMenuOpen = false

local function GetPlayerPing()
    return 24
end

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

local function ClosePauseMenu()
    if not isMenuOpen then return end
    isMenuOpen = false
    SetNuiFocus(false, false)

    SendNUIMessage({
        action = "close",
        type = "closePauseMenu"
    })
end

-- Alap GTA V Pause menü blokkolása és egyedi menü nyitása ESC-re
CreateThread(function()
    while true do
        local sleep = 5
        SetPauseMenuActive(false)
        DisableControlAction(0, Config.PauseControlIndex, true)
        DisableControlAction(0, Config.PauseAlternateIndex, true)

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

RegisterCommand('pausemenu', function()
    if not isMenuOpen then OpenPauseMenu() else ClosePauseMenu() end
end, false)

-- NUI CALLBACK-EK
RegisterNUICallback('closePauseMenu', function(data, cb)
    ClosePauseMenu()
    cb({ status = 'ok' })
end)

RegisterNUICallback('disconnect', function(data, cb)
    ClosePauseMenu()
    Wait(150)
    ExecuteCommand('disconnect')
    cb({ status = 'disconnected' })
end)

RegisterNUICallback('openMap', function(data, cb)
    ClosePauseMenu()
    Wait(100)
    ActivateFrontendMenu(GetHashKey("FE_MENU_VERSION_MP_PAUSE"), 0, -1)
    cb({ status = 'map_opened' })
end)

RegisterNUICallback('openSettings', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openPlayerList', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openRules', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openNews', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openHelp', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openSection', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('openDisconnectModal', function(data, cb) cb({ status = 'ok' }) end)
RegisterNUICallback('menuOpened', function(data, cb) cb({ status = 'ok' }) end)
`;
