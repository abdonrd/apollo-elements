import type { DocumentNode } from 'graphql/language/ast';
import type { Constructor } from './constructor';

import type {
  ApolloError,
  FetchPolicy,
  FetchResult,
  Observable,
  SubscriptionOptions,
} from '@apollo/client/core';

import type {
  ApolloSubscriptionInterface,
  OnSubscriptionDataParams,
  SubscriptionDataOptions,
} from '@apollo-elements/interfaces';

import { dedupeMixin } from '@open-wc/dedupe-mixin';

import { ApolloElementMixin } from './apollo-element-mixin';
import { hasAllVariables } from '@apollo-elements/lib/has-all-variables';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
//
function ApolloSubscriptionMixinImpl<TBase extends Constructor<HTMLElement>>(superclass: TBase) {
  /**
   * Class mixin for apollo-subscription elements
   */
  abstract class ApolloSubscriptionElement<TData, TVariables>
    extends ApolloElementMixin(superclass)
    implements ApolloSubscriptionInterface<TData, TVariables> {
    declare data: TData;

    declare fetchPolicy: FetchPolicy;

    declare fetchResults: boolean;

    declare pollInterval: number;

    declare observable: Observable<FetchResult<TData>>;

    declare observableSubscription: ZenObservable.Subscription;

    declare subscription: DocumentNode;

    declare variables: TVariables;

    declare skip: boolean;

    noAutoSubscribe = false;

    notifyOnNetworkStatusChange = false;

    onSubscriptionData?(_result: OnSubscriptionDataParams<TData>): void

    onSubscriptionComplete?(): void

    onError?(error: ApolloError): void

    /** @private */
    __variables: TVariables = null;

    constructor() {
      super();
      type This = this;
      Object.defineProperties(this, {
        subscription: {
          get(this: This): DocumentNode {
            return this.document;
          },

          set(this: This, subscription) {
            try {
              this.document = subscription;
            } catch (error) {
              throw new TypeError('Subscription must be a gql-parsed DocumentNode');
            }

            this.cancel();
            if (this.shouldSubscribe({ query: subscription }))
              this.subscribe();
          },
        },

        variables: {
          get(this: This): TVariables {
            return this.__variables;
          },

          set(this: This, variables: TVariables) {
            this.__variables = variables;
            this.cancel();
            if (this.shouldSubscribe({ variables }))
              this.subscribe();
          },
        },
      });
    }

    /** @protected */
    connectedCallback(): void {
      super.connectedCallback();
      if (!this.shouldSubscribe()) return;
      this.initObservable();
      this.subscribe();
    }

    public subscribe(params?: Partial<SubscriptionDataOptions<TData, TVariables>>) {
      this.initObservable(params);

      if (this.observableSubscription)
        return;

      this.observableSubscription =
        this.observable.subscribe({
          next: this.nextData.bind(this),
          error: this.nextError.bind(this),
          complete: this.onComplete.bind(this),
        });
    }

    public cancel(): void {
      this.endSubscription();
      this.observableSubscription = undefined;
      this.observable = undefined;
    }

    shouldSubscribe(options?: Partial<SubscriptionOptions>): boolean {
      const query = options?.query ?? this.subscription;
      const variables = options?.variables ?? this.variables;
      return !this.noAutoSubscribe && hasAllVariables({ query, variables });
    }

    /** @private */
    initObservable(params?: Partial<SubscriptionDataOptions<TData, TVariables>>): void {
      if (this.observable || (params?.skip ?? this.skip))
        return;

      this.observable =
        this.client.subscribe({
          query: params?.subscription ?? this.subscription,
          variables: params?.variables ?? this.variables,
          fetchPolicy: params?.fetchPolicy ?? this.fetchPolicy,
        });
    }

    nextData(result: FetchResult<TData>) {
      const { data } = result;
      const { client } = this;
      const loading = false;
      const error = null;
      const subscriptionData = { data, loading, error };
      this.onSubscriptionData?.({ client, subscriptionData });
      this.data = data;
      this.loading = loading;
      this.error = error;
    }

    nextError(error: ApolloError) {
      this.error = error;
      this.loading = false;
      this.onError?.(error);
    }

    onComplete(): void {
      this.onSubscriptionComplete?.();
      this.endSubscription();
    }

    /** @private */
    endSubscription() {
      if (this.observableSubscription) {
        this.observableSubscription.unsubscribe();
        this.observableSubscription = undefined;
      }
    }
  }

  return ApolloSubscriptionElement;
}

/**
 * `ApolloSubscriptionMixin`: class mixin for apollo-subscription elements.
 */
export const ApolloSubscriptionMixin =
  dedupeMixin(ApolloSubscriptionMixinImpl);