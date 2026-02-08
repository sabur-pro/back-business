export interface IHashService {
    hash(value: string): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
}
export declare const HASH_SERVICE: unique symbol;
export declare class HashService implements IHashService {
    private readonly saltRounds;
    hash(value: string): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
}
