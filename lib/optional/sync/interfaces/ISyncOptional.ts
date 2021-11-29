import { Consumer } from "../../../interfaces/Consumer.ts";
import { PredicateFunction } from "../../../interfaces/PredicateFunction.ts";
import { MapperFunction } from "../../../interfaces/MapperFunction.ts";
import { Supplier } from "../../../interfaces/Supplier.ts";

export interface ISyncOptional<T, E> {
    empty(): boolean;
    isPresent(): boolean;
    ifPresent(consumer: Consumer<T>): void;
    filter(predicate: PredicateFunction<T, boolean>): ISyncOptional<T, E>;
    map<R>(mapper: MapperFunction<T, R | E>): ISyncOptional<R, E>;
    get(): T;
    orElse(value: T): T;
    orElseGet(supplier: Supplier<T>): T;
    orElseThrow(errorSupplier: Supplier<Error>): T;
}
