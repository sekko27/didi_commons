export type PredicateFunction<T, R extends boolean | PromiseLike<boolean>> = (value: T) => R;
