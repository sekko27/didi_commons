import {
    AnyPromise,
    Awaited,
    IOptional,
    OncePromised,
    OptionalStreamOpResult,
    OptionalTerminationResult
} from "./IOptional.ts";
import { Consumer } from "../interfaces/Consumer.ts";
import { PredicateFunction } from "../interfaces/PredicateFunction.ts";

type Evaluated<R, T = R> = AnyPromise<Awaited<R>, T, R>;
interface State<P> {
    evaluate(): Evaluated<P>;
}

function isPromise<T>(value: any): value is PromiseLike<T> {
    return value instanceof Promise;
}

async function resolvePromise<T>(value: PromiseLike<T>): Promise<Awaited<T>> {
    const resolved = await value;
    if (isPromise<T>(resolved)) {
        return resolvePromise<T>(resolved);
    } else {
        return resolved as Awaited<T>;
    }
}

export class XOptional<T, P> implements IOptional<T> {
    private evaluated: {value: Evaluated<T, P>} | undefined = undefined;
    constructor(private readonly previous: State<P>, private readonly step: (value: Awaited<P>) => Evaluated<T, P>) {
    }

    evaluate(): Evaluated<T, P> {
        if (this.evaluated === undefined) {
            const prev = this.previous.evaluate();
            if (isPromise<P>(prev)) {
                this.evaluated =  {
                    value: resolvePromise<P>(prev).then((resolved: Awaited<P>) => this.step(resolved)) as Evaluated<T, P>
                };
            } else {
                this.evaluated = {
                    value: this.step(prev as Awaited<P>) as Evaluated<T, P>
                };
            }
        }
        return this.evaluated.value;
    }

    private terminate<R>(map: (resolved: Awaited<T>) => R): OptionalTerminationResult<R, T> {
        const value = this.evaluate();
        return (
            isPromise<Awaited<T>>(value) ? value.then(map) : map(value as Awaited<T>)
        ) as OptionalTerminationResult<R, T>;
    }

    empty(): OptionalTerminationResult<boolean, T> {
        return this.terminate(v => v === undefined);
    }

    isPresent(): OptionalTerminationResult<boolean, T> {
        return this.terminate(v => v !== undefined);
    }

    ifPresent(consumer: Consumer<Awaited<T>, OptionalTerminationResult<void, T>>): OptionalTerminationResult<void, T> {
        return this.terminate<void>(consumer);
    }

    get(): OptionalTerminationResult<Awaited<T>, T> {
        return this.terminate<Awaited<T>>(v => v);
    }

    orElse<O extends PromiseLike<T> | T>(other: O): OptionalTerminationResult<Awaited<T>, T> {
        return this.terminate<Awaited<T>>(v => (v === undefined ? (isPromise(other) ? resolvePromise(other) : other) : v) as Awaited<T>);
    }


    filter<R extends boolean | PromiseLike<boolean>>(predicate: PredicateFunction<Awaited<T>, R>): OptionalStreamOpResult<T, T, R> {
        return new XOptional<T, T>(this, (v) => {
            if (v === undefined) {
                return undefined;
            }
            const test = resolvePromise(predicate(v));
            return isPromise<boolean>(test)
                ? test.then(t => t ? v : undefined)
                : (test ? v : undefined);
        });
    }

    map<R>(mapper: MapperFunction<Awaited<T>, R>): OptionalStreamOpResult<R, T, R> {
        return undefined;
    }


}
