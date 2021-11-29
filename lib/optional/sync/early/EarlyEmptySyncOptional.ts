import { NoSuchElementException } from "../../../errors/NoSuchElementException.ts";
import { Supplier } from "../../../interfaces/Supplier.ts";
import { ISyncOptional } from "../interfaces/ISyncOptional.ts";

export class EarlyEmptySyncOptional implements ISyncOptional<any, any> {
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

    map(): ISyncOptional<any, any> {
        return this;
    }

    flatMap(): ISyncOptional<any, any> {
        return this;
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
