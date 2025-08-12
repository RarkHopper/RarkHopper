#!/bin/bash
set -e

bash .devcontainer/scripts/register-aliases.sh
bash .devcontainer/scripts/prepare-github-cli.sh
bash .devcontainer/scripts/install-global-npm-libs.sh
