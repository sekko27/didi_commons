import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { EarlyEmptySyncOptional } from "./EarlyEmptySyncOptional.ts";
import { EarlyNonEmptySyncOptional } from "./EarlyNonEmptySyncOptional.ts";
import { IEmpty } from "../../empty/IEmpty.ts";

export interface IEarlySyncOptionalFactory {
    of<T, E>(value: T | E, emptiness?: IEmpty<E>): ISyncOptional<T, E>;
}

export class EarlySyncOptionalFactory {
    public static readonly EMPTY: ISyncOptional<any, any> = new EarlyEmptySyncOptional();

    public static of<T, E>(value: T | E, emptiness: IEmpty<E>): ISyncOptional<T, E> {
        return emptiness.test(value)
            ? EarlySyncOptionalFactory.EMPTY
            : new EarlyNonEmptySyncOptional<T, E>(value as T, this as IEarlySyncOptionalFactory, emptiness);
    }
}
