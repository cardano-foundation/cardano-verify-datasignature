import verifySignature from './index';
import { blake2bHex } from 'blakejs';

describe('testing signature verification', () => {
  // https://cips.cardano.org/cips/cip30/#datasignature
  test('signature verification using cip30 datasignature', () => {
    const key =
      'a4010103272006215820b89526fd6bf4ba737c55ea90670d16a27f8de6cc1982349b3b676705a2f420c6';
    const signature =
      '84582aa201276761646472657373581de118987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f458264175677573746120416461204b696e672c20436f756e74657373206f66204c6f76656c61636558401712458b19f606b322982f6290c78529a235b56c0f1cec4f24b12a8660b40cd37f4c5440a465754089c462ed4b0d613bffaee3d1833516569fda4852f42a4a0f';

    expect(verifySignature(signature, key)).toBe(true);
  });

  test('signature verification using cip30 datasignature. Additionally check the raw message within the signature', () => {
    const key =
      'a4010103272006215820b89526fd6bf4ba737c55ea90670d16a27f8de6cc1982349b3b676705a2f420c6';
    const signature =
      '84582aa201276761646472657373581de118987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f458264175677573746120416461204b696e672c20436f756e74657373206f66204c6f76656c61636558401712458b19f606b322982f6290c78529a235b56c0f1cec4f24b12a8660b40cd37f4c5440a465754089c462ed4b0d613bffaee3d1833516569fda4852f42a4a0f';
    const message = 'Augusta Ada King, Countess of Lovelace';

    expect(verifySignature(signature, key, message)).toBe(true);
  });

  test('signature verification using cip30 datasignature with message check and readable address check', () => {
    const address =
      'stake1uyvfslqkzgrf6syq5r4jg7pqewv8l65phh024lw5r7vk9qgznhyty';
    const key =
      'a4010103272006215820b89526fd6bf4ba737c55ea90670d16a27f8de6cc1982349b3b676705a2f420c6';
    const signature =
      '84582aa201276761646472657373581de118987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f458264175677573746120416461204b696e672c20436f756e74657373206f66204c6f76656c61636558401712458b19f606b322982f6290c78529a235b56c0f1cec4f24b12a8660b40cd37f4c5440a465754089c462ed4b0d613bffaee3d1833516569fda4852f42a4a0f';
    const message = '!Augusta Ada King, Countess of Lovelace!';

    expect(verifySignature(signature, key, message, address)).toBe(false);
  });

  test('signature verification using cip30 datasignature with message check should fail', () => {
    const key =
      'a4010103272006215820b89526fd6bf4ba737c55ea90670d16a27f8de6cc1982349b3b676705a2f420c6';
    const signature =
      '84582aa201276761646472657373581de118987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f458264175677573746120416461204b696e672c20436f756e74657373206f66204c6f76656c61636558401712458b19f606b322982f6290c78529a235b56c0f1cec4f24b12a8660b40cd37f4c5440a465754089c462ed4b0d613bffaee3d1833516569fda4852f42a4a0f';
    const message = '!Augusta Ada King, Countess of Lovelace!';

    expect(verifySignature(signature, key, message)).toBe(false);
  });

  test('signature verification using cip30 datasignature with address check should fail', () => {
    const address =
      'stake_test1uzmggtulkyt5df9rpmqvh9acuc4etr5vntehx65nq2uz2mg8293u0';
    const key =
      'a4010103272006215820b89526fd6bf4ba737c55ea90670d16a27f8de6cc1982349b3b676705a2f420c6';
    const signature =
      '84582aa201276761646472657373581de118987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f458264175677573746120416461204b696e672c20436f756e74657373206f66204c6f76656c61636558401712458b19f606b322982f6290c78529a235b56c0f1cec4f24b12a8660b40cd37f4c5440a465754089c462ed4b0d613bffaee3d1833516569fda4852f42a4a0f';

    expect(verifySignature(signature, key, undefined, address)).toBe(false);
  });

  test('signature verification with payment address', () => {
    const address =
      'addr1qxtu4w2rq2mdguw4fkms2ge4m070nq8cmlyjfhghwlh8sjscnp7pvysxn4qgpg8ty3uzpjuc0l4gr0w74t7ag8uev2qseuyw6u';
    const key =
      'a4010103272006215820b89526fd6bf4ba737c55ea90670d16a27f8de6cc1982349b3b676705a2f420c6';
    const signature =
      '84582aa201276761646472657373581de118987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f458264175677573746120416461204b696e672c20436f756e74657373206f66204c6f76656c61636558401712458b19f606b322982f6290c78529a235b56c0f1cec4f24b12a8660b40cd37f4c5440a465754089c462ed4b0d613bffaee3d1833516569fda4852f42a4a0f';

    expect(verifySignature(signature, key, undefined, address)).toBe(true);
  });

  test('hashed payload with stake address that should be valid and return true', () => {
    const signature =
      '84582aa201276761646472657373581de0c13582aec9a44fcc6d984be003c5058c660e1d2ff1370fd8b49ba73fa166686173686564f5581c40843181253eb1ff2258ab39c3463ec0edf5e713b73c5482c0ca798f5840a4cdec07ba8c1184aa74d1c3516fc6602a35d2db847510cf98c102653c15c7664f136314f920150a081870aef77ed49780ca58873bd5d62e744b968a89435906';
    const key =
      'a40101032720062158209be513df12b3fabe7c1b8c3f9fab0968eb2168d5689bf981c2f7c35b11718b27';

    expect(verifySignature(signature, key)).toBe(true);
  });

  test('signature signed with payment key should be valid', () => {
    const signature =
      '845846a20127676164647265737358390197cab94302b6d471d54db7052335dbfcf980f8dfc924dd1777ee784a18987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f44b48656c6c6f20576f726c645840b65cb33e107a692605a479811a8405e44eeac5217c6ef92b79c221c2309305ec2db927fb75a7d197602e1eb2e663dae227aa7c0510b6484f5591b2b4bd47b70d';
    const key =
      'a4010103272006215820472be3f30b51ead6d020e0d370774861e242ca23eaca2f4eff4ddb8eaa3abefd';
    expect(verifySignature(signature, key)).toBe(true);
  });

  test('signature signed with payment key and a bech32 key for the verification should be valid', () => {
    const signature =
      '845846a20127676164647265737358390197cab94302b6d471d54db7052335dbfcf980f8dfc924dd1777ee784a18987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f44b68656c6c6f20776f726c645840d1a116c02d6ea035928f85ae59b7181f2b1cc31e673e1d890a5f92d6d3def81d667664ac091b42bd746dcd60b1a735b6c0ecceaa6672434ecf719b380db87808';
    const key =
      'a4010103272006215820472be3f30b51ead6d020e0d370774861e242ca23eaca2f4eff4ddb8eaa3abefd';
    const address =
      'addr1qxtu4w2rq2mdguw4fkms2ge4m070nq8cmlyjfhghwlh8sjscnp7pvysxn4qgpg8ty3uzpjuc0l4gr0w74t7ag8uev2qseuyw6u';
    expect(verifySignature(signature, key, undefined, address)).toBe(true);
  });

  test('signature signed with payment key and a wrong bech32 key for the verification should be invalid', () => {
    const signature =
      '845846a20127676164647265737358390197cab94302b6d471d54db7052335dbfcf980f8dfc924dd1777ee784a18987c1612069d4080a0eb247820cb987fea81bddeaafdd41f996281a166686173686564f44b48656c6c6f20576f726c645840b65cb33e107a692605a479811a8405e44eeac5217c6ef92b79c221c2309305ec2db927fb75a7d197602e1eb2e663dae227aa7c0510b6484f5591b2b4bd47b70d';
    const key =
      'a4010103272006215820472be3f30b51ead6d020e0d370774861e242ca23eaca2f4eff4ddb8eaa3abefd';
    const address =
      'addr1qykeu08ymqftykmddg8fuc2d78huz8aa48afk00twn7ye65zq5rvkr89ftn4tvj39dk0xxzk6un9apujewr2lj2wppeqxsygwc';
    expect(verifySignature(signature, key, address)).toBe(false);
  });

  test('check signature with null payload should be false', () => {
    const signature =
      '84582aa201276761646472657373581de0c13582aec9a44fcc6d984be003c5058c660e1d2ff1370fd8b49ba73fa166686173686564f4f658400a0dd23e867292a4c2eb692f63016e3f61294686f672065fcc377f665cff6b25c430619060b536073cfd2355ab6c6bcec9d7ecbfb588f7b0aa5967f1b8559300';
    const key =
      'a40101032720062158209be513df12b3fabe7c1b8c3f9fab0968eb2168d5689bf981c2f7c35b11718b27';
    expect(verifySignature(signature, key)).toBe(false);
  });

  test('check signature with correct plain text message but empty payload should be true', () => {
    const signature =
      '84582aa201276761646472657373581de0c13582aec9a44fcc6d984be003c5058c660e1d2ff1370fd8b49ba73fa166686173686564f4f658400a0dd23e867292a4c2eb692f63016e3f61294686f672065fcc377f665cff6b25c430619060b536073cfd2355ab6c6bcec9d7ecbfb588f7b0aa5967f1b8559300';
    const key =
      'a40101032720062158209be513df12b3fabe7c1b8c3f9fab0968eb2168d5689bf981c2f7c35b11718b27';
    const message = 'Hello world';
    expect(verifySignature(signature, key, message)).toBe(true);
  });

  test('hashed payload with plain text message that should be valid and return true', () => {
    const signature =
      '84582aa201276761646472657373581de0c13582aec9a44fcc6d984be003c5058c660e1d2ff1370fd8b49ba73fa166686173686564f4f658400a0dd23e867292a4c2eb692f63016e3f61294686f672065fcc377f665cff6b25c430619060b536073cfd2355ab6c6bcec9d7ecbfb588f7b0aa5967f1b8559300';
    const key =
      'a40101032720062158209be513df12b3fabe7c1b8c3f9fab0968eb2168d5689bf981c2f7c35b11718b27';
    const message = 'Hello world';

    expect(verifySignature(signature, key, message)).toBe(true);
  });

  test('hashed payload with hashed text message that should be valid and return true', () => {
    const signature =
      '84582aa201276761646472657373581de0c13582aec9a44fcc6d984be003c5058c660e1d2ff1370fd8b49ba73fa166686173686564f5581c40843181253eb1ff2258ab39c3463ec0edf5e713b73c5482c0ca798f5840a4cdec07ba8c1184aa74d1c3516fc6602a35d2db847510cf98c102653c15c7664f136314f920150a081870aef77ed49780ca58873bd5d62e744b968a89435906';
    const key =
      'a40101032720062158209be513df12b3fabe7c1b8c3f9fab0968eb2168d5689bf981c2f7c35b11718b27';
    const message = blake2bHex('Hello world', undefined, 28); // 28 * 8 bit = 224 bit

    expect(verifySignature(signature, key, message)).toBe(true);
  });

  test('test verification with provided enterprise address', () => {
    const signature =
      '84582aa201276761646472657373581d617863b5c43bdf0a06608abc82f0573a549714ff69166074dcdde393d8a166686173686564f44b48656c6c6f20776f726c645840fc58155f0cee05bc00e7299af1df1f159ac82a46a055786b259657934eff346eec81349d4678ceabc79f213c66a2bdbfd4ea5d9ebdc630bee5ac9cce75cfc001';
    const key =
      'a4010103272006215820755b017578b701dc9ddd4eaee67015b4ca8baf66293b7b1d204df426c0ceccb9';
    const message = 'Hello world';

    expect(
      verifySignature(
        signature,
        key,
        message,
        'addr1v9ux8dwy800s5pnq327g9uzh8f2fw98ldytxqaxumh3e8kqumfr6d'
      )
    ).toBe(true);
  });
});
