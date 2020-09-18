# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.1-alpha.1](https://github.com/apollo-elements/apollo-elements/compare/@apollo-elements/test-helpers@0.1.1-alpha.0...@apollo-elements/test-helpers@0.1.1-alpha.1) (2020-09-18)

**Note:** Version bump only for package @apollo-elements/test-helpers





## [0.1.1-alpha.0](https://github.com/apollo-elements/apollo-elements/compare/@apollo-elements/test-helpers@0.1.0...@apollo-elements/test-helpers@0.1.1-alpha.0) (2020-09-14)


* feat(test-helpers)!: apollo client 3 ([ca6fd3c](https://github.com/apollo-elements/apollo-elements/commit/ca6fd3c182fa87f14452784ace41e171c0f19901))


### BREAKING CHANGES

* bump to `@apollo/client`





# [0.1.0](https://github.com/apollo-elements/apollo-elements/compare/@apollo-elements/test-helpers@0.0.9...@apollo-elements/test-helpers@0.1.0) (2020-05-25)


### Bug Fixes

* **mixins:** remove cache-first fetch-policy ([0db5d67](https://github.com/apollo-elements/apollo-elements/commit/0db5d673e79e2b96db849b0cd79a151be4b48223))


### Features

* rewrite in typescript ([f69a648](https://github.com/apollo-elements/apollo-elements/commit/f69a6487b917a95af127547077c0d951f8df301b))


### BREAKING CHANGES

* **mixins:** removes default fetch-policy per instance

affects: @apollo-elements/mixins, @apollo-elements/hybrids, @apollo-elements/gluon, @apollo-elements/lit-apollo, @apollo-elements/polymer

Co-authored-by: Kevin Simper <kevin.simper@gmail.com>
* - rename `update` => `updater` in Mutation components
- remove `setVariables` from query-mixin
- make parameters optional on:
  - `ApolloQuery#subscribe`
  - `ApolloSubscription#subscribe`
  - `ApolloQuery#executeQuery`
  - `ApolloQuery#fetchMore` and
  - `ApolloQuery#watchQuery`
- For Hybrids, setting variables now subscribes to the query

affects: @apollo-elements/eslint-config, @apollo-elements/gluon, @apollo-elements/hybrids, @apollo-elements/lib, @apollo-elements/lit-apollo, @apollo-elements/mixins, @apollo-elements/polymer, @apollo-elements/test-helpers





## [0.0.9](https://github.com/apollo-elements/apollo-elements/compare/@apollo-elements/test-helpers@0.0.4...@apollo-elements/test-helpers@0.0.9) (2020-01-09)

**Note:** Version bump only for package @apollo-elements/test-helpers





## [0.0.7](https://github.com/apollo-elements/apollo-elements/compare/@apollo-elements/test-helpers@0.0.4...@apollo-elements/test-helpers@0.0.7) (2020-01-09)

**Note:** Version bump only for package @apollo-elements/test-helpers





## [0.0.6](https://github.com/apollo-elements/apollo-elements/compare/@apollo-elements/test-helpers@0.0.4...@apollo-elements/test-helpers@0.0.6) (2020-01-09)

**Note:** Version bump only for package @apollo-elements/test-helpers





## [0.0.5](https://github.com/apollo-elements/apollo-elements/compare/@apollo-elements/test-helpers@0.0.4...@apollo-elements/test-helpers@0.0.5) (2020-01-09)

**Note:** Version bump only for package @apollo-elements/test-helpers





## [0.0.4](https://github.com/apollo-elements/apollo-elements/compare/@apollo-elements/test-helpers@0.0.3...@apollo-elements/test-helpers@0.0.4) (2019-05-26)

**Note:** Version bump only for package @apollo-elements/test-helpers
