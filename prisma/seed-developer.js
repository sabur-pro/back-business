/**
 * Создание (или обновление) аккаунта девелопера.
 * Чистый Node.js — работает и в dev, и в prod контейнере (не требует ts-node/tsconfig).
 *
 * Запуск локально:
 *   DEV_EMAIL=dev@site.com DEV_PASSWORD='StrongPass123!' node prisma/seed-developer.js
 *
 * В докере (prod):
 *   docker compose exec -e DEV_EMAIL=dev@site.com -e DEV_PASSWORD='StrongPass123!' api node prisma/seed-developer.js
 *
 * Переменные окружения (есть значения по умолчанию):
 *   DEV_EMAIL, DEV_PASSWORD, DEV_FIRST_NAME, DEV_LAST_NAME
 *
 * Роль DEVELOPER нельзя получить через обычную регистрацию — только этим скриптом.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = process.env.DEV_EMAIL || 'developer@four-brothers.local';
    const password = process.env.DEV_PASSWORD || 'Developer123!';
    const firstName = process.env.DEV_FIRST_NAME || 'Dev';
    const lastName = process.env.DEV_LAST_NAME || 'Developer';

    const hashed = await bcrypt.hash(password, 10);

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        await prisma.user.update({
            where: { email },
            data: {
                role: 'DEVELOPER',
                password: hashed,
                isActive: true,
                accountId: null,
            },
        });
        console.log(`✔ Девелопер обновлён: ${email}`);
    } else {
        await prisma.user.create({
            data: {
                email,
                password: hashed,
                firstName,
                lastName,
                role: 'DEVELOPER',
                isActive: true,
            },
        });
        console.log(`✔ Девелопер создан: ${email}`);
    }

    console.log(`  Пароль: ${password}`);
    console.log('  Роль:   DEVELOPER');
}

main()
    .catch((e) => {
        console.error('Ошибка при создании девелопера:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
