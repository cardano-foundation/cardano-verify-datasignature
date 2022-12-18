import verifySignature from './index';

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
      'stake_test1uyvfslqkzgrf6syq5r4jg7pqewv8l65phh024lw5r7vk9qgznhyty';
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
});
