import { IOptionalFactory } from "./IOptionalFactory.ts";
import { IOptional } from "./IOptional.ts";
import { EmptyOptional } from "./EmptyOptional.ts";
import { NonEmptyOptional } from "./NonEmptyOptional.ts";

const empty: IOptional<undefined> = new EmptyOptional();

export const Optional: IOptionalFactory = {
    of<T>(value: T | undefined): IOptional<T | undefined> {
        return value === undefined ? empty : new NonEmptyOptional(value, this);
    },
    ofNullable<T>(value: T | undefined | null): IOptional<T | undefined> {
        return (value === null || value === undefined) ? empty : new NonEmptyOptional(value, this);
    }
}
