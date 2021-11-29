import { IAsyncOptional} from "./interfaces/IAsyncOptional.ts";
import { AsyncOptional } from "./AsyncOptional.ts";
import { IEmpty } from "../empty/IEmpty.ts";
import { MaybePromise } from "../../interfaces/Promises.ts";

export interface IAsyncOptionalValueProvider<T, E> {
    getValue(): MaybePromise<T | E>;
}

export class AsyncOptionalFactory {
    public static of<T, E>(
        value: MaybePromise<T | E>,
        emptiness: IEmpty<E>,
    ): IAsyncOptional<T, E> {
        return new AsyncOptional<E, T, E>(emptiness, () => value, emptiness);
    }
}
