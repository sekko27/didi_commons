import { Consumer } from "../../../interfaces/Consumer.ts";
import { PredicateFunction } from "../../../interfaces/PredicateFunction.ts";
import { MapperFunction } from "../../../interfaces/MapperFunction.ts";
import { Supplier } from "../../../interfaces/Supplier.ts";
import { MaybePromise } from "../../../interfaces/Promises.ts";
import { IAsyncOptional } from "../../async/interfaces/IAsyncOptional.ts";

export interface ISyncOptional<T, E> {
    empty(): boolean;
    isPresent(): boolean;
    ifPresent(consumer: Consumer<T>): void;
    filter(predicate: PredicateFunction<T, boolean>): ISyncOptional<T, E>;
    asyncFilter(predicate: PredicateFunction<T, MaybePromise<boolean>>): IAsyncOptional<T, E>;
    map<R>(mapper: MapperFunction<T, R | E>): ISyncOptional<R, E>;
    asyncMap<R>(mapper: MapperFunction<T, MaybePromise<R | R>>): IAsyncOptional<R, E>;
    flatMap<R>(mapper: MapperFunction<T, ISyncOptional<R, E>>): ISyncOptional<R, E>;
    asyncFlatMap<R>(mapper: MapperFunction<T, MaybePromise<IAsyncOptional<R, E>>>): IAsyncOptional<R, E>;
    get(): T;
    orElse(value: T): T;
    orElseGet(supplier: Supplier<T>): T;
    orElseThrow(errorSupplier: Supplier<Error>): T;
}
