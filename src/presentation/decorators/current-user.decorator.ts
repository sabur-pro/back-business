import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
    id: string;
    userId: string;
    email: string;
    role: string;
    // true, если это сессия девелопера, вошедшего «под организатора»
    dev?: boolean;
    // id самого девелопера (при dev === true)
    devId?: string;
}

export const CurrentUser = createParamDecorator(
    (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as CurrentUserData;

        // Add id alias for userId
        if (user && !user.id) {
            user.id = user.userId;
        }

        return data ? user?.[data] : user;
    },
);
