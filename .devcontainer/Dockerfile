FROM mcr.microsoft.com/devcontainers/python:dev-3.13-bookworm

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update -qy \
    && apt-get install -qy --no-install-recommends \
    make \
    vim \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g npm@11.4.2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN NPM_PREFIX=$(npm config get prefix) \
    && mkdir -p "$NPM_PREFIX/lib/node_modules" \
    && chown -R vscode:vscode "$NPM_PREFIX/lib/node_modules"

USER vscode

ENV NPM_CONFIG_PREFIX=/home/vscode/.npm-global
ENV PATH=$NPM_CONFIG_PREFIX/bin:$PATH

RUN mkdir -p $NPM_CONFIG_PREFIX && \
    npm config set prefix "$NPM_CONFIG_PREFIX" && \
    echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc