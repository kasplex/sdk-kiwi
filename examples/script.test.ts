import { describe, expect, it } from 'vitest';
import { Script, Utils, Enum, Wasm, Kiwi } from '@kasplex/kiwi';

// Test data
const toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf';
const publicKeyStr = `02cd78d0901aaf8bf50542fbba33f66077339437f1d7a98188ad49289927187285`
const publicKeys = [
    '',
    '',
    '',
];

describe('Script', () => {

    Kiwi.setNetwork(Wasm.NetworkType.Testnet);

    it('should create a script with krc20Script', () => {
        const krc20Data = Utils.createKrc20Data({
            p: 'krc-20',
            op: Enum.OP.Mint,
            tick: 'SNOWDN',
        });
        const getScript = Script.krc20Script(publicKeyStr, krc20Data);
        console.log('krc20Script:', getScript.createPayToScriptHashScript().toString());
        expect(getScript).toBeDefined();
    });

    it('should create a script with multiSignAddress',  () => {
        const address = Script.multiSignAddress(2, publicKeys, Wasm.NetworkType.Testnet, false);
        console.log('multiSignAddress:', address.toString());
        expect(address).toBeDefined();
    });

    it('should create a script with lockTimeScript',  () => {
        const krc20Data = Utils.createKrc20Data({
            p: 'krc-20',
            op: Enum.OP.Transfer,
            tick: 'SNOWDN',
            to: toAddress,
            amt: '20000000',
        });
        const getScript = Script.lockTimeScript(publicKeyStr, krc20Data, 1752140060000n);
        console.log('lockTimeScript:', getScript.createPayToScriptHashScript());
        expect(getScript).toBeDefined();
    });

    it('should create a script with redeemScript', () => {
        const krc20Data = Utils.createKrc20Data({
            p: 'krc-20',
            op: Enum.OP.Mint,
            tick: 'TOGOO',
        });
        const getScript = Script.multiSignTxKrc20Script(publicKeys, krc20Data, 2);
        console.log('redeemScript:', getScript.createPayToScriptHashScript());
        expect(getScript).toBeDefined();
    });

    it('should create a script with redeemMultiSignAddress', () => {
        const getScript = Script.redeemMultiSignAddress(2, publicKeys, false);
        console.log('redeemMultiSignAddress:', getScript);
        expect(getScript).toBeDefined();
    });
});