import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { IEmpty } from "../../empty/IEmpty.ts";
import { Optional } from "../../Optional.ts";
import { ILazySyncOptional } from "../interfaces/ILazySyncOptional.ts";

export interface ITestsContext<E> {
    opt<T>(value: T | E): ISyncOptional<T, E>;
    some(): ISyncOptional<string, E>;
    empty<T>(): ISyncOptional<T, E>;
    other(): ISyncOptional<string, E>;
    error(): () => Error;
}

export class EarlySyncOptionalTestsContext<E> implements ITestsContext<E> {
    constructor(private readonly emptiness: IEmpty<E>) {
    }

    opt<T>(value: T | E): ISyncOptional<T, E> {
        return Optional.ofNonEmpty<T, E>(value, this.emptiness);
    }

    some(): ISyncOptional<string, E> {
        return Optional.ofNonEmpty<string, E>("some", this.emptiness);
    }

    empty<T>(): ISyncOptional<T, E> {
        return Optional.EMPTY as ISyncOptional<T, E>;
    }

    other(): ISyncOptional<string, E> {
        return Optional.ofNonEmpty<string, E>("other", this.emptiness);
    }

    error(): () => Error {
        return () => new Error();
    }
}

export class LazySyncOptionalTestsContext<E> implements ITestsContext<E> {
    constructor(private readonly emptiness: IEmpty<E>) {
    }

    opt<T>(value: T | E): ILazySyncOptional<T, E> {
        return Optional.ofLazyNonEmpty<T, E>(value, this.emptiness);
    }

    some(): ILazySyncOptional<string, E> {
        return Optional.ofLazyNonEmpty<string, E>("some", this.emptiness);
    }

    empty<T>(): ILazySyncOptional<T, E> {
        return Optional.ofLazyNonEmpty<T, E>(this.emptiness.getValue(), this.emptiness);
    }

    other(): ILazySyncOptional<string, E> {
        return Optional.ofLazyNonEmpty<string, E>("other", this.emptiness);
    }

    error(): () => Error {
        return () => new Error();
    }
}
