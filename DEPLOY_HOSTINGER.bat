@echo off
REM ===================================================================
REM Deploy thekpihub.com to Hostinger via SSH + Git Pull
REM Windows Batch Script
REM ===================================================================

setlocal enabledelayedexpansion
set HOSTINGER_USER=u117990013
set HOSTINGER_HOST=thekpihub.com
set DEPLOY_PATH=public_html

echo.
echo ============================================================
echo  KPI HUB DEPLOYMENT TO HOSTINGER
echo ============================================================
echo.
echo Host:     %HOSTINGER_HOST%
echo User:     %HOSTINGER_USER%
echo Path:     %DEPLOY_PATH%
echo.

REM Step 1: Test SSH connection
echo Step 1: Testing SSH connection...
ssh -v %HOSTINGER_USER%@%HOSTINGER_HOST% "echo SSH_OK" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: SSH connection failed!
    echo.
    echo Debugging steps:
    echo 1. Check if you have SSH key set up:
    echo    ssh-keygen -t ed25519 -f "%USERPROFILE%\.ssh\id_ed25519"
    echo.
    echo 2. Add public key to Hostinger:
    echo    - Open Hostinger hPanel
    echo    - Go to Account Settings ^> SSH Keys
    echo    - Paste content of: %USERPROFILE%\.ssh\id_ed25519.pub
    echo.
    echo 3. Try SSH manually to add to known_hosts:
    echo    ssh %HOSTINGER_USER%@%HOSTINGER_HOST%
    echo.
    pause
    exit /b 1
)
echo ✓ SSH connection successful
echo.

REM Step 2: Git pull from remote
echo Step 2: Pulling latest code from GitHub...
ssh %HOSTINGER_USER%@%HOSTINGER_HOST% ^
  "cd %DEPLOY_PATH% && git pull origin main"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Git pull failed!
    echo.
    echo Possible issues:
    echo 1. Git not initialized on server
    echo 2. Wrong branch name
    echo 3. Uncommitted changes on server
    echo.
    pause
    exit /b 1
)
echo ✓ Git pull successful
echo.

REM Step 3: Verify deployment
echo Step 3: Verifying deployment...
for /f "tokens=*" %%A in ('curl -s https://thekpihub.com/landing/hero.js ^| find "Get My KPI Audit"') do set "RESULT=%%A"

if defined RESULT (
    echo ✓ DEPLOYMENT SUCCESSFUL!
    echo.
    echo Homepage now shows: "Get My KPI Audit"
    echo.
    echo Verification completed at: %date% %time%
) else (
    echo WARNING: Could not verify deployment
    echo.
    echo Checking what hero.js contains...
    curl -s https://thekpihub.com/landing/hero.js | find "primary:" | findstr /v "^$"
)

echo.
echo ============================================================
echo  DEPLOY COMPLETE
echo ============================================================
echo.
echo Next steps:
echo 1. Visit https://thekpihub.com in your browser
echo 2. Refresh the page (Ctrl+F5)
echo 3. Homepage should show "Get My KPI Audit" button
echo.
pause
