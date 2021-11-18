import { GenericOptionalPromise, IAsyncOptional, IOptional, OptionalBooleanPromise } from "./IOptional.ts";
import { IOptionalFactory } from "./IOptionalFactory.ts";
import { AsyncMapperFunction, MapperFunction } from "../interfaces/MapperFunction.ts";
import { Supplier } from "../interfaces/Supplier.ts";
import { PredicateFunction } from "../interfaces/PredicateFunction.ts";

interface IEvaluableOptional<T> {
    valueOf(): Promise<IOptional<T | undefined>>;
}

export class AsyncOptional<T, P> implements IAsyncOptional<T> {
    private evaluated?: {value: Promise<IOptional<T>>};

    constructor(
        private readonly previous: IEvaluableOptional<P>,
        private readonly step: (o: IOptional<P | undefined>) => Promise<IOptional<T>>,
        private readonly optionalFactory: IOptionalFactory,
    ) {
    }

    private async evaluate(): Promise<IOptional<T>> {
        if (this.evaluated === undefined) {
            this.evaluated = {
                value: this.step(await this.previous.valueOf())
            };
        }
        return this.evaluated.value;
    }

    async empty(): Promise<boolean> {
        return (await this.evaluate()).empty();
    }

    async isPresent(): Promise<boolean> {
        return (await this.evaluate()).isPresent();
    }

    async ifPresent(consumer: (value: T) => void): Promise<void> {
        (await this.evaluate()).ifPresent(consumer);
    }

    async get(): Promise<T> {
        return (await this.evaluate()).get();
    }

    async filter(predicate: PredicateFunction<T, Promise<boolean>>): GenericOptionalPromise<T, Promise<any>> {
        return new AsyncOptional<T | undefined, T>(
            this,
            async (v: IOptional<T | undefined>): Promise<IOptional<T | undefined>> => {
            return v.empty() || (await predicate(v.get()))
                ? this.optionalFactory.of(undefined)
                : v;
            },
            this.optionalFactory
        );
    }


    map<R>(mapper: MapperFunction<T, R>): IOptional<R | undefined> {
        return this.optionalFactory.of(mapper(this.value));
    }

    mapNullable<R>(mapper: MapperFunction<T, R | null>): IOptional<R | undefined> {
        return this.optionalFactory.ofNullable(mapper(this.value));
    }

    flatMap<R>(mapper: MapperFunction<T, IOptional<R>>): IOptional<R> {
        return mapper(this.value);
    }

    orElse(_other: T): T {
        return this.value;
    }

    orElseGet(_supplier: Supplier<T>): T {
        return this.value;
    }

    orElseThrow(_supplier: Supplier<Error>): T {
        return this.value;
    }

}
