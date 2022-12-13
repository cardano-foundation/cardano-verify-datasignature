import { Bip32PublicKey } from '@stricahq/bip32ed25519';
import { getPublicKeyFromCoseKey, CoseSign1 } from '@stricahq/cip08';
import { Decoder } from '@stricahq/cbors';
import { BaseAddress, RewardAddress } from '@stricahq/typhonjs/dist/address';
import { utils } from '@stricahq/typhonjs';

const Network = {
  MAINNET: 1,
  TESTNET: 0,
};

/**
 * This method can be used to verify a cip30 data signature.
 *
 * https://cips.cardano.org/cips/cip30/#datasignature
 * type DataSignature = {
 *   signature: cbor\<COSE_Sign1>,
 *   key: cbor\<COSE_Key>,
 * };
 *
 * Optional:
 *
 * Furthermore a plain text message can be provided to check if both
 * the plain text and the signed message are equal
 *
 * Also a payment (addr1/addr_test1) or stake address (stake1/stake_test1) can be provided
 * to verify that this readable address belongs to the signature
 *
 * @param {string} signature - A COSE_Sign1 cbor string.
 * @param {string} key - A COSE_Key cbor string
 * @param {string} message - An optional plain text message
 * @param {string} address - An optional address starting with (addr1/addr_test1/stake1/stake_test1)
 * @returns {string} boolean - True if the verification was successful otherwise false
 */
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
    let providedRewardAddress = address;
    let network = Network.MAINNET;

    if (address.startsWith('addr1')) {
      const paymentAddress = utils.getAddressFromBech32(address) as BaseAddress;

      providedRewardAddress = new RewardAddress(
        Network.MAINNET,
        paymentAddress.stakeCredential
      ).getBech32();
    } else if (address.startsWith('stake_test1')) {
      network = Network.TESTNET;
    } else if (address.startsWith('addr_test1')) {
      network = Network.TESTNET;
      const paymentAddress = utils.getAddressFromBech32(address) as BaseAddress;
      providedRewardAddress = new RewardAddress(
        Network.MAINNET,
        paymentAddress.stakeCredential
      ).getBech32();
    }

    const coseSign1PublicKey = new Bip32PublicKey(publicKeyBuffer);
    const credential = {
      hash: coseSign1PublicKey.toPublicKey().hash().toString('hex'),
      type: 0,
    };

    const rewardAddress = new RewardAddress(network, credential);
    if (rewardAddress.getBech32() !== providedRewardAddress) {
      return false;
    }
  }

  return coseSign1.verifySignature({
    publicKeyBuffer: publicKeyBuffer,
  });
};

export default verifySignature;
