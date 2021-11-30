import { NoSuchElementException } from "../../../errors/NoSuchElementException.ts";
import { Supplier } from "../../../interfaces/Supplier.ts";
import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { IAsyncOptional } from "../../async/interfaces/IAsyncOptional.ts";
import { IOptionalFactory } from "../interfaces/IOptionalFactory.ts";

export class EarlyEmptySyncOptional implements ISyncOptional<unknown, unknown> {
    constructor(private readonly factory: IOptionalFactory) {
    }

    empty(): boolean {
        return true;
    }

    isPresent(): boolean {
        return false;
    }

    ifPresent(): void {
    }

    filter<T>(): ISyncOptional<T, unknown> {
        return this as unknown as ISyncOptional<T, unknown>;
    }

    asyncFilter<T>(): IAsyncOptional<T, unknown> {
        return this.factory.asyncEmpty();
    }

    map<R>(): ISyncOptional<R, unknown> {
        return this as unknown as ISyncOptional<R, unknown>;
    }

    asyncMap<R>(): IAsyncOptional<R, unknown> {
        return this.factory.asyncEmpty();
    }

    flatMap<R>(): ISyncOptional<R, unknown> {
        return this as unknown as ISyncOptional<R, unknown>;
    }

    asyncFlatMap<R>(): IAsyncOptional<R, unknown> {
        return this.factory.asyncEmpty();
    }

    get(): undefined {
        throw new NoSuchElementException(`Requesting empty optional value`);
    }

    orElse<T>(other: T): T {
        return other;
    }

    orElseGet<T>(supplier: Supplier<T>): T {
        return supplier();
    }

    orElseThrow<T>(errorSupplier: Supplier<Error>): T {
        throw errorSupplier();
    }
}
