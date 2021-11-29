import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { Consumer } from "../../../interfaces/Consumer.ts";
import { PredicateFunction } from "../../../interfaces/PredicateFunction.ts";
import { MapperFunction } from "../../../interfaces/MapperFunction.ts";
import { IEmpty } from "../../empty/IEmpty.ts";
import { IOptionalFactory } from "../interfaces/IOptionalFactory.ts";
import { MaybePromise } from "../../../interfaces/Promises.ts";
import { IAsyncOptional } from "../../async/interfaces/IAsyncOptional.ts";
import { IAsyncOptionalValueProvider } from "../../async/interfaces/IAsyncOptionalValueProvider.ts";


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

    private asPrevious(): IAsyncOptionalValueProvider<T, E> {
        return {
            getValue: () => {
                return this.value;
            }
        };
    }

    filter(predicate: PredicateFunction<T, boolean>): ISyncOptional<T, E> {
        return predicate(this.value) ? this : this.factory.ofNonEmpty<T, E>(this.emptiness.getValue(), this.emptiness);
    }

    asyncFilter(predicate: PredicateFunction<T, MaybePromise<boolean>>): IAsyncOptional<T, E> {
        return this.factory.genericAsync<T, T, E>(
            this.asPrevious(),
            async (value) => {
                return !this.emptiness.test(value) && await predicate(value as T)
                    ? value
                    : this.emptiness.getValue()
            },
            this.emptiness
        );
    }

    map<R>(mapper: MapperFunction<T, R | E>): ISyncOptional<R, E> {
        return this.factory.ofNonEmpty<R, E>(mapper(this.value), this.emptiness);
    }

    asyncMap<R>(mapper: MapperFunction<T, MaybePromise<R>>): IAsyncOptional<R, E> {
        return this.factory.genericAsync<T, R, E>(
            this.asPrevious(),
            (value) => {
                return this.emptiness.test(value)
                    ? this.emptiness.getValue()
                    : mapper(value as T);
            },
            this.emptiness
        );
    }

    flatMap<R>(mapper: MapperFunction<T, ISyncOptional<R, E>>): ISyncOptional<R, E> {
        return this.emptiness.test(this.value)
            ? this.factory.ofNonEmpty<R, E>(this.emptiness.getValue(), this.emptiness)
            : mapper(this.value);
    }

    asyncFlatMap<R>(mapper: MapperFunction<T, MaybePromise<IAsyncOptional<R, E>>>): IAsyncOptional<R, E> {
        return this.factory.genericAsync<T, R, E>(
            this.asPrevious(),
            async (value) => {
                return this.emptiness.test(value)
                    ? this.emptiness.getValue()
                    : (await mapper(value as T)).getValue()
            },
            this.emptiness
        );
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
