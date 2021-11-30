import { Consumer } from "../../../interfaces/Consumer.ts";
import { PredicateFunction } from "../../../interfaces/PredicateFunction.ts";
import { MapperFunction } from "../../../interfaces/MapperFunction.ts";
import { Supplier } from "../../../interfaces/Supplier.ts";
import { NoSuchElementException } from "../../../errors/NoSuchElementException.ts";
import { IEmpty } from "../../empty/IEmpty.ts";
import { IOptionalValueProvider } from "../interfaces/IOptionalValueProvider.ts";
import { ILazySyncOptional } from "../interfaces/ILazySyncOptional.ts";
import { MaybePromise } from "../../../interfaces/Promises.ts";
import { IAsyncOptional } from "../../async/interfaces/IAsyncOptional.ts";
import { IOptionalFactory } from "../interfaces/IOptionalFactory.ts";
import { OptionalHelper } from "../../OptionalHelper.ts";

export class LazySyncOptional<P, T, E> implements ILazySyncOptional<T, E> {
    private box: {value: T | E} | undefined = undefined;

    constructor(
        private readonly previous: IOptionalValueProvider<P, E>,
        private readonly op: MapperFunction<P | E, T | E>,
        private readonly emptiness: IEmpty<E>,
        private readonly factory: IOptionalFactory,
    ) {
    }

    getValue(): T | E {
        if (this.box === undefined) {
            this.box = {value: this.op(this.previous.getValue())};
        }
        return this.box.value;
    }

    empty(): boolean {
        return this.emptiness.test(this.getValue());
    }

    isPresent(): boolean {
        return !this.emptiness.test(this.getValue());
    }

    ifPresent(consumer: Consumer<T>): void {
        const value = this.getValue();
        if (!this.emptiness.test(value)) {
            consumer(value as T);
        }
    }

    filter(predicate: PredicateFunction<T, boolean>): ILazySyncOptional<T, E> {
        return new LazySyncOptional<T, T, E>(
            this,
                value => !this.emptiness.test(value) && predicate(value as T) ? value : this.emptiness.getValue(),
            this.emptiness,
            this.factory);
    }

    asyncFilter(predicate: PredicateFunction<T, MaybePromise<boolean>>): IAsyncOptional<T, E> {
        return this.factory.genericAsync<T, T, E>(this, OptionalHelper.filter<T, E>(this.emptiness, predicate), this.emptiness);
    }


    map<R>(mapper: MapperFunction<T, R | E>): ILazySyncOptional<R, E> {
        return new LazySyncOptional<T, R, E>(
            this,
                value => this.emptiness.test(value) ? this.emptiness.getValue() : mapper(value as T),
            this.emptiness,
            this.factory
        );
    }

    asyncMap<R>(mapper: MapperFunction<T, MaybePromise<R>>): IAsyncOptional<R, E> {
        return this.factory.genericAsync<T, R, E>(this, OptionalHelper.map<T, R, E>(this.emptiness, mapper), this.emptiness);
    }

    flatMap<R>(mapper: MapperFunction<T, ILazySyncOptional<R, E>>): ILazySyncOptional<R, E> {
        return new LazySyncOptional<T, R, E>(
            this,
            value => this.emptiness.test(value) ? this.emptiness.getValue() : mapper(value as T).getValue(),
            this.emptiness,
            this.factory
        );
    }

    asyncFlatMap<R>(mapper: MapperFunction<T, MaybePromise<IAsyncOptional<R, E>>>): IAsyncOptional<R, E> {
        return this.factory.genericAsync<T, R, E>(this, OptionalHelper.flatMap<T, R, E>(this.emptiness, mapper), this.emptiness);
    }

    get(): T {
        const value = this.getValue();
        if (this.emptiness.test(value)) {
            throw new NoSuchElementException(`Empty optional value`);
        }
        return value as T;
    }

    orElse(value: T): T {
        const selfValue = this.getValue();
        return this.emptiness.test(selfValue) ? value : selfValue as T;
    }

    orElseGet(supplier: Supplier<T>): T {
        const value = this.getValue();
        return this.emptiness.test(value) ? supplier() : value as T;
    }

    orElseThrow(errorSupplier: Supplier<Error>): T {
        const value = this.getValue();
        if (this.emptiness.test(value)) {
            throw errorSupplier();
        }
        return value as T;
    }
}
