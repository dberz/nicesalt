#!/usr/bin/env bash
set -uo pipefail

# ship.sh — build, commit, push. Vercel deploys automatically from main.
#
#   ./ship.sh                    # commits as "Update site"
#   ./ship.sh "Add pricing"      # custom commit message
#   ./ship.sh --dry-run "msg"    # build and show what would ship, no push
#
# Auth, in order of preference:
#   1. GITHUB_TOKEN in the environment
#   2. .deploy-token in this folder (gitignored)
#   3. your normal git credentials (this is what happens on your Mac)

cd "$(dirname "$0")" || exit 1

REPO_PATH="dberz/nicesalt"
BRANCH="main"
DRY_RUN=0

if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=1
  shift
fi
MSG="${1:-Update site}"

fail() { echo "!! $*" >&2; exit 1; }

# ---------------------------------------------------------------- build

echo "==> Building"
npm run build >/tmp/nicesalt-build.log 2>&1 || {
  tail -30 /tmp/nicesalt-build.log
  fail "Build failed. Nothing committed, nothing pushed."
}
echo "    Build clean."

# ---------------------------------------------------------------- commit

if [ -n "$(git status --porcelain)" ]; then
  echo "==> Changes to ship:"
  git status --short | sed 's/^/    /'
else
  echo "==> No local changes."
fi

if [ "$DRY_RUN" = "1" ]; then
  echo "==> Dry run. Stopping before commit."
  exit 0
fi

git add -A || fail "git add failed."

if git diff --cached --quiet; then
  echo "==> Nothing new to commit."
else
  git commit -m "$MSG" >/dev/null || fail "git commit failed."
  echo "==> Committed: $MSG"
fi

# ---------------------------------------------------------------- push

TOKEN="${GITHUB_TOKEN:-}"
if [ -z "$TOKEN" ] && [ -f .deploy-token ]; then
  TOKEN="$(tr -d '[:space:]' < .deploy-token)"
fi

# Sanity-check the token before using it. The common failure is running
# `pbpaste > .deploy-token` while the clipboard still holds the setup
# instructions, which writes shell text into the file instead of a token.
if [ -n "$TOKEN" ] && ! printf '%s' "$TOKEN" | grep -qE '^(github_pat_|ghp_|gho_|ghu_|ghs_|ghr_)'; then
  echo "!! .deploy-token does not look like a GitHub token." >&2
  echo "   Expected it to start with github_pat_ or ghp_." >&2
  echo "   Fix: copy the token itself, then run" >&2
  echo "     pbpaste > .deploy-token && chmod 600 .deploy-token" >&2
  echo "   Falling back to your normal git credentials." >&2
  TOKEN=""
fi

echo "==> Pushing to $BRANCH"

if [ -n "$TOKEN" ]; then
  # Token goes in the URL for this one command only, so it never lands in
  # .git/config. Output is filtered in case git echoes the URL on error.
  git push "https://x-access-token:${TOKEN}@github.com/${REPO_PATH}.git" \
    "HEAD:${BRANCH}" 2>&1 | sed "s#${TOKEN}#***#g"
  PUSH_STATUS="${PIPESTATUS[0]}"
else
  git push origin "HEAD:${BRANCH}"
  PUSH_STATUS=$?
fi

[ "$PUSH_STATUS" -eq 0 ] || fail "Push failed. See above."

echo "==> Pushed. Vercel is building from $BRANCH."
echo "    https://vercel.com/dashboard"
echo "    https://nicesalt.com"
