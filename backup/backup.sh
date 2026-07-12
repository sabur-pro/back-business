#!/bin/sh
# Дамп всей базы PostgreSQL и отправка в Telegram.
set -eu

TIMESTAMP="$(date +%Y-%m-%d_%H-%M-%S)"
FILE="/tmp/${POSTGRES_DB}_${TIMESTAMP}.sql.gz"

echo "[$(date)] Начинаю бэкап базы ${POSTGRES_DB}..."

# Полный дамп всей базы (схема + данные), сразу в gzip.
export PGPASSWORD="${POSTGRES_PASSWORD}"
pg_dump \
  --host="${POSTGRES_HOST}" \
  --port="${POSTGRES_PORT}" \
  --username="${POSTGRES_USER}" \
  --dbname="${POSTGRES_DB}" \
  --no-owner --no-privileges \
  | gzip -9 > "${FILE}"

SIZE_BYTES="$(wc -c < "${FILE}")"
SIZE_MB="$(( SIZE_BYTES / 1024 / 1024 ))"
echo "[$(date)] Дамп готов: ${FILE} (${SIZE_MB} MB)"

CAPTION="🗄 Бэкап базы ${POSTGRES_DB}%0AДата: ${TIMESTAMP}%0AРазмер: ${SIZE_MB} MB"

# Telegram Bot API ограничивает отправку документа 50 MB.
if [ "${SIZE_BYTES}" -gt 52428800 ]; then
  echo "[$(date)] ВНИМАНИЕ: файл больше 50 MB, Telegram его не примет."
  curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=⚠️ Бэкап ${POSTGRES_DB} за ${TIMESTAMP} весит ${SIZE_MB} MB — больше лимита Telegram (50 MB). Файл лежит на сервере, но не отправлен." \
    > /dev/null || true
  rm -f "${FILE}"
  exit 1
fi

echo "[$(date)] Отправляю в Telegram (chat_id=${TELEGRAM_CHAT_ID})..."
RESPONSE="$(curl -s \
  -F "chat_id=${TELEGRAM_CHAT_ID}" \
  -F "caption=🗄 Бэкап базы ${POSTGRES_DB}
Дата: ${TIMESTAMP}
Размер: ${SIZE_MB} MB" \
  -F "document=@${FILE}" \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument")"

rm -f "${FILE}"

if echo "${RESPONSE}" | grep -q '"ok":true'; then
  echo "[$(date)] Бэкап успешно отправлен в Telegram."
else
  echo "[$(date)] ОШИБКА отправки в Telegram: ${RESPONSE}"
  exit 1
fi
