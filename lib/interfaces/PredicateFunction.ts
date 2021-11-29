export type PredicateFunction<T, R extends boolean | PromiseLike<boolean>> = (value: T) => R;
export const IsUndefined: PredicateFunction<any, boolean> = value => value === undefined;
export const IsNull: PredicateFunction<any, boolean> = value => value === null;
