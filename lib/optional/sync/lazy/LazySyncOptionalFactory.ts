import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { LazySyncOptional } from "./LazySyncOptional.ts";
import { IEmpty } from "../../empty/IEmpty.ts";

export interface IOptionalValueProvider<T, E> {
    getValue(): T | E;
}

export class LazySyncOptionalFactory {
    public static of<T, E>(
        value: T | E,
        emptiness: IEmpty<E>,
    ): ISyncOptional<T, E> {
        return new LazySyncOptional<E, T, E>(emptiness, () => value, emptiness);
    }
}
