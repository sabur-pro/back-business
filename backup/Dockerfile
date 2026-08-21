# Образ с pg_dump (postgres 16) + curl для отправки в Telegram.
FROM postgres:16-alpine

RUN apk add --no-cache curl

COPY backup.sh /usr/local/bin/backup.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
