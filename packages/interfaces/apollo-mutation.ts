import type {
  DocumentNode,
  ErrorPolicy,
  FetchPolicy,
  FetchResult,
  MutationOptions,
  MutationUpdaterFn,
  OperationVariables,
} from '@apollo/client/core';

import type { RefetchQueryDescription } from '@apollo/client/core/watchQueryOptions';

import type { ComponentDocument, Data, Variables } from './operation';
import type { ApolloElementInterface } from './apollo-element';

import { ApolloMutationMixin } from '@apollo-elements/mixins/apollo-mutation-mixin';

export type RefetchQueriesType<D> =
  RefetchQueryDescription |
  ((result: FetchResult<Data<D>>) =>
    RefetchQueryDescription);

export type OptimisticResponseType<D, V> =
  Data<D> |
  ((vars: Variables<D, V>) =>
    Data<D>);

/**
 * Common interface for mutation elements
 *
 * See [`ApolloElementInterface`](https://apolloelements.dev/api/interfaces/element) for more information on events
 *
 * @element
 *
 * @fires 'apollo-mutation-result' when the mutation resolves
 * @fires 'apollo-error' when the mutation rejects
 */
export declare class ApolloMutationInterface<D, V = OperationVariables>
  extends ApolloElementInterface {
  /**
   * Latest mutation data
   */
  declare data: Data<D> | null;

  /**
   * An object that maps from the name of a variable as used in the mutation GraphQL document to that variable's value.
   *
   * @summary Mutation variables.
   */
  declare variables: Variables<D, V> | null;

  /** The mutation. */
  declare mutation: DocumentNode | ComponentDocument<D> | null;

  /**
   * An object that represents the result of this mutation that
   * will be optimistically stored before the server has actually returned a
   * result.
   *
   * This is most often used for optimistic UI, where we want to be able to see
   * the result of a mutation immediately, and update the UI later if any errors
   * appear.
   */
  declare optimisticResponse?: OptimisticResponseType<D, V>;

  /**
   * Whether the mutation was called
   */
  declare called: boolean;

  /**
   * If true, the returned data property will not update with the mutation result.
   */
  declare ignoreResults?: boolean;

  /**
   * Specifies the ErrorPolicy to be used for this mutation.
   */
  declare errorPolicy?: ErrorPolicy;

  /**
   * Specifies the FetchPolicy to be used for this mutation.
   */
  declare fetchPolicy?: Extract<FetchPolicy, 'no-cache'>;

  /**
   * A list of query names which will be refetched once this mutation has returned.
   * This is often used if you have a set of queries which may be affected by a mutation and will have to update.
   * Rather than writing a mutation query reducer (i.e. `updateQueries`) for this,
   * you can refetch the queries that will be affected
   * and achieve a consistent store once these queries return.
   */
  declare refetchQueries: RefetchQueriesType<D> | null;

  /**
   * Queries refetched as part of refetchQueries are handled asynchronously,
   * and are not waited on before the mutation is completed (resolved).
   * Setting this to true will make sure refetched queries are completed
   * before the mutation is considered done. false by default.
   */
  declare awaitRefetchQueries?: boolean;

  constructor(...a: any[]);

  /**
   * Callback for when a mutation is completed.
   */
  onCompleted?(_data: Data<D>): void

  /**
   * Callback for when an error occurs in mutation.
   */
  onError?(_error: Error): void

  /**
   * A function which updates the apollo cache when the query responds.
   * This function will be called twice over the lifecycle of a mutation.
   * Once at the very beginning if an optimisticResponse was provided.
   * The writes created from the optimistic data will be rolled back before
   * the second time this function is called which is when the mutation has
   * succesfully resolved. At that point update will be called with the actual
   * mutation result and those writes will not be rolled back.
   *
   * The reason a DataProxy is provided instead of the user calling the methods
   * directly on ApolloClient is that all of the writes are batched together at
   * the end of the update, and it allows for writes generated by optimistic
   * data to be rolled back.
   */
  updater?(
    ...params: Parameters<MutationUpdaterFn<Data<D>>>
  ): ReturnType<MutationUpdaterFn<Data<D>>>;

  /**
   * This resolves a single mutation according to the options specified and returns a
   * Promise which is either resolved with the resulting data or rejected with an error.
   */
  public mutate(
    params?: Partial<MutationOptions<Data<D>, Variables<D, V>>>
  ): Promise<FetchResult<Data<D>>>;
}

export class ApolloMutationElement<D = unknown, V = OperationVariables>
  extends ApolloMutationMixin(HTMLElement)<D, V> implements ApolloMutationInterface<D, V> {
    declare data: Data<D> | null;

    declare variables: Variables<D, V> | null;
}
