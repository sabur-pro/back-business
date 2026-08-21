#!/bin/sh
# Запускает cron, который раз в сутки в 3:00 вызывает backup.sh.
set -eu

# Пробрасываем переменные окружения в файл, чтобы cron их видел.
printenv | grep -E '^(POSTGRES_|TELEGRAM_)' | sed 's/^/export /' > /etc/backup.env

# Строка cron: минута час * * * — каждый день в 03:00.
CRON_SCHEDULE="${BACKUP_CRON:-0 3 * * *}"
echo "${CRON_SCHEDULE} . /etc/backup.env; /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1" > /etc/crontabs/root

echo "[$(date)] Сервис бэкапа запущен. Расписание: ${CRON_SCHEDULE}"
echo "[$(date)] Логи бэкапа: /var/log/backup.log"

# Первый прогон при старте, если задан RUN_ON_START=true (для проверки).
if [ "${RUN_ON_START:-false}" = "true" ]; then
  echo "[$(date)] RUN_ON_START=true — делаю тестовый бэкап сразу..."
  /usr/local/bin/backup.sh || echo "[$(date)] Тестовый бэкап завершился с ошибкой."
fi

touch /var/log/backup.log
# crond на переднем плане + вывод лога в stdout контейнера.
crond -f -l 8 &
tail -f /var/log/backup.log
