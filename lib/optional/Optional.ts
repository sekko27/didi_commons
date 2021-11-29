import { UndefinedEmpty, UndefinedOrNullEmpty } from "./empty/Empty.ts";
import { ISyncOptional } from "./sync/interfaces/ISyncOptional.ts";
import { EarlySyncOptionalFactory } from "./sync/early/EarlySyncOptionalFactory.ts";
import { IEmpty } from "./empty/IEmpty.ts";
import { LazySyncOptionalFactory } from "./sync/lazy/LazySyncOptionalFactory.ts";
import { IAsyncOptional } from "./async/interfaces/IAsyncOptional.ts";
import { AsyncOptionalFactory } from "./async/AsyncOptionalFactory.ts";
import { MaybePromise } from "../interfaces/Promises.ts";

export class Optional {
    public static of<T>(value: T | undefined): ISyncOptional<T, undefined> {
        return Optional.ofNonEmpty<T, undefined>(value, UndefinedEmpty);
    }

    public static ofNonNull<T>(value: T | undefined | null): ISyncOptional<T, undefined | null> {
        return Optional.ofNonEmpty<T, undefined | null>(value, UndefinedOrNullEmpty);
    }

    public static ofNonEmpty<T, E>(value: T | E, emptiness: IEmpty<E>): ISyncOptional<T, E> {
        return EarlySyncOptionalFactory.of<T, E>(value, emptiness);
    }

    public static ofLazy<T>(value: T | undefined): ISyncOptional<T, undefined> {
        return Optional.ofLazyNonEmpty<T, undefined>(value, UndefinedEmpty);
    }

    public static ofLazyNonNull<T>(value: T | undefined | null): ISyncOptional<T, undefined | null> {
        return Optional.ofLazyNonEmpty<T, undefined | null>(value, UndefinedOrNullEmpty);
    }

    public static ofLazyNonEmpty<T, E>(value: T | E, emptiness: IEmpty<E>): ISyncOptional<T, E> {
        return LazySyncOptionalFactory.of<T, E>(value, emptiness);
    }

    public static ofAsync<T>(value: MaybePromise<T | undefined>, emptiness: IEmpty<undefined>): IAsyncOptional<T, undefined> {
        return Optional.ofAsyncNonEmpty<T, undefined>(value, emptiness);
    }

    public static ofAsyncNonNull<T>(value: MaybePromise<T | undefined | null>, emptiness: IEmpty<undefined>): IAsyncOptional<T, undefined | null> {
        return Optional.ofAsyncNonEmpty<T, undefined | null>(value, emptiness);
    }

    public static ofAsyncNonEmpty<T, E>(value: MaybePromise<T | E>, emptiness: IEmpty<E>): IAsyncOptional<T, E> {
        return AsyncOptionalFactory.of<T, E>(value, emptiness);
    }
}
