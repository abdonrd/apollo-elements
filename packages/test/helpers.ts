import { spy, stub, SinonSpy, SinonStub } from 'sinon';

import { SetupFunction, SetupOptions, SetupResult, TestableElement } from './types';

import type * as I from '@apollo-elements/interfaces';

import type { Entries } from '@apollo-elements/interfaces';

import { defineCE, fixture } from '@open-wc/testing';

// 🐤 quack quack 🦆
export function isSubscription(x: unknown): x is ZenObservable.Subscription {
  return (
    !!x &&
    typeof x === 'object' &&
    x!.constructor.toString().startsWith('function Subscription')
  );
}

/**
 * Asserts that a value has a given type. This 'function' is only defined for the
 * benefit of the type checker - it has no runtime significance at all.
 * @param x value to check
 * @template T type to check against
 *
 * @example
 * ```ts
 * class Checked {
 *   field = 2;
 * }
 *
 * const checked = new Checked();
 * assertType<number>(checked.field)
 * ```
 */
export function assertType<T>(x: T): asserts x is T { x; }

export { isApolloError } from '@apollo/client/core';

export const stringify =
  (x: unknown): string =>
    JSON.stringify(x, null);

export function setupSpies<T>(keys: (keyof T)[] = [], object: T): Record<string|keyof T, SinonSpy> {
  return Object.fromEntries(keys
    .map(method =>
      [method, spy(object, method as keyof T)])) as unknown as Record<string|keyof T, SinonSpy>;
}

export function setupStubs<T>(keys: (keyof T)[] = [], object: T): Record<string|keyof T, SinonStub> {
  return Object.fromEntries(keys
    .map(method =>
      [method, stub(object, method as keyof T)])) as unknown as Record<string|keyof T, SinonStub>;
}

export function restoreSpies(getSpies: () => (Record<string, SinonSpy> | undefined)): () => void {
  return function() {
    const spies = getSpies();
    Object.keys(spies ?? {}).forEach(key => {
      spies?.[key].restore();
      delete spies?.[key];
    });
  };
}

export function restoreStubs(getStubs: () => (Record<string, SinonStub> | undefined)): () => void {
  return function() {
    const stubs = getStubs();
    Object.keys(stubs ?? {}).forEach(key => {
      stubs?.[key].restore();
      delete stubs?.[key];
    });
  };
}

export function waitForRender<T extends HTMLElement & TestableElement>(getElement: () => T|undefined) {
  return async function waitForRender(): Promise<void> {
    const element = getElement();
    await element?.hasRendered?.() ?? Promise.resolve();
  };
}

function setupClass<T extends TestableElement & I.ApolloElementInterface>(fopts?: {
  beforeDefine?: <U extends T>(k: I.Constructor<U>, opts: SetupOptions<U>) => void,
  omitKeys?: string[],
}) {
  return function(Klass: I.Constructor<T>): SetupFunction<T> {
    return async function setupElement<B extends T>(opts?: SetupOptions<B>): Promise<SetupResult<B>> {
      class Test extends (Klass as I.Constructor<TestableElement & I.ApolloElementInterface>) { }

      const { innerHTML = '', attributes, properties } = opts ?? {};

      fopts?.beforeDefine?.(Test as I.Constructor<B>, opts!);

      const tag = defineCE(Test);

      const spies = setupSpies(opts?.spy, Test.prototype as B);
      const stubs = setupStubs(opts?.stub, Test.prototype as B);

      const attrs = attributes ? ` ${attributes}` : '';

      const element = await fixture<B>(`<${tag}${attrs}>${innerHTML}</${tag}>`);

      // eslint-disable-next-line easy-loops/easy-loops
      for (const [key, val] of Object.entries(properties ?? {}) as Entries<B>) {
        if (!(fopts?.omitKeys ?? []).includes(key as string))
          element[key] = val;
      }

      return { element, spies, stubs };
    };
  };
}

export const setupApolloElementClass = setupClass();
export const setupQueryClass = setupClass<TestableElement & I.ApolloQueryInterface<any, any>>();
export const setupSubscriptionClass = setupClass<TestableElement & I.ApolloSubscriptionInterface<any, any>>();
export const setupMutationClass = setupClass<TestableElement & I.ApolloMutationInterface<any, any>>({
  omitKeys: ['onCompleted', 'onError'],
  beforeDefine(Test, opts) {
    // for mutation components, which don't fetch on connect,
    // and have optional instance callbacks,
    // we must ensure spies are created *after* properties are applied
    if (opts?.properties?.onCompleted)
      Test.prototype.onCompleted = opts?.properties.onCompleted;

    if (opts?.properties?.onError)
      Test.prototype.onError = opts?.properties.onError;
  },
});