# DIDI COMMONS

DiDi common module for the DiDi platform.

## Goals

It implements core types other modules use them.
 
## Modules

### Optional

Implements almost Java compatible [Optional<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Optional.html) type.

The main differences:

1. Optional.of accepts **undefined** values too, so it becomes *Empty*
2. Optional.ofNullable accepts undefined values too, so **undefined** and **null** becomes *Empty*.

We use terms:

|Term|Description|
|----|----|
|interface IOptionalFactory|Static part of Optional: *of* and *ofNullable*|
|interface IOptional|Concrete implementations: empty, non-empty.|


## Testing

```bash
deno lint && deno test -A --unstable --importmap imports.json
```
