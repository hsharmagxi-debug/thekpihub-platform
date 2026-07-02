# GitHub Actions → Hostinger Deployment Setup

## Overview
Automatic deployment workflow: Push to `main` branch → GitHub Actions → SSH to Hostinger → Git pull & deploy

## Prerequisites

1. **Hostinger SSH Access**
   - SSH key pair generated
   - Public key added to Hostinger account
   - SSH access enabled in Hostinger control panel

2. **Repository Access**
   - Push permission to main branch
   - GitHub Secrets configured

## Setup Steps

### Step 1: Get Hostinger SSH Credentials

1. Login to Hostinger hPanel
2. Go to: **Hosting → Manage → SSH Access**
3. Create an SSH key pair (if not already created)
4. Download the private key (save securely)
5. Get your SSH details:
   - **Host**: Your Hostinger server hostname (e.g., `ssh.hostinger.com`)
   - **Username**: Your Hostinger SSH username
   - **Path**: Full path to your website directory (e.g., `/home/u123456789/domains/thekpihub.com/public_html`)

### Step 2: Configure GitHub Secrets

1. Go to your GitHub repo: https://github.com/hsharmagxi-debug/thekpihub-platform
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `HOSTINGER_SSH_KEY` | Contents of your private SSH key (entire file) |
| `HOSTINGER_HOST` | Your Hostinger hostname (e.g., `ssh.hostinger.com`) |
| `HOSTINGER_USER` | Your Hostinger SSH username |
| `HOSTINGER_PATH` | Full path to website directory on Hostinger |

### Step 3: Test the Workflow

1. Make a small change to the repo (e.g., update README)
2. Commit and push to `main`
3. Go to: **Actions** tab in GitHub repo
4. Watch the workflow run
5. Check deployment status

### Step 4: Manual Deployment (Alternative)

If GitHub Actions setup isn't available, use manual SSH:

```bash
ssh -i ~/.ssh/hostinger_key user@hostinger.com
cd /home/u123456789/domains/thekpihub.com/public_html
git fetch origin
git checkout main
git pull origin main
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied (publickey) | Verify SSH key is added to Hostinger account |
| Repository not found | Ensure git is initialized on Hostinger server |
| Deployment still stuck | Check file permissions (755 for dirs, 644 for files) |
| Changes not visible | Clear browser cache, check if you're on correct domain |

## Next Steps

1. Update `.github/workflows/deploy-hostinger.yml` with your actual credentials
2. Test the workflow with a dummy push
3. Monitor the Actions tab for deployment status
4. Once working, all future pushes to `main` will auto-deploy

---

**Documentation**: For production-fixes setup, see `PHASED_EXECUTION_GUIDE.md`
