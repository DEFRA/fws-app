#!/bin/bash

# Script to install git hooks for the repository

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOKS_DIR="$SCRIPT_DIR/.githooks"
GIT_HOOKS_DIR="$SCRIPT_DIR/.git/hooks"

echo "Installing git hooks..."

if [[ ! -d "$GIT_HOOKS_DIR" ]]; then
    echo "Error: .git/hooks directory not found. Are you in a git repository?" >&2
    exit 1
fi

# Configure git to use custom hooks directory
git config core.hooksPath .githooks

echo "✓ Git hooks installed successfully!"
echo ""
echo "Active hooks:"
for hook in "$HOOKS_DIR"/*; do
    if [[ -f "$hook" && -x "$hook" ]]; then
        echo "  - $(basename "$hook")"
    fi
done
echo ""
