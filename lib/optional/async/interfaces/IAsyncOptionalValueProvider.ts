import { MaybePromise } from "../../../interfaces/Promises.ts";

export interface IAsyncOptionalValueProvider<T, E> {
    getValue(): MaybePromise<T | E>;
}
