# Cardano Verify Datasignature

<p align="left">

<img alt="Release" src="https://github.com/cardano-foundation/cardano-verify-datasignature/actions/workflows/release.yml/badge.svg?branch=main" />
<img alt="semantic-release: angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release" />

</p>

A lightweight typescript library to verify a cip30 datasignature.

## 🚀 Getting Started

```zsh
npm i @cardano-foundation/cardano-verify-datasignature
```

## 🧐 Verification

You need a key and a signature from a [cip30 datasignature](https://cips.cardano.org/cips/cip30/#apisigndataaddraddresspayloadbytespromisedatasignature).

### How to get a cip30 datasignature?

There are multiple ways to create a cip30 data signature:

1. Make sure you have a cip30 compatible wallet installed (Nami, NuFi, Typhon Wallet, Flint, Gerowallet, Yoroi, ...).

2. Option A: Open your browser console and copy&paste this function:

```js
const signMessage = async (message, walletname) => {
  const api = await window.cardano[walletname].enable();
  const hexAddresses = await api.getRewardAddresses();
  const hexAddress = hexAddresses[0];
  let hexMessage = '';

  for (var i = 0, l = message.length; i < l; i++) {
    hexMessage += message.charCodeAt(i).toString(16);
  }

  try {
    const { signature, key } = await api.signData(hexAddress, hexMessage);
    console.log(signature, key);
  } catch (error) {
    console.warn(error);
  }
};
```

Usage example:

```js
signMessage('Hello World', 'yoroi').then((dataSignature) =>
  console.log(dataSignature)
);
```

3. Option B: Use the [signMessage](https://github.com/cardano-foundation/cardano-connect-with-wallet/blob/main/src/hooks/useCardano.ts#L133) function of the [cardano-connect-with-wallet](https://github.com/cardano-foundation/cardano-connect-with-wallet) library to get a valid key and signature.

4. Option C: If you want to use the cli to sign or verify data please checkout the [cardano-signer](https://github.com/gitmachtl/cardano-signer) by [gitmachtl](https://github.com/gitmachtl).

### What does it mean "to verify a signature"?

This function uses the public key (COSE_KEY) and checks if its corresponding private key has been used to sign the payload (data/message) within the signature (COSE_Sign1).

Furthermore an optional plain text message can be provided to check if both the plain text and the signed message are equal.

Another optional argument is a readable (bech32) address starting with (addr1/addr_test1/stake1/stake_test1) to test if this address belongs to the key that was used to sign the message.

```ts
const verifyDataSignature = require('@cardano-foundation/cardano-verify-datasignature');

const key =
  'a4010103272006215820b89526fd6bf4ba737c55ea90670d16a27f8de6cc1982349b3b676705a2f420c6';
const signature =
  '84582aa201276761646472657373581de118987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f458264175677573746120416461204b696e672c20436f756e74657373206f66204c6f76656c61636558401712458b19f606b322982f6290c78529a235b56c0f1cec4f24b12a8660b40cd37f4c5440a465754089c462ed4b0d613bffaee3d1833516569fda4852f42a4a0f';
const message = 'Augusta Ada King, Countess of Lovelace';
const address = 'stake1uyvfslqkzgrf6syq5r4jg7pqewv8l65phh024lw5r7vk9qgznhyty';

console.log(verifyDataSignature(signature, key)); // true
console.log(verifyDataSignature(signature, key, message)); // true
console.log(verifyDataSignature(signature, key, message, address)); // true
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
