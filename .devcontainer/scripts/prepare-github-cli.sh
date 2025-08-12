#!/bin/bash

if [ -d "$HOME/.config/gh" ] && [ "$(find "$HOME/.config/gh" -type f -not -name ".gitignore" | wc -l)" -gt 0 ]; then
  echo "GitHub CLI はすでに設定されています。ログインをスキップします。"
else
  echo "既存の GitHub CLI 設定が見つかりません。ログインしています..."
  gh auth login
fi

gh extension install github/gh-copilot
gh extension install https://github.com/nektos/gh-act
