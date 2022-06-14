export class BooleanHelper {
    public static xor(expr1: boolean, expr2: boolean): boolean {
        return ((expr1 && !expr2) || (!expr1 && expr2));
    }

    public static exclusivelyUndefined(value1: unknown, value2: unknown): boolean {
        return BooleanHelper.xor(value1 === undefined, value2 === undefined);
    }
}
