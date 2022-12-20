import { Bip32PublicKey } from '@stricahq/bip32ed25519';
import { getPublicKeyFromCoseKey, CoseSign1 } from '@stricahq/cip08';
import { Decoder } from '@stricahq/cbors';
import {
  BaseAddress,
  EnterpriseAddress,
  RewardAddress,
} from '@stricahq/typhonjs/dist/address';
import { utils } from '@stricahq/typhonjs';
import { blake2bHex } from 'blakejs';

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

    const unprotectedMap: Map<any, any> = decoded?.value[1];
    const isHashed =
      unprotectedMap && unprotectedMap.get('hashed')
        ? unprotectedMap.get('hashed')
        : false;

    if (isHashed && !/^[0-9a-fA-F]+$/.test(message)) {
      message = blake2bHex(message, undefined, 28); // 28 * 8 bit = 224 bit ~> blake2b224
    }

    if (isHashed && payload && payload.toString('hex') !== message) {
      return false;
    } else if (!isHashed && payload && payload.toString('utf8') !== message) {
      return false;
    }
  }

  if (address) {
    let providedAddress = address;
    let network = Network.MAINNET;
    const paymentAddress = utils.getAddressFromBech32(address) as BaseAddress;
    const coseSign1PublicKey = new Bip32PublicKey(publicKeyBuffer);

    const credential = {
      hash: coseSign1PublicKey.toPublicKey().hash().toString('hex'),
      type: 0,
    };

    if (address.startsWith('addr')) {
      if (address.startsWith('addr_test1')) {
        network = Network.TESTNET;
      }

      if (paymentAddress.stakeCredential) {
        const paymentAddressBech32 = new BaseAddress(
          network,
          credential,
          paymentAddress.stakeCredential
        ).getBech32();

        if (address !== paymentAddressBech32) {
          // Test whether the key is a stake key to which this payment key belongs
          const extractedRewardAddress = new RewardAddress(
            network,
            paymentAddress.stakeCredential
          ).getBech32();

          const rewardAddress = new RewardAddress(
            network,
            credential
          ).getBech32();

          if (rewardAddress !== extractedRewardAddress) {
            return false;
          }
        }
      } else {
        // An EnterpriseAddress does not have a stake credential
        const enterpriseAddress = new EnterpriseAddress(
          network,
          credential
        ).getBech32();
        if (enterpriseAddress !== providedAddress) {
          return false;
        }
      }
    } else if (address.startsWith('stake')) {
      if (address.startsWith('stake_test1')) {
        network = Network.TESTNET;
      }

      const rewardAddress = new RewardAddress(network, credential).getBech32();

      if (rewardAddress !== providedAddress) {
        return false;
      }
    } else {
      return false;
    }
  }

  return coseSign1.verifySignature({
    publicKeyBuffer: publicKeyBuffer,
  });
};

export default verifySignature;
