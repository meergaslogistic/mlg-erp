@echo off
title MLG Advanced ERP - Starting...
cd /d "%~dp0"
echo.
echo  ========================================
echo   MLG Advanced ERP - Meer Logistics
echo  ========================================
echo.
echo  Open index.html from this folder.
echo  Do NOT open files from GitHub in the browser.
echo.
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  start "" http://localhost:8765/index.html
  python -m http.server 8765
  goto :eof
)
where python3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  start "" http://localhost:8765/index.html
  python3 -m http.server 8765
  goto :eof
)
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  start "" http://localhost:8765/index.html
  py -m http.server 8765
  goto :eof
)
echo Python not found. Opening index.html directly...
start "" "index.html"
