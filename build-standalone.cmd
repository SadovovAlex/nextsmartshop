@echo off
REM Сборка проекта Next.js
echo Building Next.js project...
npm run build

REM Копирование папок public и .next/static
echo Copying public and .next/static folders...
xcopy /E /I public .next\standalone\public
xcopy /E /I .next\static .next\standalone\.next\static

REM Запуск минимального сервера
echo Starting the minimal server...
node .next\standalone\server.js

pause
