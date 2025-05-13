import { Krc20Data } from "./types/interface";
import { Address } from './utils/address';
import { OP } from "./utils/enum";

class ValidateKrc20Data {
    static #data: Krc20Data;

    /**
     * Validates the deployment operation data.
     * @returns The current instance for chaining.
     */
    private static validateDeploy() {
        return this.validateTick()
            .validateAddress()
            .validateAmt()
            .validateMax()
            .validateLim()
            .validateDec()
            .validatePre();
    }

    /**
     * Validates the mint operation data.
     * @returns The current instance for chaining.
     */
    private static validateMint() {
        return this.validateTick().validateAddress();
    }

    /**
     * Validates the transfer operation data.
     * @returns The current instance for chaining.
     */
    private static validateTransfer() {
        return this.validateTickOrCa().validateAddress().validateAmt();
    }

    /**
     * Validates the list operation data.
     * @returns The current instance for chaining.
     */
    private static validateList() {
        return this.validateTick().validateAddress().validateAmt();
    }

    /**
     * Validates the send operation data.
     * @returns The current instance for chaining.
     */
    private static validateSend() {
        return this.validateTick().validateAddress();
    }

    /**
     * Validates the issue operation data.
     * @returns The current instance for chaining.
     */
    private static validateIssue() {
        return this.validateAmt().validateAddress();
    }

    /**
     * Validates the burn operation data.
     * @returns The current instance for chaining.
     */
    private static validateBurn() {
        return this.validateAmt();
    }

    /**
     * Validates the blacklist operation data.
     * @returns The current instance for chaining.
     */
    private static validateBlacklist() {
        return this.validateCa().validateMod().validateAddress();
    }

    /**
     * Validates the chown operation data.
     * @returns The current instance for chaining.
     */
    private static validateChown() {
        return this.validateCa().validateTo();
    }

    /**
     * Validates the ticker field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the ticker is invalid.
     */
    private static validateTick() {
        const { tick, name, mod } = this.#data;
        if (!mod && (!tick || tick.length < 4 || tick.length > 6)) {
            throw new Error(`Invalid input: ticker must be between 4 and 6 characters`);
        }
        if (mod && (!name || name.length < 4 || name.length > 6)) {
            throw new Error(`Invalid input: name must be between 4 and 6 characters`);
        }
        return this;
    }

    /**
     * Validates the ticker field in the data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     * @throws Error if the ticker is invalid.
     */
    private static validateTickOrCa() {
        const { tick, ca, mod } = this.#data;
        if (tick) {
            if (tick.length < 4 || tick.length > 6) {
                throw new Error(`Invalid input: ticker must be between 4 and 6 characters`);
            }
        } else if (ca) {
            if (ca.length < 60 || ca.length > 80) {
                throw new Error(`Invalid input: ca invalid`);
            }
        } else {
            throw new Error(`Invalid input: tick or ca not find`);
        }
        return this;
    }

    /**
     * Validates the 'to' address field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'to' address is invalid.
     */
    private static validateAddress() {
        const { to } = this.#data;
        if (to && !Address.validate(to)) {
            throw new Error(`Invalid 'to' address: ${to}`);
        }
        return this;
    }

    /**
     * Validates the 'to' address field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'to' address is invalid.
     */
    private static validateTo() {
        return this.validateAddress(); // same logic
    }

    /**
     * Validates the 'max' field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'max' value is invalid.
     */
    private static validateMax() {
        const { max } = this.#data;
        if (max && Number(max) <= 0) {
            throw new Error(`Invalid input: max must be greater than 0`);
        }
        return this;
    }

    /**
     * Validates the 'lim' field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'lim' value is invalid.
     */
    private static validateLim() {
        const { lim } = this.#data;
        if (lim && Number(lim) <= 0) {
            throw new Error(`Invalid input: lim must be greater than 0`);
        }
        return this;
    }

    /**
     * Validates the 'amt' field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'amt' value is invalid.
     */
    private static validateAmt() {
        const { amt } = this.#data;
        if (amt && Number(amt) <= 0) {
            throw new Error(`Invalid input: amt must be greater than 0`);
        }
        return this;
    }

    /**
     * Validates the 'dec' field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'dec' value is invalid.
     */
    private static validateDec() {
        const { dec } = this.#data;
        if (dec && (Number(dec) < 0 || Number(dec) > 18)) {
            throw new Error(`Invalid input: dec must be between 0 and 18`);
        }
        return this;
    }

    /**
     * Validates the 'pre' field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'pre' value is invalid.
     */
    private static validatePre() {
        const { pre } = this.#data;
        if (pre && Number(pre) <= 0) {
            throw new Error(`Invalid input: pre must be greater than 0`);
        }
        return this;
    }

    /**
     * Validates the 'ca' field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'ca' value is invalid.
     */
    private static validateCa() {
        const { ca } = this.#data;
        if (!ca) {
            throw new Error(`Invalid input: ca is required`);
        }
        return this;
    }

    /**
     * Validates the 'mod' field in the data.
     * @returns The current instance for chaining.
     * @throws Error if the 'mod' value is invalid.
     */
    private static validateMod() {
        const { mod } = this.#data;
        if (!mod || (mod !== "add" && mod !== "remove")) {
            throw new Error(`Invalid input: mod must be 'add' or 'remove'`);
        }
        return this;
    }

    /**
     * Validates the Krc20Data based on the operation type.
     * @param data The Krc20Data object to validate.
     * @throws Error if the operation type is invalid or data validation fails.
     */
    public static validate(data: Krc20Data) {
        this.#data = data;

        switch (data.op) {
            case OP.Deploy:
                this.validateDeploy(); break;
            case OP.Mint:
                this.validateMint(); break;
            case OP.Transfer:
                this.validateTransfer(); break;
            case OP.List:
                this.validateList(); break;
            case OP.Send:
                this.validateSend(); break;
            case OP.Issue:
                this.validateIssue(); break;
            case OP.Burn:
                this.validateBurn(); break;
            case OP.Blacklist:
                this.validateBlacklist(); break;
            case OP.Chown:
                this.validateChown(); break;
            default:
                throw new Error(`Unsupported operation: ${data.op}`);
        }
    }
}

export { ValidateKrc20Data };