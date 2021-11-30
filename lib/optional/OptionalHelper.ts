import { IEmpty } from "./empty/IEmpty.ts";
import { PredicateFunction } from "../interfaces/PredicateFunction.ts";
import { MaybePromise } from "../interfaces/Promises.ts";
import { MapperFunction } from "../interfaces/MapperFunction.ts";
import { IAsyncOptional } from "./async/interfaces/IAsyncOptional.ts";

export class OptionalHelper {
    public static filter<T, E>(emptiness: IEmpty<E>, predicate: PredicateFunction<T, MaybePromise<boolean>>) {
        return async (value: T | E) => !emptiness.test(value) && await predicate(value as T) ? value : emptiness.getValue();
    }

    public static map<T, R, E>(emptiness: IEmpty<E>, mapper: MapperFunction<T, MaybePromise<R | E>>) {
        return (value: T | E) => emptiness.test(value) ? emptiness.getValue() : mapper(value as T);
    }

    public static flatMap<T, R, E>(emptiness: IEmpty<E>, mapper: MapperFunction<T, MaybePromise<IAsyncOptional<R, E>>>) {
        return async (value: T | E) => emptiness.test(value) ? emptiness.getValue() : (await mapper(value as T)).getValue();
    }
}
