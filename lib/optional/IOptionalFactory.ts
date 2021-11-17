import { IOptional } from "./IOptional.ts";

export interface IOptionalFactory {
    of<T>(value: T | undefined): IOptional<T | undefined>;
    ofNullable<T>(value: T | undefined | null): IOptional<T | undefined>;
}
