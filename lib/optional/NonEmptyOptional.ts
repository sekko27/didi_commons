import { GenericOptionalPromise, IOptional, OptionalPromise } from "./IOptional.ts";
import { IOptionalFactory } from "./IOptionalFactory.ts";
import { MapperFunction } from "../interfaces/MapperFunction.ts";
import { Supplier } from "../interfaces/Supplier.ts";

export class NonEmptyOptional<T> implements IOptional<T> {
    constructor(private readonly value: T, private readonly optionalFactory: IOptionalFactory) {
        if (value === undefined) {
            throw new TypeError(`Empty optional value`);
        }
    }

    empty() {
        return false;
    }

    isPresent(): boolean {
        return true;
    }

    ifPresent(consumer: (value: T) => void): void {
        consumer(this.value);
    }

    get(): T {
        return this.value;
    }

    filter(predicate: (value: T) => boolean): IOptional<T | undefined> {
        return predicate(this.value) ? this : this.optionalFactory.of<T>(undefined);
    }

    map<R>(mapper: MapperFunction<T, OptionalPromise<void, R | undefined>>): GenericOptionalPromise<R, void> {
        return this.optionalFactory.of(mapper(this.value));
    }


    mapNullable<R>(mapper: MapperFunction<T, R | null>): IOptional<R | undefined> {
        return this.optionalFactory.ofNullable(mapper(this.value));
    }

    flatMap<R>(mapper: MapperFunction<T, IOptional<R | undefined>>): IOptional<R | undefined> {
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
