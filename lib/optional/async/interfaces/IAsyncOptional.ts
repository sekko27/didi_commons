import { Consumer } from "../../../interfaces/Consumer.ts";
import { PredicateFunction } from "../../../interfaces/PredicateFunction.ts";
import { MapperFunction } from "../../../interfaces/MapperFunction.ts";
import { Supplier } from "../../../interfaces/Supplier.ts";
import { MaybePromise } from "../../../interfaces/Promises.ts";
import { IAsyncOptionalValueProvider } from "../AsyncOptionalFactory.ts";

export interface IAsyncOptional<T, E> extends IAsyncOptionalValueProvider<T, E> {
    empty(): Promise<boolean>;
    isPresent(): Promise<boolean>;
    ifPresent(consumer: Consumer<T, MaybePromise<void>>): Promise<void>;
    filter(predicate: PredicateFunction<T, MaybePromise<boolean>>): IAsyncOptional<T, E>;
    map<R>(mapper: MapperFunction<T, MaybePromise<R | E>>): IAsyncOptional<R, E>;
    flatMap<R>(mapper: MapperFunction<T, MaybePromise<IAsyncOptional<R, E>>>): IAsyncOptional<R, E>;
    get(): Promise<T>;
    orElse(value: MaybePromise<T>): Promise<T>;
    orElseGet(supplier: Supplier<MaybePromise<T>>): Promise<T>;
    orElseThrow(errorSupplier: Supplier<MaybePromise<Error>>): Promise<T>;
}
