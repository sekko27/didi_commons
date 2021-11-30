[![didi_commons ci](https://github.com/sekko27/didi_commons/workflows/Deno/badge.svg)](https://github.com/sekko/didi_commons)
[![codecov](https://codecov.io/gh/sekko27/didi_commons/branch/master/graph/badge.svg?token=C1KBCKICFB)](https://codecov.io/gh/sekko27/didi_commons)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/didi_commons/mod.ts)

![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fdep-count%2Fx%2Fdidi_commons%2Fmod.ts)
![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fupdates%2Fx%2Fdidi_commons%2Fmod.ts)
[![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fdidi_commons%2Fmod.ts)](https://deno.land/x/didi_commons)

# DIDI COMMONS

DiDi common module for the DiDi platform.

## Goals

It implements core types other modules use them.

```typescript
import { } from "https://deno.land/x/didi_commons@v0.0.2/mod.ts";
```
 
## Modules

### Optional

Module provides 3 implementations for Optional. They are available in Optional export

```typescript
import { Optional, Empty, IEmpty } from "https://deno.land/x/didi_commons@v0.0.2/lib/optional/mod.ts";
```

#### Sync early

This implementation evaluates current value for each operation (map, filter). Each operation and value must be non-promise.

#### Sync lazy

This implementation evaluates value only at termination (get, empty, etc). Each operation and value must be non-promise.

#### Async lazy

This implementation supports async values and async operations. It evaluates value at termination.

#### Instantiation

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

#### Sync-to-Async gateway

You can convert sync implementations to async one by asyncMap, asyncFilter and asyncFlatMap methods on syncs:

```typescript
await Optional.of("some").asyncFilter(async value => repo.exists(value)).get();
await Optional.of("some").asyncMap(async value => `mapper - ${value}`).get();
await Optional.of("some").asyncFlatMap(async value => Optional.ofAsync(`mapper - ${value}`)).get();
```

#### Examples

```typescript
// Sync + early + empty is undefined
Optional.of("some").filter(v => v.startsWith("s")); // Filter predicate invoked here

// Sync + lazy + empty is undefined
const o1 = Optional.ofLazy("some").filter(v => v.startsWith("s")); // Filter predicate NOT invoked here
o1.get(); // only here

// Async is always lazy
const o2 = Optional.ofAsync("some").filter(async v => repo.existsByName(v)).map(async v => tags.byName(v)); // filter and mapper NOT invoked here
await o2.get(); // only here
```

## Testing

```bash
deno lint && deno test -A --unstable --importmap imports.json --config deno.json
```

## TODOS

### Optional

1. [x] Make gateway from sync to async
2. [x] Testing invokes for lazy (sync-lazy and async).
3. [x] Remove intermediate factories
