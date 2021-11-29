import { IEmpty } from "./IEmpty.ts";

export class Empty<E> implements IEmpty<E> {
    constructor(private readonly emptyValues: E[]) {
        if (emptyValues.length === 0) {
            throw new TypeError(`Empty empty values`);
        }
    }

    getValue(): any {
        return this.emptyValues[0];
    }

    test(value: any): boolean {
        return this.emptyValues.indexOf(value) > -1;
    }
}

export const UndefinedEmpty: IEmpty<undefined> = new Empty([undefined]);
export const UndefinedOrNullEmpty: IEmpty<undefined | null> = new Empty([undefined, null]);
