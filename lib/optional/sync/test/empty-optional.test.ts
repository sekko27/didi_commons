import * as Didi from "../../../test/test-deps.ts";
import { Supplier, UndefinedSupplier } from "../../../interfaces/Supplier.ts";
import { EarlySyncOptionalTestsContext, ITestsContext, LazySyncOptionalTestsContext } from "./helpers.ts";
import { NoSuchElementException } from "../../../errors/NoSuchElementException.ts";
import { UndefinedEmpty } from "../../empty/Empty.ts";
import { AsyncOptionalTestsContext } from "../../async/test/helpers.ts";

function tests(ctx: ITestsContext<any>) {
    const asyncContext = new AsyncOptionalTestsContext<undefined>(UndefinedEmpty);

    Didi.test("it should be empty")
        .toBeTrue(() => ctx.empty().empty());

    Didi.test("it should be non-present")
        .toBeFalse(() => ctx.empty().isPresent());

    Didi.test("should not invoke consumer - ifPresent")
        .toBeInvoked(() => {
        }, consumer => ctx.empty().ifPresent(consumer), false);

    Didi.test("should throw error on getting value")
        .toBeThrown<NoSuchElementException>(() => ctx.empty().get(), NoSuchElementException);

    Didi.test("filter should not be invoked")
        .toBeInvoked(() => true, predicate => ctx.empty().filter(predicate), false);

    Didi.test("filter should response empty")
        .toBeTrue(() => ctx.empty().filter(() => true).empty());

    Didi.test("mapper should not be invoked")
        .toBeInvoked(() => "other", mapper => ctx.empty().map(mapper), false);

    Didi.test("map to should response empty")
        .toBeTrue(() => ctx.empty().map(UndefinedSupplier).empty());

    Didi.test("flat-map should not be invoked")
        .toBeInvoked(ctx.other, mapper => ctx.empty().flatMap(mapper), false);

    Didi.test("flat-map to empty to be empty")
        .toBeTrue(() => ctx.empty().flatMap(ctx.empty).empty());

    Didi.test("flat-map to non-empty to be empty")
        .toBeTrue(() => ctx.empty().flatMap(ctx.some).empty());

    Didi.test("orElse should response else value")
        .toBeSameInstance((value) => ctx.empty().orElse(value));

    Didi.test("orElseGet should invoke supplier")
        .toBeInvoked(() => "other", (supplier: Supplier<string>) => ctx.empty().orElseGet(supplier));

    Didi.test("orElseGet should response else value")
        .toBeSameInstance(value => ctx.empty().orElseGet(() => value));

    Didi.test("orElseThrow should be invoked")
        .toBeThrown(() => ctx.empty().orElseThrow(ctx.error()), Error);

    Didi.test(`asyncFilter should be invoked on non-empty on termination`)
        .eventuallyToBeInvoked(async () => true, async f => {
            await ctx.some().asyncFilter(f).empty();
        }, true);

    Didi.test(`asyncFilter should not be invoked on empty on termination`)
        .eventuallyToBeInvoked(async () => true, async f => {
            await ctx.empty().asyncFilter(f).empty();
        }, false);

    Didi.test(`asyncFilter result to be empty when filter does not match`)
        .eventuallyToBeTrue(() => ctx.some().asyncFilter(async () => false).empty());

    Didi.test(`asyncFilter should pass instance`)
        .eventuallyToBeSameInstance((value) => ctx.opt(value).asyncFilter(async () => true).get());

    Didi.test("asyncMap should be invoked on non-empty on termination")
        .eventuallyToBeInvoked(async () => true, async f => {
            await ctx.some().asyncMap(f).empty();
        }, true);

    Didi.test(`asyncMap should not be invoked on empty on termination`)
        .eventuallyToBeInvoked(async () => true, async f => {
            await ctx.empty().asyncMap(f).empty();
        }, false);

    Didi.test("asyncMap should result empty on empty")
        .eventuallyToBeTrue(() => ctx.some().filter(() => false).asyncMap(() => true).empty());

    Didi.test(`asyncMap should result same instance`)
        .eventuallyToBeSameInstance((value) => ctx.some().asyncMap(async () => value).get());

    Didi.test("asyncFlatMap should be invoked on non-empty on termination")
        .eventuallyToBeInvoked(async () => asyncContext.other(), async f => {
            await ctx.some().asyncFlatMap(f).empty();
        }, true);

    Didi.test("asyncFlatMap should not be invoked on empty on termination")
        .eventuallyToBeInvoked(async () => asyncContext.other(), async f => {
            await ctx.empty().asyncFlatMap(f).empty();
        }, false);

    Didi.test("asyncFlatMap should result empty on empty")
        .eventuallyToBeTrue(() => ctx.some().filter(() => false).asyncFlatMap(() => asyncContext.other()).empty());

    Didi.test("asyncFlatMap should result same mapped instance")
        .eventuallyToBeSameInstance((value) => ctx.some().asyncFlatMap(async () => asyncContext.opt(value)).get());
}

