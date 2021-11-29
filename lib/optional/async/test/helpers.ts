import { IEmpty } from "../../empty/IEmpty.ts";
import { IAsyncOptional } from "../interfaces/IAsyncOptional.ts";
import { AsyncOptionalFactory } from "../AsyncOptionalFactory.ts";
import { MaybePromise } from "../../../interfaces/Promises.ts";

export interface ITestsContext<E> {
    opt<T>(value: T | E): IAsyncOptional<T, E>;
    some(): IAsyncOptional<string, E>;
    empty(): IAsyncOptional<any, E>;
    other(): IAsyncOptional<string, E>;
    error(): () => Error;
}

export class AsyncOptionalTestsContext<E> implements ITestsContext<E> {
    constructor(private readonly emptiness: IEmpty<E>) {
    }

    opt<T>(value: MaybePromise<T | E>): IAsyncOptional<T, E> {
        return AsyncOptionalFactory.of<T, E>(value, this.emptiness);
    }

    some(): IAsyncOptional<string, E> {
        return AsyncOptionalFactory.of<string, E>("some", this.emptiness);
    }

    empty(): IAsyncOptional<any, E> {
        return AsyncOptionalFactory.of<any, E>(this.emptiness.getValue(), this.emptiness);
    }

    other(): IAsyncOptional<string, E> {
        return AsyncOptionalFactory.of<string, E>("other", this.emptiness);
    }

    error(): () => Error {
        return () => new Error();
    }
}
