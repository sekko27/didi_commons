export type MapperFunction<T, R> = (value: T) => R;
export type AsyncMapperFunction<T, R> = (value: T) => Promise<R>;
