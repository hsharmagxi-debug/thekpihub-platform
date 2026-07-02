# The KPI Hub Repository Upgrade Setup Files

This folder contains one-click Windows setup/update files for the eight public `thekpihub` repositories covered by `thekpihub_repos_upgrade - Git.docx`.

## How to use
 
1. Double-click `preflight_check.bat` first. It validates script flow without cloning, installing, building, deploying, or starting services.
2. Double-click `run_all_upgrades.bat` to run every repository setup/check flow.
3. Or open a single repo folder under `repos\...` and double-click that repo's `.bat` file.
4. Scripts clone or update repositories into `%USERPROFILE%\thekpihub_repositories` by default.
5. Production deploy actions are optional and require confirmation inside the script.

## Requirements

- Git for Windows.
- Node.js/npm for JavaScript and TypeScript repositories.
- Python for `thekpihub-pipeline`.
- Docker Desktop for `aetherAI`.
- Optional deployment CLIs only when you choose production deployment:
  - Firebase CLI for `thekpihub-website`.
  - Vercel CLI for `ditto-wingman` frontend.
  - Railway CLI for `ditto-wingman` backend.

## Safety
 
These scripts do not store secrets. Configure secrets in each deployment platform or in local `.env` files that remain outside Git. The scripts ask before running deployment commands.
 
Existing checkouts are protected: if a repository has uncommitted local changes, the setup stops and asks you to commit, stash, or back up those changes before pulling.
 
Long-running local service starts are guarded. The TypeScript orchestrator and Next.js app only start when explicitly requested through script parameters, so the master runner will not hang on a server process by accident.
 
`aetherAI` can clone/update without Docker. Docker Compose validation and service startup are skipped with a warning until Docker Desktop is installed and running.
 
Security cleanup is still required before production exposure: `automated-website-builder` currently contains a hardcoded Telegram token, and `aetherAI` Docker Compose config contains local gateway/JWT secret values. Rotate these values and move secrets into environment-managed configuration before public deployment.