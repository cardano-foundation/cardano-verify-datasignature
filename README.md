# Cardano Signature Verification

<p align="left">

<img alt="Release" src="https://github.com/cardano-foundation/cardano-verify-datasignature/actions/workflows/release.yml/badge.svg?branch=main" />
<img alt="semantic-release: angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release" />

</p>

A lightweight typescript library to verify a cip30 datasignature.

## Getting Started

```zsh
npm i @cardano-foundation/cardano-signature-verification
```

## Verification

You need a key and a signature from a [cip30 datasignature](https://cips.cardano.org/cips/cip30/#apisigndataaddraddresspayloadbytespromisedatasignature). Use e.g. `window.cardano."wallet_name".enable().then(api => api.signData(...))` or the [signMessage](https://github.com/cardano-foundation/cardano-connect-with-wallet/blob/main/src/hooks/useCardano.ts#L133) function of the [cardano-connect-with-wallet](https://github.com/cardano-foundation/cardano-connect-with-wallet) library to get a valid key and signature.

The plain message and/or the readable address can be provided for testing optionally. [Checkout these examples](index.test.ts).

```ts
verifySignature: (
  signature: string,
  key: string,
  message?: string,
  address?: string
) => boolean;
```
