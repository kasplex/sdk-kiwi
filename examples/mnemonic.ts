import { Mnemonic } from "../src/index";

// Example 1: Generate a 12-word mnemonic
const mnemonic12 = Mnemonic.random(12);
console.log("Generated 12-word mnemonic:", mnemonic12);

// Example 2: Generate a 24-word mnemonic
const mnemonic24 = Mnemonic.random(24);
console.log("Generated 24-word mnemonic:", mnemonic24);

// Example 3: Validate a mnemonic
const isValid = Mnemonic.validate(mnemonic12);
console.log("Is the mnemonic valid?", isValid);
