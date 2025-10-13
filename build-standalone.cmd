@echo off
REM Удаление старого ZIP-архива, если он существует
if exist release.zip del release.zip

REM Сборка проекта Next.js
echo Building Next.js project...
call yarn build

