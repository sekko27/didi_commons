import { AnyPromise, Awaited, IOptional, OptionalStreamOpResult, OptionalTerminationResult } from "./IOptional.ts";
import { NoSuchElementException } from "../errors/NoSuchElementException.ts";
import { Supplier } from "../interfaces/Supplier.ts";
import { PredicateFunction } from "../interfaces/PredicateFunction.ts";

type EmptyType = undefined | Promise<undefined>;
export class EmptyOptional implements IOptional<EmptyType> {

    empty(): OptionalTerminationResult<boolean, undefined> {
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

    orElse<O extends PromiseLike<EmptyType> | EmptyType>(other: O): AnyPromise<EmptyType, EmptyType, O> {
        return undefined;
    }


    filter<R extends boolean | Promise<boolean>>(predicate: PredicateFunction<Awaited<undefined>, R>): OptionalStreamOpResult<undefined, undefined, R> {
        return this;
    }


    map<R>(): IOptional<undefined> {
        return this;
    }

    asyncMap<R>(): Promise<IOptional<R | undefined>> {
        return Promise.resolve(this);
    }

    mapNullable<R>(): IOptional<R | undefined> {
        return this;
    }

    flatMap<R>(): IOptional<R | undefined> {
        return this;
    }


}
