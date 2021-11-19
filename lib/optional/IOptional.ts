import { Consumer } from "../interfaces/Consumer.ts";
import { PredicateFunction } from "../interfaces/PredicateFunction.ts";
import { MapperFunction } from "../interfaces/MapperFunction.ts";
import { Supplier } from "../interfaces/Supplier.ts";

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type OncePromised<T> = PromiseLike<Awaited<T>>;
export type OptionalTerminationResult<R, T = R> = T extends PromiseLike<infer U> ? OncePromised<R> : R;
export type AnyPromise<R, T1, T2> = T1 extends PromiseLike<infer U>
    ? OncePromised<R>
    : T2 extends PromiseLike<infer U>
        ? OncePromised<R>
        : Awaited<R>;
export type OptionalStreamOpResult<R, T1, T2> = IOptional<AnyPromise<R, T1, T2>>;

export interface IOptional<T> {
    empty(): OptionalTerminationResult<boolean, T>;
    isPresent(): OptionalTerminationResult<boolean, T>;
    ifPresent(consumer: Consumer<Awaited<T>, OptionalTerminationResult<void, T>>): OptionalTerminationResult<void, T>;
    get(): OptionalTerminationResult<Awaited<T>, T>;
    filter<R extends boolean | PromiseLike<boolean>>(predicate: PredicateFunction<Awaited<T>, R>): OptionalStreamOpResult<T, T, R>;
    map<R>(mapper: MapperFunction<Awaited<T>, R>): OptionalStreamOpResult<R, T, R>;
    flatMap<R extends IOptional<O> | PromiseLike<IOptional<O>>, O>(mapper: MapperFunction<Awaited<T>, R>): OptionalStreamOpResult<O, T, R>;
    orElse<O extends T | PromiseLike<T>>(other: O): OptionalTerminationResult<Awaited<T>, T>;
    orElseGet<O extends T | PromiseLike<T>>(supplier: Supplier<O>): AnyPromise<T, T, O>;
    orElseThrow(supplier: Supplier<Error>): Awaited<T>;
}