function nonTerminationInvocationTests(name: string, ctx: ITestsContext<any>, expectedInvocation: boolean) {
    const asyncContext = new AsyncOptionalTestsContext<undefined>(UndefinedEmpty);
    Didi.test(`${name} - filter invocation without termination - ${expectedInvocation}`)
        .toBeInvoked((s: string) => s.startsWith("s"), f => ctx.some().filter(f), expectedInvocation);

    Didi.test(`${name} - map invocation without termination - ${expectedInvocation}`)
        .toBeInvoked((s: string) => `invoked ${s}`, f => ctx.some().map(f), expectedInvocation);

    Didi.test(`${name} - flatMap invocation without termination - ${expectedInvocation}`)
        .toBeInvoked(() => ctx.other(), f => ctx.some().flatMap(f), expectedInvocation);

    Didi.test(`${name} - async filter invocation without termination`)
        .toBeInvoked(async (s: string) => s.startsWith(s), f => ctx.some().asyncFilter(f), false);

    Didi.test(`${name} - filter invocation when applying async filter after that - without termination - ${expectedInvocation}`)
        .toBeInvoked((s: string) => s.startsWith(s), f => ctx.some().filter(f).asyncFilter(async () => true), expectedInvocation);

    Didi.test(`${name} - map invocation when applying async filter after that - without termination - ${expectedInvocation}`)
        .toBeInvoked((s: string) => `invoked ${s}`, f => ctx.some().map(f).asyncFilter(async () => true), expectedInvocation);

    Didi.test(`${name} - flat map invocation when applying async filter after that - without termination - ${expectedInvocation}`)
        .toBeInvoked(() => ctx.other(), f => ctx.some().flatMap(f).asyncFilter(async () => true), expectedInvocation);

    Didi.test(`${name} - filter invocation when applying async map after that - without termination - ${expectedInvocation}`)
        .toBeInvoked((s: string) => s.startsWith(s), f => ctx.some().filter(f).asyncMap(async () => true), expectedInvocation);

    Didi.test(`${name} - map invocation when applying async map after that - without termination - ${expectedInvocation}`)
        .toBeInvoked((s: string) => `invoked ${s}`, f => ctx.some().map(f).asyncMap(async () => true), expectedInvocation);

    Didi.test(`${name} - flat map invocation when applying async map after that - without termination - ${expectedInvocation}`)
        .toBeInvoked(() => ctx.other(), f => ctx.some().flatMap(f).asyncMap(async () => true), expectedInvocation);

    Didi.test(`${name} - filter invocation when applying async flat map after that - without termination - ${expectedInvocation}`)
        .toBeInvoked((s: string) => s.startsWith(s), f => ctx.some().filter(f).asyncFlatMap(async () => asyncContext.some()), expectedInvocation);

    Didi.test(`${name} - map invocation when applying async flat map after that - without termination - ${expectedInvocation}`)
        .toBeInvoked((s: string) => `invoked ${s}`, f => ctx.some().map(f).asyncFlatMap(async () => asyncContext.some()), expectedInvocation);

    Didi.test(`${name} - flat map invocation when applying flat async map after that - without termination - ${expectedInvocation}`)
        .toBeInvoked(() => ctx.other(), f => ctx.some().flatMap(f).asyncFlatMap(async () => asyncContext.some()), expectedInvocation);
}

const earlyContext = new EarlySyncOptionalTestsContext<undefined>(UndefinedEmpty);
const lazyContext = new LazySyncOptionalTestsContext<undefined>(UndefinedEmpty);

tests(earlyContext);
tests(lazyContext);

nonTerminationInvocationTests("early", earlyContext, true);
nonTerminationInvocationTests("lazy", lazyContext, false);
