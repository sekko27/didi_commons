import { IOptional} from "./IOptional.ts";
import { NoSuchElementException } from "../errors/NoSuchElementException.ts";
import { Supplier } from "../interfaces/Supplier.ts";

export class EmptyOptional implements IOptional<undefined> {
    empty(): boolean {
        return true;
    }

    isPresent(): boolean {
        return false;
    }

    ifPresent(): void {
    }

    get(): undefined {
        throw new NoSuchElementException(`Requesting empty optional value`);
    }

    filter(): IOptional<undefined> {
        return this;
    }

    map<R>(): IOptional<undefined> {
        return this;
    }

    mapNullable<R>(): IOptional<R | undefined> {
        return this;
    }

    flatMap<R>(): IOptional<R | undefined> {
        return this;
    }

    orElse<T>(other: T): T {
        return other;
    }

    orElseGet<T>(supplier: Supplier<T>): T {
        return supplier();
    }

    orElseThrow(supplier: Supplier<Error>): undefined {
        throw supplier();
    }
}
