# ===================================================================
# commit-watch.ps1
# Watches this Git repo for saved changes and auto-commits them.
# The repo's post-commit hook then auto-pushes to GitHub, so every
# change of code ends up on GitHub without manual steps.
#
# Start it:  start-auto-commit.bat
# Stop it:   stop-auto-commit.bat   (or delete the running process)
# ===================================================================
$ErrorActionPreference = 'Continue'

# Resolve the repo root (this script's own folder) so it works from anywhere.
$repo = Split-Path -Parent $MyInvocation.MyCommand.Definition
$log  = Join-Path $repo 'commit-watch.log'
$stop = Join-Path $repo 'commit-watch.stop'
$interval = 30   # seconds between checks

function Log($msg) {
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line = "$ts  $msg"
    try { Add-Content -Path $log -Value $line -Encoding utf8 } catch { }
    Write-Host $line
}

Log "Auto-commit watcher started (repo: $repo)"

try {
    Set-Location $repo
    # Make sure we are actually inside a git repo before looping.
    git rev-parse --is-inside-work-tree | Out-Null
} catch {
    Log "ERROR: not a git repository at $repo. Exiting."
    exit 1
}

while ($true) {
    Start-Sleep -Seconds $interval

    # Graceful stop: dropping a 'commit-watch.stop' file ends the loop.
    if (Test-Path $stop) {
        Log "Stop file found. Shutting down watcher."
        Remove-Item $stop -Force -ErrorAction SilentlyContinue
        break
    }

    try {
        Set-Location $repo
        $status = git status --porcelain
        if (-not $status) { continue }   # nothing to do

        $count = ($status | Measure-Object -Line).Lines
        $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        git add -A
        $msg = "Auto-commit: $count changed file(s) @ $stamp"
        $out = git commit -m $msg 2>&1 | Out-String
        Log "$msg"
        Log $out.Trim()
        # The post-commit hook handles `git push origin`. If push needs
        # network/auth it will warn but the commit is kept locally.
    } catch {
        Log "ERROR during commit: $_"
    }
}

Log "Auto-commit watcher stopped."
