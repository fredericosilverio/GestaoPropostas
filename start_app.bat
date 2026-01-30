@echo off
echo ==========================================
echo   Iniciando Sistema de Gestao Propostas
echo   Backend: http://localhost:3333
echo   Frontend: http://localhost:5173
echo ==========================================

echo Iniciando Backend...
start "Gestao Propostas - Backend" /D "server" cmd /k "npm run dev"

echo Aguardando 5 segundos para iniciar o Frontend...
timeout /t 5

echo Iniciando Frontend...
start "Gestao Propostas - Frontend" /D "client" cmd /k "npm run dev"

echo Pronto!
