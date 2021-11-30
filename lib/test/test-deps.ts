// TODO TO-BE-EXTERNALIZED
import { MapperFunction } from "../interfaces/MapperFunction.ts";

export {
    assertEquals,
    assertStrictEquals
} from "asserts";

import {
    assertEquals as toBeEqual,
    assertStrictEquals as toBeStrictEqual,
    assertThrows as toBeThrown,
    assertRejects as toBeRejected,
} from "asserts";

import type { Supplier } from "../interfaces/Supplier.ts";
import { MaybePromise } from "../interfaces/Promises.ts";

export type TestFunction<A extends unknown[], R> = (...args: A) => R;

function toBeInvoked<A extends unknown[], R>(func: TestFunction<A, R>, executor: (func: TestFunction<A, R>) => void, expected = true) {
    let invoked = false;
    executor((...args: A): R => {
       invoked = true;
       return func(...args);
    });
    toBeEqual(invoked, expected);
}

async function eventuallyToBeInvoked<A extends unknown[], R>(func: TestFunction<A, R>, executor: (func: TestFunction<A, R>) => MaybePromise<void>, expected = true) {
    let invoked = false;
    await executor((...args: A): R => {
        invoked = true;
        return func(...args);
    });
    toBeEqual(invoked, expected);
}

class TestCaseBuilder {
    private readonly def: Partial<Deno.TestDefinition> = {};

    constructor(name: string) {
        this.set("name", name);
    }

    get ignore(): this {
        this.set("ignore", false);
        return this;
    }

    public run(fn: () => void | Promise<void>): void {
        this.set("fn", fn);
        Deno.test(this.def as Deno.TestDefinition);
    }

    public toBeFalse(supplier: Supplier<unknown>) {
        this.run(() => toBeEqual(supplier(), false));
    }

    public toBeTrue(supplier: Supplier<unknown>) {
        this.run(() => toBeEqual(supplier(), true));
    }

    public eventuallyToBeTrue(supplier: Supplier<unknown>) {
        this.run(async () => toBeEqual(await supplier(), true));
    }

    public eventuallyToBeFalse(supplier: Supplier<unknown>) {
        this.run(async () => toBeEqual(await supplier(), false));
    }

    public toBeInvoked<A extends unknown[], R>(func: TestFunction<A, R>, executor: (func: TestFunction<A, R>) => void, expected = true) {
        this.run(() => toBeInvoked(func, executor, expected));
    }

    public eventuallyToBeInvoked<A extends unknown[], R>(func: TestFunction<A, R>, executor: (func: TestFunction<A, R>) => MaybePromise<void>, expected = true) {
        this.run(() => eventuallyToBeInvoked(func, executor, expected));
    }

    public toBeSameInstance(mapper: MapperFunction<unknown, unknown>) {
        const instance = {property: true};
        this.run(() => toBeStrictEqual(mapper(instance), instance));
    }

    public eventuallyToBeSameInstance(mapper: MapperFunction<unknown, unknown>) {
        const instance = {property: true};
        this.run(async () => toBeStrictEqual(await mapper(instance), instance));
    }

    // deno-lint-ignore no-explicit-any
    public toBeThrown<E extends Error = Error>(fn: (...args: unknown[]) => unknown, errorClass?: new (...args: any[]) => E) {
        this.run(() => toBeThrown(fn, errorClass));
    }

    public toBeRejected<E extends Error = Error>(fn: (...args: unknown[]) => Promise<unknown>, errorClass?: new (...args: string[]) => E) {
        this.run(() => toBeRejected(fn, errorClass));
    }

    public toBeFirst(mapper: MapperFunction<{first: unknown, second: unknown}, unknown>) {
        const first = {property: true};
        const second = {property: false};
        this.run(() => toBeStrictEqual(mapper({first, second}), first));
    }

    public eventuallyToBeFirst(mapper: MapperFunction<{first: unknown, second: unknown}, unknown>) {
        const first = {property: true};
        const second = {property: false};
        this.run(async () => toBeStrictEqual(await mapper({first, second}), first));
    }

    public toBeSecond(mapper: MapperFunction<{first: unknown, second: unknown}, unknown>) {
        const first = {property: true};
        const second = {property: false};
        this.run(() => toBeStrictEqual(mapper({first, second}), second));
    }

    public eventuallyToBeSecond(mapper: MapperFunction<{first: unknown, second: unknown}, unknown>) {
        const first = {property: true};
        const second = {property: false};
        this.run(async () => toBeStrictEqual(await mapper({first, second}), second));
    }

    private set<K extends keyof Deno.TestDefinition>(key: K, value: Deno.TestDefinition[K]): this {
        this.def[key] = value;
        return this;
    }
}

export function test(name: string): TestCaseBuilder {
    return new TestCaseBuilder(name);
}
