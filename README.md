# Cardano Signature Verification

A lightweight typescript library to verify a cip30 datasignature

## Getting Started

```zsh
npm i @cardano-foundation/cardano-signature-verification
```

## Verification

You need a key and a signature from a [cip30 datasignature](https://cips.cardano.org/cips/cip30/#apisigndataaddraddresspayloadbytespromisedatasignature). Use e.g. `window.cardano."wallet_name".enable().then(api => api.signData(...))` or the [signMessage](https://github.com/cardano-foundation/cardano-connect-with-wallet/blob/main/src/hooks/useCardano.ts#L133) function of the [cardano-connect-with-wallet](https://github.com/cardano-foundation/cardano-connect-with-wallet) library to get a valid key and signature.

The plain message and/or the readable address can be provided for testing optionally. [Checkout this examples](index.test.ts).

```ts
verifySignature: (
  signature: string,
  key: string,
  message?: string,
  address?: string
) => boolean;
```
