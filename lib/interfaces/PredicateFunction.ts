export type PredicateFunction<T, R extends boolean | PromiseLike<boolean>> = (value: T) => R;
export const IsUndefined: PredicateFunction<unknown, boolean> = value => value === undefined;
export const IsNull: PredicateFunction<unknown, boolean> = value => value === null;
