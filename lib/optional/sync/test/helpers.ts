import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { EarlySyncOptionalFactory } from "../early/EarlySyncOptionalFactory.ts";
import { IEmpty } from "../../empty/IEmpty.ts";
import { ILazySyncOptional, LazySyncOptionalFactory } from "../lazy/LazySyncOptionalFactory.ts";

export interface ITestsContext<E> {
    opt<T>(value: T | E): ISyncOptional<T, E>;
    some(): ISyncOptional<string, E>;
    empty(): ISyncOptional<any, E>;
    other(): ISyncOptional<string, E>;
    error(): () => Error;
}

export class EarlySyncOptionalTestsContext<E> implements ITestsContext<E> {
    constructor(private readonly emptiness: IEmpty<E>) {
    }

    opt<T>(value: T | E): ISyncOptional<T, E> {
        return EarlySyncOptionalFactory.of<T, E>(value, this.emptiness);
    }

    some(): ISyncOptional<string, E> {
        return EarlySyncOptionalFactory.of<string, E>("some", this.emptiness);
    }

    empty(): ISyncOptional<any, E> {
        return EarlySyncOptionalFactory.EMPTY;
    }

    other(): ISyncOptional<string, E> {
        return EarlySyncOptionalFactory.of<string, E>("other", this.emptiness);
    }

    error(): () => Error {
        return () => new Error();
    }
}

export class LazySyncOptionalTestsContext<E> implements ITestsContext<E> {
    constructor(private readonly emptiness: IEmpty<E>) {
    }

    opt<T>(value: T | E): ILazySyncOptional<T, E> {
        return LazySyncOptionalFactory.of<T, E>(value, this.emptiness);
    }

    some(): ILazySyncOptional<string, E> {
        return LazySyncOptionalFactory.of<string, E>("some", this.emptiness);
    }

    empty(): ILazySyncOptional<any, E> {
        return LazySyncOptionalFactory.of<any, E>(this.emptiness.getValue(), this.emptiness);
    }

    other(): ILazySyncOptional<string, E> {
        return LazySyncOptionalFactory.of<string, E>("other", this.emptiness);
    }

    error(): () => Error {
        return () => new Error();
    }
}
