import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { LazySyncOptional } from "./LazySyncOptional.ts";
import { IEmpty } from "../../empty/IEmpty.ts";

export interface IOptionalValueProvider<T, E> {
    getValue(): T | E;
}

export interface ILazySyncOptional<T, E> extends ISyncOptional<T, E>, IOptionalValueProvider<T, E> {}

export class LazySyncOptionalFactory {
    public static of<T, E>(
        value: T | E,
        emptiness: IEmpty<E>,
    ): ILazySyncOptional<T, E> {
        return new LazySyncOptional<E, T, E>(emptiness, () => value, emptiness);
    }
}
