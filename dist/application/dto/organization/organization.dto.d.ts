export declare class CreateAccountDto {
    name: string;
}
export declare class CreatePointDto {
    name: string;
    address?: string;
}
export declare class AccountResponseDto {
    id: string;
    name: string;
    ownerId: string;
    isActive: boolean;
    createdAt: Date;
}
export declare class PointResponseDto {
    id: string;
    name: string;
    address: string | null;
    accountId: string;
    isActive: boolean;
    createdAt: Date;
}
