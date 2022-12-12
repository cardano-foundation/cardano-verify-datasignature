# Cardano Verify Datasignature

<p align="left">

<img alt="Release" src="https://github.com/cardano-foundation/cardano-verify-datasignature/actions/workflows/release.yml/badge.svg?branch=main" />
<img alt="semantic-release: angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release" />

</p>

A lightweight typescript library to verify a cip30 datasignature.

## Getting Started

```zsh
npm i @cardano-foundation/cardano-verify-datasignature
```

## Verification

You need a key and a signature from a [cip30 datasignature](https://cips.cardano.org/cips/cip30/#apisigndataaddraddresspayloadbytespromisedatasignature). Use e.g. `window.cardano."wallet_name".enable().then(api => api.signData(...))` or the [signMessage](https://github.com/cardano-foundation/cardano-connect-with-wallet/blob/main/src/hooks/useCardano.ts#L133) function of the [cardano-connect-with-wallet](https://github.com/cardano-foundation/cardano-connect-with-wallet) library to get a valid key and signature.

The plain message and/or the readable address can be provided optionally.

```js
const verifyDataSignature = require('@cardano-foundation/cardano-verify-datasignature');

const key =
  'a4010103272006215820b89526fd6bf4ba737c55ea90670d16a27f8de6cc1982349b3b676705a2f420c6';
const signature =
  '84582aa201276761646472657373581de118987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f458264175677573746120416461204b696e672c20436f756e74657373206f66204c6f76656c61636558401712458b19f606b322982f6290c78529a235b56c0f1cec4f24b12a8660b40cd37f4c5440a465754089c462ed4b0d613bffaee3d1833516569fda4852f42a4a0f';
const message = 'Augusta Ada King, Countess of Lovelace';
const stakeAddress =
  'stake1uyvfslqkzgrf6syq5r4jg7pqewv8l65phh024lw5r7vk9qgznhyty';

console.log(verifyDataSignature(signature, key)); // true
console.log(verifyDataSignature(signature, key, message)); // true
console.log(verifyDataSignature(signature, key, message, stakeAddress)); // true
console.log(
  verifyDataSignature(
    signature,
    key,
    message,
    'stake1_test1hweafkafrwf9ets85rs9gtk9qgzegwtg'
  )
); // false
console.log(
  verifyDataSignature(signature, key, 'Augusta Ada King, Countess of Lovelace!')
); // false
```
