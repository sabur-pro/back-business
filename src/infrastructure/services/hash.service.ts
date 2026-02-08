import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface IHashService {
    hash(value: string): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
}

export const HASH_SERVICE = Symbol('IHashService');

@Injectable()
export class HashService implements IHashService {
    private readonly saltRounds = 10;

    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.saltRounds);
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}
