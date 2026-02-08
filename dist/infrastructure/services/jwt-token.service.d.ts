import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export interface TokenPayload {
    sub: string;
    email: string;
    role: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface IJwtTokenService {
    generateTokenPair(userId: string, email: string, role: string): Promise<TokenPair>;
    generateAccessToken(userId: string, email: string, role: string): Promise<string>;
    generateRefreshToken(): string;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    getRefreshTokenExpirationDate(): Date;
}
export declare const JWT_TOKEN_SERVICE: unique symbol;
export declare class JwtTokenService implements IJwtTokenService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateTokenPair(userId: string, email: string, role: string): Promise<TokenPair>;
    generateAccessToken(userId: string, email: string, role: string): Promise<string>;
    generateRefreshToken(): string;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    getRefreshTokenExpirationDate(): Date;
    private parseExpiration;
}
