import { Consumer } from "../interfaces/Consumer.ts";
import { PredicateFunction } from "../interfaces/PredicateFunction.ts";
import { MapperFunction } from "../interfaces/MapperFunction.ts";
import { Supplier } from "../interfaces/Supplier.ts";

export interface IOptional<T> {
    empty(): boolean;
    isPresent(): boolean;
    ifPresent(consumer: Consumer<T>): void;
    get(): T;
    filter(predicate: PredicateFunction<T>): IOptional<T | undefined>;
    map<R>(mapper: MapperFunction<T, R>): IOptional<R | undefined>;
    mapNullable<R>(mapper: MapperFunction<T, R | null>): IOptional<R | undefined>;
    flatMap<R>(mapper: MapperFunction<T, IOptional<R>>): IOptional<R | undefined>;
    orElse(other: T): T;
    orElseGet(supplier: Supplier<T>): T;
    orElseThrow(supplier: Supplier<Error>): T;
}
