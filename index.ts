import { Bip32PublicKey } from '@stricahq/bip32ed25519';
import { getPublicKeyFromCoseKey, CoseSign1 } from '@stricahq/cip08';
import { Decoder } from '@stricahq/cbors';
import { RewardAddress } from '@stricahq/typhonjs/dist/address';

const verifySignature = (
  signature: string,
  key: string,
  message?: string,
  address?: string
): boolean => {
  const publicKeyBuffer = getPublicKeyFromCoseKey(key);
  const coseSign1 = CoseSign1.fromCbor(signature);

  if (message) {
    const decoded = Decoder.decode(Buffer.from(signature, 'hex'));
    const payload: Buffer = decoded.value[2];
    if (payload.toString('utf8') !== message) {
      return false;
    }
  }

  if (address) {
    const coseSign1PublicKey = new Bip32PublicKey(publicKeyBuffer);
    const credential = {
      hash: coseSign1PublicKey.toPublicKey().hash().toString('hex'),
      type: 0,
    };

    const rewardAddress = new RewardAddress(1, credential);
    if (rewardAddress.getBech32() !== address) {
      return false;
    }
  }

  return coseSign1.verifySignature({
    publicKeyBuffer: publicKeyBuffer,
  });
};

export default verifySignature;
