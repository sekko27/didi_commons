export interface IEmpty<E> {
    getValue(): E;
    test(value: any): boolean;
}
