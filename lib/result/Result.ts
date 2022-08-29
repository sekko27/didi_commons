import { BooleanHelper } from "../common/BooleanHelper.ts";

export type ResolvableResult<T, E extends Error> = T | Result<T, E> | E;

interface ResultValueWrap<T> {
    value: T;
}

export class Result<T, E extends Error = Error> {
    private constructor(private readonly value: ResultValueWrap<T> | undefined, private readonly error: E | undefined) {
        Result.ensureValueError(value, error);
    }

    private static ensureValueError(value: unknown, error: unknown): void {
        if (!BooleanHelper.exclusivelyUndefined(value, error)) {
            throw new TypeError(`Invalid Result initialization. Value and error must be exclusively undefined.`);
        }
    }

    public static Err<T, E extends Error = Error>(error: E): Result<T, E> {
        return new Result<T, E>(undefined, error);
    }

    public static Ok<T, E extends Error = Error>(value: T): Result<T, E> {
        return new Result<T, E>({value}, undefined);
    }

    public static resolve<T, E extends Error>(value: ResolvableResult<T, E>): Result<T, E> {
        if (value instanceof Result) {
            return value;
        } else if (value instanceof Error) {
            return Result.Err<T, E>(value);
        } else {
            return Result.Ok<T, E>(value);
        }
    }

    public isOk(): boolean {
        return this.value !== undefined;
    }

    public isOkWith(func: (value: T) => boolean): boolean {
        return (this.value !== undefined) && func(this.value.value);
    }

    public isErr(): boolean {
        return this.value === undefined;
    }

    public isErrWith(func: (err: E) => boolean): boolean {
        return (this.error !== undefined) && func(this.error);
    }

    public unwrap(): T {
        if (this.value === undefined) {
            throw this.error;
        }
        return this.value.value;
    }

    public unwrapOr(def: T): T {
        if (this.value === undefined) {
            return def;
        } else {
            return this.value.value;
        }
    }

    public unwrapOrElse(op: (err: E) => T): T {
        if (this.value === undefined) {
            return op(this.error as E);
        } else {
            return this.value.value;
        }
    }

    public unwrapError(): E {
        if (this.value === undefined) {
            return this.error as E;
        }
        throw new ReferenceError(`Accessing error in Ok result`);
    }

    public map<R>(map: (value: T) => R): Result<R, E> {
        if (this.value === undefined) {
            return Result.Err<R, E>(this.error as E);
        } else {
            return Result.Ok(map(this.value.value));
        }
    }

    public cast<R>(): Result<R, E> {
        return this.map(value => value as unknown as R);
    }

    public mapOr<U>(def: U, map: (value: T) => U): U {
        if (this.value === undefined) {
            return def;
        } else {
            return map(this.value.value);
        }
    }

    public mapOrElse<U>(def: (err: E) => U, map: (value: T) => U): U {
        if (this.value === undefined) {
            return def(this.error as E);
        } else {
            return map(this.value.value);
        }
    }

    public mapErr<F extends Error>(map: (err: E) => F): Result<T, F> {
        if (this.value === undefined) {
            return Result.Err<T, F>(map(this.error as E));
        } else {
            return Result.Ok<T, F>(this.value.value);
        }
    }

    public and<U>(res: Result<U, E>): Result<U, E> {
        if (this.value === undefined) {
            return Result.Err<U, E>(this.error as E);
        } else {
            return res;
        }
    }

    public andThen<U>(then: (value: T) => Result<U, E>): Result<U, E> {
        if (this.value === undefined) {
            return Result.Err<U, E>(this.error as E);
        } else {
            return then(this.value.value);
        }
    }

    public async asyncAndThen<U>(then: (value: T) => Result<U, E> | Promise<Result<U, E>>): Promise<Result<U, E>> {
        if (this.value === undefined) {
            return Result.Err<U, E>(this.error as E);
        } else {
            return then(await this.value.value);
        }
    }

    public or<F extends Error>(res: Result<T, F>): Result<T, F> {
        if (this.value === undefined) {
            return res;
        } else {
            return Result.Ok(this.value.value);
        }
    }

    public orElse<F extends Error>(op: (err: Error) => Result<T, F>): Result<T, F> {
        if (this.value === undefined) {
            return op(this.error as E);
        } else {
            return Result.Ok(this.value.value);
        }
    }

    public asyncOrElse<F extends Error = E, R = T>(op: (err: E) => Promise<Result<R, F>>): Promise<Result<R | T, F | E>> {
        if (this.value === undefined) {
            return op(this.error as E);
        } else {
            return Promise.resolve(this);
        }
    }
}
