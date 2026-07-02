# GitHub Actions Setup — Complete Guide
**Status**: ✅ Workflow ready, waiting for secrets  
**Date**: 2026-07-02

---

## 🔐 STEP 1: ADD GITHUB SECRETS

### Navigate to Settings

1. Go to: https://github.com/hsharmagxi-debug/thekpihub-platform
2. Click: **Settings** (top-right)
3. Left sidebar: **Secrets and variables** → **Actions**

### Add 4 Secrets

You'll add these 4 secrets. Click "New repository secret" for each:

#### Secret 1: HOSTINGER_SSH_KEY
- **Name**: `HOSTINGER_SSH_KEY`
- **Value**: [Your SSH private key content]

**To get your SSH key:**

**On Windows (PowerShell):**
```powershell
# Get your SSH private key content
Get-Content -Path $env:USERPROFILE\.ssh\id_ed25519 -Raw | Set-Clipboard
# Now paste into GitHub secret field
```

**Or if you have id_rsa:**
```powershell
Get-Content -Path $env:USERPROFILE\.ssh\id_rsa -Raw | Set-Clipboard
```

**On Mac/Linux:**
```bash
cat ~/.ssh/id_ed25519  # or id_rsa
# Copy the entire output (including BEGIN/END lines)
```

---

#### Secret 2: HOSTINGER_HOST
- **Name**: `HOSTINGER_HOST`
- **Value**: `thekpihub.com`

---

#### Secret 3: HOSTINGER_USER
- **Name**: `HOSTINGER_USER`
- **Value**: `u117990013@thekpihub.com`

---

#### Secret 4: HOSTINGER_PATH
- **Name**: `HOSTINGER_PATH`
- **Value**: `/home/u117990013/public_html`

---

## 🔍 VERIFY SECRETS ADDED

After adding all 4 secrets, you should see:

```
✓ HOSTINGER_SSH_KEY     Updated 1 second ago
✓ HOSTINGER_HOST        Updated 1 second ago
✓ HOSTINGER_USER        Updated 1 second ago
✓ HOSTINGER_PATH        Updated 1 second ago
```

---

## 🚀 WORKFLOW READY

The GitHub Actions workflow is **already configured** at:
```
.github/workflows/deploy-hostinger.yml
```

**Triggers:**
- ✅ Automatically runs on push to `main` branch
- ✅ Can be triggered manually via "Run workflow" button

---

## 📋 WORKFLOW PROCESS

When you push to main (or trigger manually):

1. GitHub checks out the code
2. Sets up SSH connection with your private key
3. Connects to: `u117990013@thekpihub.com`
4. Runs: `cd /home/u117990013/public_html && git pull origin main`
5. Reports success or failure

**Duration**: ~30-60 seconds per deployment

---

## ✅ TEST THE WORKFLOW

### Option A: Test Automatically (Recommended)

1. Make a small change to a file (e.g., add a comment)
2. Commit & push to main:
   ```bash
   git add .
   git commit -m "test: trigger github actions workflow"
   git push origin main
   ```
3. Go to: https://github.com/hsharmagxi-debug/thekpihub-platform/actions
4. Watch the workflow run in real-time

### Option B: Manual Trigger

1. Go to: https://github.com/hsharmagxi-debug/thekpihub-platform/actions
2. Click: "Deploy to Hostinger" workflow
3. Click: "Run workflow" button
4. Watch it execute

---

## 📊 WORKFLOW STATUS

Check deployment history:

**Go to**: https://github.com/hsharmagxi-debug/thekpihub-platform/actions

**You'll see:**
- ✅ Successful deployments (green checkmark)
- ❌ Failed deployments (red X)
- ⏳ In-progress deployments (yellow dot)

Click any run to see full logs.

---

## 🆘 IF DEPLOYMENT FAILS

### Common Issues & Solutions

| Error | Solution |
|-------|----------|
| "Permission denied (publickey)" | SSH key not added to Hostinger authorized_keys |
| "Git not found" | SSH into Hostinger manually to verify git is installed |
| "Could not resolve hostname" | HOSTINGER_HOST secret is wrong (should be `thekpihub.com`) |
| "Path does not exist" | HOSTINGER_PATH secret is wrong (should be `/home/u117990013/public_html`) |

### Debug Steps

1. Check workflow logs: https://github.com/hsharmagxi-debug/thekpihub-platform/actions
2. Click failed run → click step that failed
3. Read error message carefully
4. Fix the issue (usually secrets)
5. Run workflow again

---

## 🎯 DEPLOYMENT WORKFLOW

Now that GitHub Actions is set up:

### For Every Update:
```bash
# Make changes
git add .
git commit -m "feat: your description"
git push origin main
# ✅ GitHub Actions automatically deploys!
```

### Instant Deployment:
- Push to main → Automatic deploy within 60 seconds
- No manual SSH needed
- Logs visible in GitHub Actions tab

---

## 📝 QUICK REFERENCE

**Secrets Dashboard**: https://github.com/hsharmagxi-debug/thekpihub-platform/settings/secrets/actions

**Workflow Status**: https://github.com/hsharmagxi-debug/thekpihub-platform/actions

**Workflow File**: `.github/workflows/deploy-hostinger.yml`

---

## ✨ AUTOMATION ENABLED

Once secrets are added:
- Every push to `main` = automatic deployment ✅
- Manual trigger available in Actions tab ✅
- Deployment logs visible for debugging ✅
- Rollback to previous version via git if needed ✅

---

**Status**: Ready for secrets setup ✅  
**Next**: Add 4 secrets to GitHub (5 minutes)

🎉 **After secrets are added, your deployment pipeline is fully automated!**
