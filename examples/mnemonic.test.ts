import { describe, expect, it } from 'vitest';
import { Mnemonic } from '@kasplex/kiwi';

describe('mnemonic function tests', () => {

    it('should generate a mnemonic string with 12 words', () => {
        const mnemonicStr = Mnemonic.random(12);
        console.log(mnemonicStr)
        const words = mnemonicStr.split(' ');
        expect(words.length).toBe(12);
    });

    it('should generate a mnemonic string with 24 words', () => {
        const mnemonicStr = Mnemonic.random(24);
        const words = mnemonicStr.split(' ');
        expect(words.length).toBe(24);
    });

    it('validate a mnemonic string is true', () => {
        const mn = "deal hood now figure talk vote female behind absurd symptom fiber film";
        const res = Mnemonic.validate(mn);
        expect(res).toBe(true);
    });

    it('validate a mnemonic string is false', () => {
        const mn_with_error_words = "deal hood now figure talk vote female behind absurd symptom fiber filmsss";
        let res = Mnemonic.validate(mn_with_error_words);
        expect(res).toBe(false);

        const mn_with_11_words = "deal hood now figure talk vote female behind absurd symptom fiber";
        let res2 = Mnemonic.validate(mn_with_11_words);
        expect(res2).toBe(false);
    });

});

