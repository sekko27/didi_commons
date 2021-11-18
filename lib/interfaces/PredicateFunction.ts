export type BooleanResult = boolean | (Promise<boolean> | boolean);
export type PredicateFunction<T, B extends boolean | (Promise<boolean> | boolean) = boolean> = (value: T) => B;
