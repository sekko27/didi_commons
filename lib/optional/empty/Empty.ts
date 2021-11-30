import { IEmpty } from "./IEmpty.ts";

export class Empty<E> implements IEmpty<E> {
    constructor(private readonly emptyValues: E[]) {
        if (emptyValues.length === 0) {
            throw new TypeError(`Empty empty values`);
        }
    }

    getValue(): E {
        return this.emptyValues[0];
    }

    test<V>(value: V | E): boolean {
        return (this.emptyValues as (E | V)[]).indexOf(value) > -1;
    }
}

export const UndefinedEmpty: IEmpty<undefined> = new Empty([undefined]);
export const UndefinedOrNullEmpty: IEmpty<undefined | null> = new Empty([undefined, null]);
