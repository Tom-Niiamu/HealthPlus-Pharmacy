@echo off
REM Signals the auto-commit watcher to stop gracefully.
setlocal
type nul > "%~dp0commit-watch.stop"
echo Stop signal sent. The watcher will exit within ~30 seconds.
endlocal
