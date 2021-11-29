import { IEmpty } from "../../empty/IEmpty.ts";
import { ISyncOptional } from "./ISyncOptional.ts";
import { IAsyncOptional } from "../../async/interfaces/IAsyncOptional.ts";
import { MaybePromise } from "../../../interfaces/Promises.ts";
import { IAsyncOptionalValueProvider } from "../../async/interfaces/IAsyncOptionalValueProvider.ts";
import { MapperFunction } from "../../../interfaces/MapperFunction.ts";

export interface IOptionalFactory {
    ofNonEmpty<T, E>(value: T | E, emptiness: IEmpty<E>): ISyncOptional<T, E>;
    asyncEmpty<T>(): IAsyncOptional<T, any>;
    ofAsyncNonEmpty<T, E>(value: MaybePromise<T | E>, emptiness: IEmpty<E>): IAsyncOptional<T, E>;
    genericAsync<P, T, E>(
        previous: IAsyncOptionalValueProvider<P, E>,
        op: MapperFunction<P | E, MaybePromise<T | E>>,
        emptiness: IEmpty<E>
    ): IAsyncOptional<T, E>;
}
