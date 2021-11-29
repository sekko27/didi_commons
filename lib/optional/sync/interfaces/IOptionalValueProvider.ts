export interface IOptionalValueProvider<T, E> {
    getValue(): T | E;
}
