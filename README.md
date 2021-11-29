# DIDI COMMONS

DiDi common module for the DiDi platform.

## Goals

It implements core types other modules use them.
 
## Modules

### Optional

Module provides 3 implementations for Optional. They are available in Optional statics:

```typescript
// Default - sync + early + empty is undefined
import { IEmpty } from "./IEmpty";
import { ISyncOptional } from "./ISyncOptional";
import { MaybePromise } from "./Promises";
import { IAsyncOptional } from "./IAsyncOptional";

Optional.of<string>("string"); // some
Optional.of<string>(null); // ! some
Optional.of<string>(undefined); // none

// sync + early + empty is undefined or null
Optional.ofNonNull<string>("string"); // some
Optional.ofNonNull<string>(undefined); // none
Optional.ofNonNull<string>(null); // none

// sync + early + empty is custom
const integersAreEmpty: IEmpty<number> = {
    // Provide an empty value
    get() {
        return 27;
    },
    test(value: any) {
        return typeof value === "number" && parseInt(value) === value;
    }
}

Optional.ofNonEmpty<string, number>("string", integersAreEmpty); // some
Optional.ofNonEmpty<string, number>(10, integersAreEmpty); // none
Optional.ofNonEmpty<string | undefined, number>(undefined, integersAreEmpty); // ! some

// -----------------------------------
// Similarly for lazy sync 
declare namespace Optional {
    function ofLazy<T>(value: T | undefined): ISyncOptional<T, undefined>;

    function ofLazyNonNull<T>(value: T | undefined | null): ISyncOptional<T, undefined | null>;

    function ofLazyNonEmpty<T, E>(value: T | E, emptiness: IEmpty<E>): ISyncOptional<T, E>;
}

// And for lazy async
declare namespace Optional {
    function ofAsync<T>(value: MaybePromise<T | undefined>): IAsyncOptional<T, undefined>;
    
    function ofAsyncNonNull<T>(value: MaybePromise<T | undefined | null>): IAsyncOptional<T, undefined | null>;
    
    function ofAsyncNonEmpty<T, E>(value: MaybePromise<T | E>, emptiness: IEmpty<E>): IAsyncOptional<T, E>;
}
```

#### Sync early

This implementation evaluates current value for each operation (map, filter). Each operation and value must be non-promise.

#### Sync lazy

This implementation evaluates value only at termination (get, empty, etc). Each operation and value must be non-promise.

#### Async lazy

This implementation supports async values and async operations. It evaluates value at termination.

## Testing

```bash
deno lint && deno test -A --unstable --importmap imports.json --config deno.json
```
