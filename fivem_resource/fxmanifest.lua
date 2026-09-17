fx_version 'cerulean'
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
