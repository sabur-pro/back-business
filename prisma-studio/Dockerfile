FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY prisma ./prisma/

RUN npm install prisma@5.22.0 @prisma/client@5.22.0

RUN npx prisma generate

EXPOSE 5555

CMD ["npx", "prisma", "studio", "--port", "5555", "--browser", "none"]
