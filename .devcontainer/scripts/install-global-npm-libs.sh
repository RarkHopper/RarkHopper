#!/bin/bash

npm install -g @anthropic-ai/claude-code

pip install SuperClaude
SuperClaude install

claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project $(pwd)