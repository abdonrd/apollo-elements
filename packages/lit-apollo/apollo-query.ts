import type { NetworkStatus } from '@apollo/client/core';
import { property } from 'lit-element';

import { ApolloElement } from './apollo-element';
import { ApolloQueryMixin } from '@apollo-elements/mixins/apollo-query-mixin';
import { ApolloQueryInterface, Constructor } from '@apollo-elements/interfaces';

/**
 * `ApolloQuery`
 *
 * 🚀 Custom element base class that connects to your Apollo cache.
 */
export class ApolloQuery<TData, TVariables>
  extends ApolloQueryMixin(ApolloElement as Constructor<ApolloElement>)<TData, TVariables>
  implements ApolloQueryInterface<TData, TVariables> {
  @property({ type: Number }) networkStatus: NetworkStatus;

  @property({ type: Boolean, attribute: 'no-auto-subscribe' }) noAutoSubscribe = false;
}
