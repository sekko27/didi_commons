import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { Consumer } from "../../../interfaces/Consumer.ts";
import { PredicateFunction } from "../../../interfaces/PredicateFunction.ts";
import { MapperFunction } from "../../../interfaces/MapperFunction.ts";
import { IEmpty } from "../../empty/IEmpty.ts";
import { IOptionalFactory } from "../interfaces/IOptionalFactory.ts";


export class EarlyNonEmptySyncOptional<T, E> implements ISyncOptional<T, E> {
    constructor(
        private readonly value: T,
        private readonly factory: IOptionalFactory,
        private readonly emptiness: IEmpty<E>
    ) {
    }

    empty(): boolean {
        return false;
    }

    isPresent(): boolean {
        return true;
    }

    ifPresent(consumer: Consumer<T>): void {
        consumer(this.value);
    }

    filter(predicate: PredicateFunction<T, boolean>): ISyncOptional<T, E> {
        return predicate(this.value) ? this : this.factory.ofNonEmpty<T, E>(this.emptiness.getValue(), this.emptiness);
    }

    map<R>(mapper: MapperFunction<T, R | E>): ISyncOptional<R, E> {
        return this.factory.ofNonEmpty<R, E>(mapper(this.value), this.emptiness);
    }

    flatMap<R>(mapper: MapperFunction<T, ISyncOptional<R, E>>): ISyncOptional<R, E> {
        return this.emptiness.test(this.value)
            ? this.factory.ofNonEmpty<R, E>(this.emptiness.getValue(), this.emptiness)
            : mapper(this.value);
    }

    get(): T {
        return this.value;
    }

    orElse(): T {
        return this.value;
    }

    orElseGet(): T {
        return this.value;
    }

    orElseThrow(): T {
        return this.value;
    }
}
