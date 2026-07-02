# 🚀 DEPLOYMENT GUIDE - thekpihub.com
**Hostinger Credentials:** u117990013@thekpihub.com

---

## QUICK START (3 Methods)

### METHOD 1: Simple Command (Fastest)
Copy and paste in PowerShell or Command Prompt:

```powershell
ssh u117990013@thekpihub.com "cd public_html && git pull origin main"
```

**Expected output:**
```
Already up to date.
or
Updating abc1234..def5678
Fast-forward
```

---

### METHOD 2: Batch File (Click and Run)
1. Navigate to: `C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\`
2. Double-click: `DEPLOY_HOSTINGER.bat`
3. Wait for "DEPLOY COMPLETE" message
4. Press any key to close

---

### METHOD 3: PowerShell Script (Detailed Logging)
```powershell
# Navigate to project folder
cd "C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub"

# Run with full logging
powershell -ExecutionPolicy Bypass -File .\DEPLOY_HOSTINGER.ps1

# Or with SSH debugging if connection fails:
powershell -ExecutionPolicy Bypass -File .\DEPLOY_HOSTINGER.ps1 -DebugSSH
```

---

## IF SSH DOESN'T WORK

### Step 1: Check if SSH key exists
```powershell
Test-Path $env:USERPROFILE\.ssh\id_ed25519
Test-Path $env:USERPROFILE\.ssh\id_rsa
```

If both return `False`, generate a key:

```powershell
# Generate ED25519 key (recommended)
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\id_ed25519" -N ""

# OR generate RSA key (older, still works)
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa" -N ""
```

### Step 2: Add Public Key to Hostinger

1. Copy your public key:
```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
```

2. Go to Hostinger hPanel:
   - https://hpanel.hostinger.com
   - Account Settings → SSH Keys
   - Click "Add SSH Key"
   - Paste the key content
   - Save

3. Wait 5-10 minutes for Hostinger to process

### Step 3: Test SSH Connection
```powershell
ssh u117990013@thekpihub.com "echo CONNECTION_OK"
```

Expected output:
```
CONNECTION_OK
```

---

## IF YOU NEED PASSWORD AUTH (Instead of SSH Key)

SSH can also use password authentication. Try:

```powershell
ssh u117990013@thekpihub.com
# Then enter your Hostinger password when prompted
```

---

## MANUAL DEPLOYMENT (Step by Step)

If all else fails, manual SSH:

```powershell
# 1. Connect to Hostinger
ssh u117990013@thekpihub.com

# 2. Once connected (you'll see a terminal prompt), run:
cd public_html
git status

# 3. Should show something like:
# On branch main
# Your branch is behind 'origin/main' by X commits

# 4. Pull latest code:
git pull origin main

# 5. Verify:
cat landing/hero.js | grep "Get My KPI Audit"

# 6. Exit:
exit
```

---

## VERIFY DEPLOYMENT WORKED

After running any deployment method, verify with:

```powershell
# Method 1: Check file directly on server
ssh u117990013@thekpihub.com "grep -o 'Get My KPI Audit' public_html/landing/hero.js"

# Method 2: Check live website
curl https://thekpihub.com/landing/hero.js | findstr "Get My KPI Audit"

# Method 3: Open in browser
# Visit https://thekpihub.com
# Press Ctrl+F5 (hard refresh to clear cache)
# Look for "Get My KPI Audit" button in nav
```

---

## SFTP ALTERNATIVE (Manual Upload)

If SSH completely fails, use SFTP:

### Option A: Use WinSCP (Easy GUI)

1. Download: https://winscp.net/eng/download.php
2. New Connection:
   - Host: `thekpihub.com`
   - User: `u117990013`
   - Auth: SSH or password
3. Navigate to: `public_html`
4. Drag website-source files over
5. Files sync to live site

### Option B: Use SFTP Command Line

```powershell
# Create SFTP batch file
@"
open u117990013@thekpihub.com
cd public_html
put -r "C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\website-source\*"
exit
"@ | Out-File sftp-commands.txt

# Run SFTP (requires WinSCP or OpenSSH SFTP installed)
sftp -b sftp-commands.txt u117990013@thekpihub.com
```

---

## TROUBLESHOOTING

### Issue: "Permission denied (publickey)"
**Solution:** SSH key not added to Hostinger
- Add public key to hPanel SSH Keys
- Wait 5-10 minutes
- Try again

### Issue: "Host key verification failed"
**Solution:** First connection - need to accept host key
**Fix:**
```powershell
# Type 'yes' when prompted to accept the key
ssh u117990013@thekpihub.com "echo test"
```

### Issue: "Repository not found"
**Solution:** Git repo not initialized on Hostinger
**Fix:** Run manually:
```powershell
ssh u117990013@thekpihub.com
cd public_html
git clone https://github.com/thekpihub/thekpihub-website.git .
git pull origin main
```

### Issue: "Git: command not found"
**Solution:** Git not installed on Hostinger server
**Action:** Contact Hostinger support to enable git

### Issue: "Changes not visible on live site"
**Solution:** Browser cache
**Fix:**
1. Ctrl+Shift+Delete to clear cache
2. Ctrl+F5 to hard refresh
3. Visit in incognito/private window

### Issue: "Old hero.js still showing"
**Solution:** CDN cache
**Action:** Contact Hostinger support to clear CDN cache

---

## AUTOMATED DEPLOYMENT SETUP (Future)

Once SSH works, you can set up Hostinger webhook for auto-deployment:

1. In Hostinger hPanel → Git Repositories
2. Create repository connection to:
   `https://github.com/thekpihub/thekpihub-website.git`
3. Enable auto-pull on push
4. From now on: Push to GitHub → Auto-deploy to Hostinger

---

## CREDENTIALS REFERENCE

- **Host:** thekpihub.com (or use Hostinger IP)
- **User:** u117990013
- **Auth:** SSH key (recommended) or password
- **Deploy Path:** public_html/
- **GitHub Repo:** https://github.com/thekpihub/thekpihub-website.git
- **GitHub Branch:** main

---

## QUICK COMMAND SHEET

```powershell
# Test SSH
ssh u117990013@thekpihub.com "echo test"

# Deploy (simple)
ssh u117990013@thekpihub.com "cd public_html && git pull origin main"

# Deploy (with output)
ssh u117990013@thekpihub.com "cd public_html && git pull origin main && git log --oneline -3"

# Check git status
ssh u117990013@thekpihub.com "cd public_html && git status"

# Force sync to latest
ssh u117990013@thekpihub.com "cd public_html && git fetch origin && git reset --hard origin/main"

# Verify deployment
curl https://thekpihub.com/landing/hero.js | findstr "Get My KPI Audit"

# Check file on server
ssh u117990013@thekpihub.com "cat public_html/landing/hero.js | grep 'primary:'" | head -20
```

---

## SUPPORT

If you get stuck:
1. Run: `powershell -ExecutionPolicy Bypass -File .\DEPLOY_HOSTINGER.ps1 -DebugSSH`
2. Share the error output
3. We'll troubleshoot together

---

**Ready? Start with METHOD 1 (Simple Command) above!**
