/**
 * Создание (или обновление) аккаунта девелопера.
 *
 * Запуск:
 *   DEV_EMAIL=dev@site.com DEV_PASSWORD='StrongPass123!' npm run seed:developer
 *
 * Параметры (через переменные окружения, есть значения по умолчанию):
 *   DEV_EMAIL       — email девелопера (по умолчанию developer@four-brothers.local)
 *   DEV_PASSWORD    — пароль (по умолчанию Developer123!)
 *   DEV_FIRST_NAME  — имя (по умолчанию Dev)
 *   DEV_LAST_NAME   — фамилия (по умолчанию Developer)
 *
 * Роль DEVELOPER нельзя получить через обычную регистрацию — только этим скриптом
 * или напрямую в БД.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
