import {describe, expect, it} from 'vitest';
import {Wallet} from '../src/address/wallet';
import { NetworkType} from "../src/wasm/kaspa";

describe('wallet  function tests', () => {

    it('Wallet fromMnemonic without password', () => {
        const mnemonicStr = "struggle glare pigeon shine fire cargo offer venture luxury jeans clean initial";
        let wallet = Wallet.fromMnemonic(mnemonicStr)
        const address = wallet.toAddress(NetworkType.Testnet);
        expect(address.toString()).toBe("kaspatest:qpm8ujdydnfhgc8refm63s8m7ajleqal0pzxg4gmsz478hwsnw7c5909ndzjw");
    });

    it('Wallet fromMnemonic with password', () => {
        const mnemonicStr = "struggle glare pigeon shine fire cargo offer venture luxury jeans clean initial";
        let wallet = Wallet.fromMnemonic(mnemonicStr, "123456")
        const address = wallet.toAddress(NetworkType.Testnet);
        expect(address.toString()).toBe("kaspatest:qpt83kqsw23d2y4mfegzpk0ma47jg7uj6ftk5h56n7u9harq9adl5m3rv8dc3");
    });

    it('Wallet fromMnemonic with create an new derive path wallet', () => {
        const mnemonicStr = "struggle glare pigeon shine fire cargo offer venture luxury jeans clean initial";
        let wallet1 = Wallet.fromMnemonic(mnemonicStr, "123456").newWallet()
        const address1 = wallet1.toAddress(NetworkType.Testnet);
        expect(address1.toString()).toBe("kaspatest:qrdywt2k8cud7rfv49x4hhxft3vhwwzyucn8c5cs9ksunj0uc5cyu20gtygfx");

        let wallet2 = Wallet.fromMnemonic(mnemonicStr, "123456").newWallet(1)
        const address2 = wallet2.toAddress(NetworkType.Testnet);
        expect(address2.toString()).toBe("kaspatest:qrdywt2k8cud7rfv49x4hhxft3vhwwzyucn8c5cs9ksunj0uc5cyu20gtygfx");
    });

    it('Wallet fromMnemonic with create an new derive path wallet', () => {
        const mnemonicStr = "struggle glare pigeon shine fire cargo offer venture luxury jeans clean initial";
        let wallet1 = Wallet.fromMnemonic(mnemonicStr, "123456").newWallet()
        const address1 = wallet1.toAddress(NetworkType.Testnet);
        expect(address1.toString()).toBe("kaspatest:qrdywt2k8cud7rfv49x4hhxft3vhwwzyucn8c5cs9ksunj0uc5cyu20gtygfx");

        let wallet2 = Wallet.fromMnemonic(mnemonicStr, "123456").newWallet(1)
        // console.log("s", wallet2.toPrivateKey())
        const address2 = wallet2.toAddress(NetworkType.Testnet);
        expect(address2.toString()).toBe("kaspatest:qrdywt2k8cud7rfv49x4hhxft3vhwwzyucn8c5cs9ksunj0uc5cyu20gtygfx");
    });

    it('Wallet fromPrivateKey', () => {
        const privateKey = "f7551d5a10209069bd484b480471f70f293e9c77d4e844efc519c9b17b03c4e7";
        let wallet = Wallet.fromPrivateKey(privateKey)
        const address = wallet.toAddress(NetworkType.Testnet);
        expect(address.toString()).toBe("kaspatest:qrdywt2k8cud7rfv49x4hhxft3vhwwzyucn8c5cs9ksunj0uc5cyu20gtygfx");
    });

    it('Wallet fromPrivateKey1', () => {
        const privateKey = "eb2570115b126c59b76d797d5cc5b21c92af98344f4a5f0c04df159205d10377";
        let wallet = Wallet.fromPrivateKey(privateKey)
        const address = wallet.toAddress(NetworkType.Testnet);
        console.log("test address", address)
        // expect(address.toString()).toBe("kaspatest:qrdywt2k8cud7rfv49x4hhxft3vhwwzyucn8c5cs9ksunj0uc5cyu20gtygfx");
    });




    it('Wallet fromPrivateKey', () => {
        const privateKey = "f7551d5a10209069bd484b480471f70f293e9c77d4e844efc519c9b17b03c4e7";
        let wallet = Wallet.fromPrivateKey(privateKey)

        const pkey = wallet.toPrivateKey();
        expect(pkey).toBe(privateKey)

        const publicKey = wallet.toPublicKey();
        expect(publicKey.toString()).toBe("02da472d563e38df0d2ca94d5bdcc95c59773844e6267c53102da1c9c9fcc5304e");

        const xpublicKey = wallet.toPublicKey().toXOnlyPublicKey();
        expect(xpublicKey.toString()).toBe("da472d563e38df0d2ca94d5bdcc95c59773844e6267c53102da1c9c9fcc5304e");
    });

    it('Wallet sign message', () => {
        const privateKey = "f7551d5a10209069bd484b480471f70f293e9c77d4e844efc519c9b17b03c4e7";
        let wallet = Wallet.fromPrivateKey(privateKey)
        let nonce = "login"
        const signMsg = wallet.signMessage(nonce);
        const isSign = wallet.verifyMessage(nonce, signMsg);
        expect(isSign).toBe(true);
    });

    it('test validate address', async () => {
        expect(Wallet.validate("kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3")).toBe(true);
        expect(Wallet.validate("kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy4")).toBe(false);
    })
});
