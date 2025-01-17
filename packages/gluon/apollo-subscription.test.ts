import type * as C from '@apollo/client/core';

import type * as I from '@apollo-elements/core/types';

import type { ApolloSubscriptionController } from '@apollo-elements/core';

import { html } from 'lit-html';

import { nextFrame } from '@open-wc/testing';

import { ApolloSubscription } from './apollo-subscription';
import { assertType, isApolloError, stringify, TestableElement } from '@apollo-elements/test';

import {
  describeSubscription,
  setupSubscriptionClass,
} from '@apollo-elements/test/subscription.test';

import { GluonElement } from '@gluon/gluon';

class TestableApolloSubscription<D extends I.MaybeTDN = I.MaybeTDN, V = I.MaybeVariables<D>>
  extends ApolloSubscription<D, V> implements TestableElement {
  declare shadowRoot: ShadowRoot;

  static get is() { return 'gluon-test-subscription-element'; }

  declare controller: ApolloSubscriptionController<D, V>;

  get template() {
    return html`
      <output id="data">${stringify(this.data)}</output>
      <output id="error">${stringify(this.error)}</output>
      <output id="loading">${stringify(this.loading)}</output>
    `;
  }

  $(id: keyof TestableApolloSubscription<D, V>) {
    return this.shadowRoot.getElementById(id as string);
  }

  async hasRendered(): Promise<this> {
    await this.updateComplete;
    await nextFrame();
    await this.render();
    return this;
  }
}

describe('[gluon] ApolloSubscription', function() {
  describeSubscription({
    class: TestableApolloSubscription,
    setupFunction: setupSubscriptionClass(TestableApolloSubscription),
  });
});

type TypeCheckData = { a: 'a', b: number };
type TypeCheckVars = { d: 'd', e: number };
class TypeCheck extends ApolloSubscription<TypeCheckData, TypeCheckVars> {
  typeCheck() {
    /* eslint-disable max-len, func-call-spacing, no-multi-spaces */

    assertType<HTMLElement>                         (this);
    assertType<GluonElement>                        (this);

    // ApolloElementInterface
    assertType<C.ApolloClient<C.NormalizedCacheObject>> (this.client!);
    assertType<Record<string, unknown>>                 (this.context!);
    assertType<boolean>                                 (this.loading);
    assertType<C.DocumentNode>                          (this.document!);
    assertType<Error>                                   (this.error!);
    assertType<readonly I.GraphQLError[]>               (this.errors!);
    assertType<TypeCheckData>                           (this.data!);
    assertType<string>                                  (this.error.message);
    assertType<'a'>                                     (this.data.a);
    // @ts-expect-error: b as number type
    assertType<'a'>                                     (this.data.b);
    if (isApolloError(this.error))
      assertType<readonly I.GraphQLError[]>             (this.error.graphQLErrors);

    // ApolloSubscriptionInterface
    assertType<C.DocumentNode>                          (this.subscription!);
    assertType<TypeCheckVars>                           (this.variables!);
    assertType<C.FetchPolicy>                           (this.fetchPolicy!);
    assertType<C.ErrorPolicy>                           (this.errorPolicy!);
    assertType<string>                                  (this.fetchPolicy);
    assertType<boolean>                                 (this.notifyOnNetworkStatusChange!);
    assertType<number>                                  (this.pollInterval!);
    assertType<boolean>                                 (this.skip);
    assertType<boolean>                                 (this.noAutoSubscribe);

    /* eslint-enable max-len, func-call-spacing, no-multi-spaces */
  }
}

type TDN = C.TypedDocumentNode<TypeCheckData, TypeCheckVars>;
class TDNTypeCheck extends ApolloSubscription<TDN> {
  typeCheck() {
    assertType<TypeCheckData>(this.data!);
    assertType<TypeCheckVars>(this.variables!);
  }
}
