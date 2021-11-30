export interface IEmpty<E> {
    getValue(): E;
    test<V>(value: E | V): boolean;
}
