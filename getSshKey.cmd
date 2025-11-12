@echo off
echo ========================================
echo    SSH Key Setup Script
echo ========================================

set SSH_KEY=%USERPROFILE%\.ssh\id_rsa
set SERVER=root@222.222.222.222

echo Step 1: Generating SSH key...
if not exist "%SSH_KEY%" (
    ssh-keygen -t rsa -b 4096 -f "%SSH_KEY%" -N ""
    if errorlevel 1 (
        echo Error generating SSH key
        pause
        exit /b 1
    )
) else (
    echo SSH key already exists at: %SSH_KEY%
)

echo.
echo Step 2: Copying public key to server...
echo Please enter password when prompted:
ssh-copy-id -i "%SSH_KEY%" %SERVER%

if errorlevel 1 (
    echo.
    echo Alternative method - manual copy:
    echo 1. Your public key is at: %SSH_KEY%.pub
    echo 2. Manually add it to /root/.ssh/authorized_keys on the server
    echo.
) else (
    echo.
    echo SSH key setup completed successfully!
)

echo.
echo Step 3: Testing connection...
ssh -i "%SSH_KEY%" %SERVER% "echo SSH key authentication successful!"

pause