@echo off
title Sofía - Iniciar Tienda
color 0A
cd /d "%~dp0"

echo ========================================
echo        Sofía - Tienda Virtual
echo ========================================
echo.

REM Verificar que Docker este corriendo
docker ps >nul 2>&1
if errorlevel 1 (
    echo [!] Docker Desktop no esta corriendo.
    echo     Abrelo y espera a "Engine running".
    echo.
    pause
    exit /b
)

echo [1/4] Levantando PostgreSQL...
docker compose up -d

echo.
echo [2/4] Aplicando migraciones de la base de datos...
pushd "%~dp0apps\api"
pnpm exec prisma migrate deploy
if errorlevel 1 (
    echo [!] No se pudieron aplicar las migraciones.
    popd
    pause
    exit /b 1
)
popd

echo.
echo [3/4] Arrancando Backend (API)...
start "Sofía Backend" cmd /k "cd /d "%~dp0apps\api" && pnpm exec tsx watch src/server.ts"

timeout /t 3 /nobreak >nul

echo.
echo [4/4] Arrancando Frontend (Web)...
start "Sofía Frontend" cmd /k "cd /d "%~dp0" && pnpm --filter web dev"

echo.
echo ========================================
echo           Todo listo!
echo ========================================
echo.
echo   Backend:  http://localhost:4000/api
echo   Frontend: http://localhost:5173
echo.
echo   Se abrieron 2 ventanas nuevas.
echo   Cierralas para detener los servidores.
echo.
timeout /t 5 /nobreak >nul
start http://localhost:5173
exit