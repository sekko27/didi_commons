import { UndefinedEmpty, UndefinedOrNullEmpty } from "./empty/Empty.ts";
import { ISyncOptional } from "./sync/interfaces/ISyncOptional.ts";
import { IEmpty } from "./empty/IEmpty.ts";
import { IAsyncOptional } from "./async/interfaces/IAsyncOptional.ts";
import { MaybePromise } from "../interfaces/Promises.ts";
import { AsyncOptional } from "./async/AsyncOptional.ts";
import { EarlyEmptySyncOptional } from "./sync/early/EarlyEmptySyncOptional.ts";
import { EarlyNonEmptySyncOptional } from "./sync/early/EarlyNonEmptySyncOptional.ts";
import { IOptionalFactory } from "./sync/interfaces/IOptionalFactory.ts";
import { LazySyncOptional } from "./sync/lazy/LazySyncOptional.ts";
import { ILazySyncOptional } from "./sync/interfaces/ILazySyncOptional.ts";
import { IAsyncOptionalValueProvider } from "./async/interfaces/IAsyncOptionalValueProvider.ts";
import { MapperFunction } from "../interfaces/MapperFunction.ts";

export class Optional {
    public static readonly EMPTY: ISyncOptional<unknown, unknown> = new EarlyEmptySyncOptional(Optional as IOptionalFactory);

    public static of<T>(value: T | undefined): ISyncOptional<T, undefined> {
        return Optional.ofNonEmpty<T, undefined>(value, UndefinedEmpty);
    }

    public static ofNonNull<T>(value: T | undefined | null): ISyncOptional<T, undefined | null> {
        return Optional.ofNonEmpty<T, undefined | null>(value, UndefinedOrNullEmpty);
    }

    public static ofNonEmpty<T, E>(value: T | E, emptiness: IEmpty<E>): ISyncOptional<T, E> {
        return emptiness.test(value)
            ? Optional.EMPTY as ISyncOptional<T, E>
            : new EarlyNonEmptySyncOptional<T, E>(value as T, Optional as IOptionalFactory, emptiness);
    }

    public static ofLazy<T>(value: T | undefined): ILazySyncOptional<T, undefined> {
        return Optional.ofLazyNonEmpty<T, undefined>(value, UndefinedEmpty);
    }

    public static ofLazyNonNull<T>(value: T | undefined | null): ILazySyncOptional<T, undefined | null> {
        return Optional.ofLazyNonEmpty<T, undefined | null>(value, UndefinedOrNullEmpty);
    }

    public static ofLazyNonEmpty<T, E>(value: T | E, emptiness: IEmpty<E>): ILazySyncOptional<T, E> {
        return new LazySyncOptional<E, T, E>(emptiness, () => value, emptiness, Optional as IOptionalFactory);
    }

    public static ofAsync<T>(value: MaybePromise<T | undefined>, emptiness: IEmpty<undefined>): IAsyncOptional<T, undefined> {
        return Optional.ofAsyncNonEmpty<T, undefined>(value, emptiness);
    }

    public static ofAsyncNonNull<T>(value: MaybePromise<T | undefined | null>, emptiness: IEmpty<undefined>): IAsyncOptional<T, undefined | null> {
        return Optional.ofAsyncNonEmpty<T, undefined | null>(value, emptiness);
    }

    public static ofAsyncNonEmpty<T, E>(value: MaybePromise<T | E>, emptiness: IEmpty<E>): IAsyncOptional<T, E> {
        return new AsyncOptional<E, T, E>(emptiness, () => value, emptiness);
    }

    public static genericAsync<P, T, E>(
        previous: IAsyncOptionalValueProvider<P, E>,
        op: MapperFunction<P | E, MaybePromise<T | E>>,
        emptiness: IEmpty<E>
    ): IAsyncOptional<T, E> {
        return new AsyncOptional<P, T, E>(previous, op, emptiness);
    }

    public static asyncEmpty<T>(): IAsyncOptional<T, unknown> {
        return Optional.ofAsyncNonEmpty<T, undefined>(undefined, UndefinedEmpty);
    }
}
