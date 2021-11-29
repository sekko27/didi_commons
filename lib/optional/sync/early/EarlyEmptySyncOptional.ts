import { NoSuchElementException } from "../../../errors/NoSuchElementException.ts";
import { Supplier } from "../../../interfaces/Supplier.ts";
import { ISyncOptional } from "../interfaces/ISyncOptional.ts";
import { IAsyncOptional } from "../../async/interfaces/IAsyncOptional.ts";
import { IOptionalFactory } from "../interfaces/IOptionalFactory.ts";

export class EarlyEmptySyncOptional implements ISyncOptional<any, any> {
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

    filter(): ISyncOptional<any, any> {
        return this;
    }

    asyncFilter(): IAsyncOptional<any, any> {
        return this.factory.asyncEmpty();
    }

    map(): ISyncOptional<any, any> {
        return this;
    }

    asyncMap<R>(): IAsyncOptional<R, any> {
        return this.factory.asyncEmpty();
    }

    flatMap(): ISyncOptional<any, any> {
        return this;
    }

    asyncFlatMap<R>(): IAsyncOptional<R, any> {
        return this.factory.asyncEmpty();
    }

    get(): undefined {
        throw new NoSuchElementException(`Requesting empty optional value`);
    }

    orElse<T>(other: T): T {
        return other;
    }

    orElseGet(supplier: Supplier<any>): any {
        return supplier();
    }

    orElseThrow(errorSupplier: Supplier<Error>): any {
        throw errorSupplier();
    }
}
