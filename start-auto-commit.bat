@echo off
REM Starts the auto-commit watcher hidden in the background.
REM It polls the repo every 30s and commits any saved changes;
REM the post-commit hook then pushes to GitHub automatically.
setlocal
set "SCRIPT=%~dp0commit-watch.ps1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "Start-Process powershell.exe -WindowStyle Hidden -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','%SCRIPT%'"
echo Auto-commit watcher started (hidden). See commit-watch.log for activity.
endlocal
