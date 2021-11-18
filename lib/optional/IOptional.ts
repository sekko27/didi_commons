import { Consumer } from "../interfaces/Consumer.ts";
import { BooleanResult, PredicateFunction } from "../interfaces/PredicateFunction.ts";
import { AsyncMapperFunction, MapperFunction } from "../interfaces/MapperFunction.ts";
import { Supplier } from "../interfaces/Supplier.ts";

export type OptionalWrap<T> = Promise<T> | T;

export type OptionalPromise<W, T> = W extends PromiseLike<infer U> ? (T | Promise<T>) : T;
export type OptionalBooleanPromise<W> = OptionalPromise<W, boolean>;
export type GenericOptionalPromise<T, W> = OptionalPromise<W, IGenericOptional<T | undefined, W>>;

export interface IGenericOptional<
    T,
    W = void,
    BOOL extends OptionalBooleanPromise<W> = OptionalBooleanPromise<W>,
    VOID extends OptionalPromise<W, void> = OptionalPromise<W, void>,
    UNWRAP extends OptionalPromise<W, T> = OptionalPromise<W, T>,
    RES extends GenericOptionalPromise<T, W> = GenericOptionalPromise<T, W>,
    VAL extends OptionalPromise<W, T> = OptionalPromise<W, T>,
    > {
    empty(): BOOL;
    isPresent(): BOOL;
    ifPresent(consumer: Consumer<T>): VOID;
    get(): UNWRAP;
    filter(predicate: PredicateFunction<T, BOOL>): GenericOptionalPromise<T, W>;
    map<R>(mapper: MapperFunction<T, OptionalPromise<W, R | undefined>>): GenericOptionalPromise<R, W>;
    mapNullable<R>(mapper: MapperFunction<T, OptionalPromise<W, R | null>>): GenericOptionalPromise<R, W>;
    flatMap<R>(mapper: MapperFunction<T, GenericOptionalPromise<R | undefined, W>>): GenericOptionalPromise<R, W>;
    orElse(other: VAL): UNWRAP;
    orElseGet(supplier: Supplier<VAL>): UNWRAP;
    orElseThrow(supplier: Supplier<Error>): UNWRAP;
}

export interface IOptional<T> extends IGenericOptional<T, void> {}
export interface IAsyncOptional<T> extends IGenericOptional<T,  Promise<any>> {}
