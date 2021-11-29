import { IAsyncOptional} from "./interfaces/IAsyncOptional.ts";
import { MapperFunction } from "../../interfaces/MapperFunction.ts";
import { IEmpty } from "../empty/IEmpty.ts";
import { Consumer } from "../../interfaces/Consumer.ts";
import { PredicateFunction } from "../../interfaces/PredicateFunction.ts";
import { NoSuchElementException } from "../../errors/NoSuchElementException.ts";
import { Supplier } from "../../interfaces/Supplier.ts";
import { IAsyncOptionalValueProvider } from "./interfaces/IAsyncOptionalValueProvider.ts";
import { MaybePromise } from "../../interfaces/Promises.ts";

export class AsyncOptional<P, T, E> implements IAsyncOptional<T, E> {
    private box: {value: MaybePromise<T | E>} | undefined = undefined;

    constructor(
        private readonly previous: IAsyncOptionalValueProvider<P, E>,
        private readonly op: MapperFunction<P | E, MaybePromise<T | E>>,
        private readonly emptiness: IEmpty<E>
    ) {
    }

    async getValue(): Promise<T | E> {
        if (this.box === undefined) {
            this.box = {value: this.op(await this.previous.getValue())};
        }
        return this.box.value;
    }

    async empty(): Promise<boolean> {
        return this.emptiness.test(await this.getValue());
    }

    async isPresent(): Promise<boolean> {
        return !this.emptiness.test(await this.getValue());
    }

    async ifPresent(consumer: Consumer<T, MaybePromise<void>>): Promise<void> {
        const value = await this.getValue();
        if (!this.emptiness.test(value)) {
            await consumer(value as T);
        }
    }

    filter(predicate: PredicateFunction<T, MaybePromise<boolean>>): IAsyncOptional<T, E> {
        return new AsyncOptional<T, T, E>(
            this,
                async (value: T | E) => !this.emptiness.test(value) && await predicate(value as T) ? value : this.emptiness.getValue(),
            this.emptiness);
    }

    map<R>(mapper: MapperFunction<T, MaybePromise<R | E>>): IAsyncOptional<R, E> {
        return new AsyncOptional<T, R, E>(
            this,
            (value: T | E) => this.emptiness.test(value) ? this.emptiness.getValue() : mapper(value as T),
            this.emptiness
        );
    }

    flatMap<R>(mapper: MapperFunction<T, MaybePromise<IAsyncOptional<R, E>>>): IAsyncOptional<R, E> {
        return new AsyncOptional<T, R, E>(
            this,
            async (value: T | E) => this.emptiness.test(value) ? this.emptiness.getValue() : (await mapper(value as T)).getValue(),
            this.emptiness
        );
    }

    async get(): Promise<T> {
        const value = await this.getValue();
        if (this.emptiness.test(value)) {
            throw new NoSuchElementException(`Empty optional value`);
        }
        return value as T;
    }

    async orElse(value: MaybePromise<T>): Promise<T> {
        const selfValue = await this.getValue();
        return this.emptiness.test(selfValue) ? value : selfValue as T;
    }

    async orElseGet(supplier: Supplier<MaybePromise<T>>): Promise<T> {
        const value = await this.getValue();
        return this.emptiness.test(value) ? supplier() : value as T;
    }

    async orElseThrow(errorSupplier: Supplier<MaybePromise<Error>>): Promise<T> {
        const value = await this.getValue();
        if (this.emptiness.test(value)) {
            throw await errorSupplier();
        }
        return value as T;
    }
}
