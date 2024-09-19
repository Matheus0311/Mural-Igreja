@echo off
title Mural Digital da Igreja Batista Ebenezer de Ivinhema

echo Iniciando sistema de mural...
ping localhost -n 2 > nul
echo Verificando serviços...
ping localhost -n 2 > nul
echo Carregando segurança...
ping localhost -n 2 > nul
echo Mural Digital da Igreja Batista Ebenezer de Ivinhema

REM Iniciar o AnyDesk
echo Iniciando AnyDesk...
start "" "C:\Program Files (x86)\AnyDesk\AnyDesk.exe"
ping localhost -n 5 > nul

REM Verificar sincronização do OneDrive (abrindo a pasta OneDrive)
echo Verificando sincronizacao do OneDrive...
start "" "C:\Users\%USERNAME%\OneDrive"
ping localhost -n 3 > nul

REM Iniciar o servidor Node.js
echo Iniciando servidor do Mural...
cd C:\Mural
start "" cmd /k "node app.js"
ping localhost -n 3 > nul

:: Abrir o Microsoft Edge no mural em modo fullscreen
start msedge --start-fullscreen http://localhost:3000

start "" "C:\Mural\abrir-edge-fullscreen.ahk"

exit
