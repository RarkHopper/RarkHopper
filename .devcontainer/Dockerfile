FROM oven/bun:debian

COPY --from=ubuntu:24.04 /root/.bashrc /root/.bashrc

RUN apt update -qy && \
    apt install -qy \
        locales \
        vim

# ロケール設定（ja_JP.UTF-8 を有効化）
RUN echo "ja_JP.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=ja_JP.UTF-8

ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
