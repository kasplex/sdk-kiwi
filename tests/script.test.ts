import { describe, it, expect } from 'vitest';
import { Script } from '../src/script/script';
import { createKrc20Data, networkToString } from '../src/utils/utils';
import { OP } from '../src/utils/enum';
import { NetworkType } from '../src/wasm/kaspa/kaspa';

// Test data
const toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf';
const publicKeyStr = `02cd78d0901aaf8bf50542fbba33f66077339437f1d7a98188ad49289927187285`
const publicKeys = [
    '02f5c16567f9eaa48a31b4bf5959ebd2fdbac6671998996a5b8165213e6f38e79e',
    '024af3fac87b66e378923aea14e16f87fe83dc6e7c54f108f4ccd95e63f049ea14',
    '02bec0bb5a3c896ed719402b3ea05bf3f8ef8705928d2239df12ee643bdedc40e6',
];

describe('Script', () => {

    it('should create a script with krc20Script', () => {
        const krc20Data = createKrc20Data({
            p: 'krc-20',
            op: OP.Mint,
            tick: 'SNOWDN',
        });
        const getScript = Script.krc20Script(publicKeyStr, krc20Data);
        console.log('krc20Script:', getScript.createPayToScriptHashScript().toString());
        expect(getScript).toBeDefined();
    });

    it('should create a script with multiSignAddress',  () => {
        const address = Script.multiSignAddress(2, publicKeys, NetworkType.Testnet, false);
        console.log('multiSignAddress:', address.toString());
        expect(address).toBeDefined();
    });

    it('should create a script with lockTimeScript',  () => {
        const krc20Data = createKrc20Data({
            p: 'krc-20',
            op: OP.Transfer,
            tick: 'SNOWDN',
            to: toAddress,
            amt: '20000000',
        });
        const getScript = Script.lockTimeScript(publicKeyStr, krc20Data, 1752140060000n);
        console.log('lockTimeScript:', getScript.createPayToScriptHashScript());
        expect(getScript).toBeDefined();
    });

    it('should create a script with redeemScript', () => {
        const krc20Data = createKrc20Data({
            p: 'krc-20',
            op: OP.Mint,
            tick: 'TOGOO',
        });
        const getScript = Script.multiSignTxKrc20Script(publicKeys, krc20Data, 2);
        console.log('redeemScript:', getScript.createPayToScriptHashScript());
        expect(getScript).toBeDefined();
    });

    it('should create a script with redeemMultiSignAddress', () => {
        const getScript = Script.redeemMultiSignAddress(2, publicKeys, NetworkType.Testnet);
        console.log('redeemMultiSignAddress:', getScript);
        expect(getScript).toBeDefined();
    });
});