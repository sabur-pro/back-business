export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone?: string;
    role: string;
    accountId?: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
}
export declare class TokenResponseDto {
    accessToken: string;
    refreshToken: string;
}
