export type Supplier<T> = () => T;

export const NullSupplier: Supplier<null> = () => null;
export const UndefinedSupplier: Supplier<unknown> = () => undefined;
