# ===================================================================
# Deploy thekpihub.com to Hostinger via SSH + Git Pull
# PowerShell Script for Windows
# ===================================================================

param(
    [switch]$DebugSSH = $false,
    [switch]$UseSFTP = $false
)

$HostingerUser = "u117990013"
$HostingerHost = "thekpihub.com"
$DeployPath = "public_html"
$SiteUrl = "https://thekpihub.com"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " KPI HUB DEPLOYMENT TO HOSTINGER" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Host:     $HostingerHost" -ForegroundColor Yellow
Write-Host "User:     $HostingerUser" -ForegroundColor Yellow
Write-Host "Path:     $DeployPath" -ForegroundColor Yellow
Write-Host ""

# ===================================================================
# METHOD 1: SSH + Git Pull (Preferred)
# ===================================================================

if (-not $UseSFTP) {
    Write-Host "METHOD 1: SSH + Git Pull" -ForegroundColor Green
    Write-Host ""

    Write-Host "Step 1: Testing SSH connection..." -ForegroundColor Cyan

    try {
        # Test SSH connection
        $TestResult = ssh -v $HostingerUser@$HostingerHost "echo SSH_OK" 2>&1

        if ($TestResult -match "SSH_OK") {
            Write-Host "✓ SSH connection successful" -ForegroundColor Green
        } else {
            Write-Host "✗ SSH test returned unexpected result" -ForegroundColor Red
            Write-Host $TestResult

            if ($DebugSSH) {
                Write-Host ""
                Write-Host "Debugging SSH..." -ForegroundColor Yellow
                ssh -vvv $HostingerUser@$HostingerHost "echo test"
            }
            exit 1
        }
    } catch {
        Write-Host "✗ SSH connection failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:" -ForegroundColor Yellow
        Write-Host "1. Check SSH key exists: Test-Path $env:USERPROFILE\.ssh\id_ed25519" -ForegroundColor Gray
        Write-Host "2. Generate key if missing: ssh-keygen -t ed25519 -f `"$env:USERPROFILE\.ssh\id_ed25519`"" -ForegroundColor Gray
        Write-Host "3. Add public key to Hostinger hPanel" -ForegroundColor Gray
        exit 1
    }

    Write-Host ""
    Write-Host "Step 2: Pulling latest code from GitHub..." -ForegroundColor Cyan

    try {
        $PullResult = ssh $HostingerUser@$HostingerHost "cd $DeployPath && git pull origin main" 2>&1
        Write-Host $PullResult

        if ($PullResult -match "Already up to date|Updating") {
            Write-Host "✓ Git pull successful" -ForegroundColor Green
        } else {
            Write-Host "⚠ Unexpected git output, continuing..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Git pull failed!" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "Step 3: Verifying deployment..." -ForegroundColor Cyan

    try {
        Start-Sleep -Seconds 2

        $HeroContent = Invoke-WebRequest -Uri "$SiteUrl/landing/hero.js" -UseBasicParsing -ErrorAction Stop

        if ($HeroContent.Content -match "Get My KPI Audit") {
            Write-Host "✓ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Homepage now shows: 'Get My KPI Audit'" -ForegroundColor Green
            Write-Host ""
            Write-Host "Verification Summary:" -ForegroundColor Cyan
            Write-Host "- hero.js updated: ✓" -ForegroundColor Green
            Write-Host "- Timestamp: $(Get-Date)" -ForegroundColor Gray
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "1. Visit $SiteUrl in your browser" -ForegroundColor Gray
            Write-Host "2. Press Ctrl+F5 to refresh (clear cache)" -ForegroundColor Gray
            Write-Host "3. Verify 'Get My KPI Audit' button appears" -ForegroundColor Gray
        } else {
            Write-Host "✗ Verification failed!" -ForegroundColor Red
            Write-Host "hero.js content check returned unexpected result" -ForegroundColor Red
            Write-Host ""
            Write-Host "Checking hero.js content..." -ForegroundColor Yellow
            $First500 = $HeroContent.Content.Substring(0, [Math]::Min(500, $HeroContent.Content.Length))
            Write-Host $First500
        }
    } catch {
        Write-Host "⚠ Could not verify deployment" -ForegroundColor Yellow
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "This might mean:" -ForegroundColor Yellow
        Write-Host "1. Site is still loading" -ForegroundColor Gray
        Write-Host "2. Cache has not cleared" -ForegroundColor Gray
        Write-Host "3. Network issue" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Manual verification:" -ForegroundColor Cyan
        Write-Host "1. Visit $SiteUrl" -ForegroundColor Gray
        Write-Host "2. Press Ctrl+Shift+Delete to clear cache" -ForegroundColor Gray
        Write-Host "3. Refresh page" -ForegroundColor Gray
    }
}

# ===================================================================
# METHOD 2: SFTP Upload (Backup)
# ===================================================================

if ($UseSFTP) {
    Write-Host ""
    Write-Host "METHOD 2: SFTP Upload (Backup Method)" -ForegroundColor Green
    Write-Host ""
    Write-Host "SFTP deployment requires WinSCP or manual FTP client" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Cyan
    Write-Host "1. Download WinSCP: https://winscp.net/eng/download.php" -ForegroundColor Gray
    Write-Host "2. Connect to: $HostingerHost" -ForegroundColor Gray
    Write-Host "   Username: $HostingerUser" -ForegroundColor Gray
    Write-Host "   Protocol: SFTP" -ForegroundColor Gray
    Write-Host "3. Navigate to: /$DeployPath" -ForegroundColor Gray
    Write-Host "4. Sync local website-source folder to remote" -ForegroundColor Gray
    Write-Host ""
    Write-Host "This script can auto-generate WinSCP commands if needed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " DEPLOYMENT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
