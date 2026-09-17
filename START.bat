@echo off
title MLG Advanced ERP - Starting...
cd /d "%~dp0"

echo.
echo  ========================================
echo   MLG Advanced ERP - Meer Logistics
echo  ========================================
echo.
echo  Starting local server...
echo  Browser will open automatically.
echo.
echo  Press Ctrl+C to stop the server when done.
echo.

:: Try Python first (most common)
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  start "" http://localhost:8765
  python -m http.server 8765
  goto :eof
)

where python3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  start "" http://localhost:8765
  python3 -m http.server 8765
  goto :eof
)

:: Fallback: try py launcher
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  start "" http://localhost:8765
  py -m http.server 8765
  goto :eof
)

echo.
echo  [ERROR] Python not found.
echo  Please install Python from https://python.org
echo  (or open index.html directly in browser - some features may be limited)
echo.
pause
start "" "index.html"
