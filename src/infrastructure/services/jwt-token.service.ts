import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

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

export const JWT_TOKEN_SERVICE = Symbol('IJwtTokenService');

@Injectable()
export class JwtTokenService implements IJwtTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async generateTokenPair(userId: string, email: string, role: string): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(userId, email, role),
            Promise.resolve(this.generateRefreshToken()),
        ]);

        return { accessToken, refreshToken };
    }

    async generateAccessToken(userId: string, email: string, role: string): Promise<string> {
        const payload: TokenPayload = {
            sub: userId,
            email: email,
            role: role,
        };

        return this.jwtService.signAsync(payload);
    }

    generateRefreshToken(): string {
        return uuidv4();
    }

    async verifyAccessToken(token: string): Promise<TokenPayload> {
        return this.jwtService.verifyAsync<TokenPayload>(token);
    }

    getRefreshTokenExpirationDate(): Date {
        const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');
        const ms = this.parseExpiration(refreshExpiration);
        return new Date(Date.now() + ms);
    }

    private parseExpiration(expiration: string): number {
        const match = expiration.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 7 * 24 * 60 * 60 * 1000; // Default 7 days
        }

        const value = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case 's':
                return value * 1000;
            case 'm':
                return value * 60 * 1000;
            case 'h':
                return value * 60 * 60 * 1000;
            case 'd':
                return value * 24 * 60 * 60 * 1000;
            default:
                return 7 * 24 * 60 * 60 * 1000;
        }
    }
}
