import { IEmpty } from "../../empty/IEmpty.ts";
import { IAsyncOptional } from "../interfaces/IAsyncOptional.ts";
import { MaybePromise } from "../../../interfaces/Promises.ts";
import { Optional } from "../../Optional.ts";

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
        return Optional.ofAsyncNonEmpty<T, E>(value, this.emptiness);
    }

    some(): IAsyncOptional<string, E> {
        return Optional.ofAsyncNonEmpty<string, E>("some", this.emptiness);
    }

    empty(): IAsyncOptional<any, E> {
        return Optional.ofAsyncNonEmpty<any, E>(this.emptiness.getValue(), this.emptiness);
    }

    other(): IAsyncOptional<string, E> {
        return Optional.ofAsyncNonEmpty<string, E>("other", this.emptiness);
    }

    error(): () => Error {
        return () => new Error();
    }
}
