import { Krc20Data } from "./types/interface";
import { Address } from './utils/address';
import { OP } from "./utils/enum";

class ValidateKrc20Data {

    /**
     * Validates the deployment operation data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     */
    private static validateDeploy(data: Krc20Data) {
        return this.validateTick(data)
            .validateAddress(data)
            .validateAmt(data)
            .validateMax(data)
            .validateLim(data)
            .validateDec(data)
            .validatePre(data);
    }

    /**
     * Validates the mint operation data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     */
    private static validateMint(data: Krc20Data) {
        return this.validateTick(data).validateAddress(data);
    }

    /**
     * Validates the transfer operation data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     */
    private static validateTransfer(data: Krc20Data) {
        return this.validateTick(data).validateAddress(data).validateAmt(data);
    }

    /**
     * Validates the list operation data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     */
    private static validateList(data: Krc20Data) {
        return this.validateTick(data).validateAddress(data).validateAmt(data);
    }

    /**
     * Validates the send operation data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     */
    private static validateSend(data: Krc20Data) {
        return this.validateTick(data).validateAddress(data);
    }

    /**
     * Validates the ticker field in the data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     * @throws Error if the ticker is invalid.
     */
    private static validateTick(data: Krc20Data) {
        if (!data.tick || (data.tick.length < 4 || data.tick.length > 6)) {
            throw new Error(`Invalid input: ticker must be between 4 and 6 characters`);
        }
        return this;
    }

    /**
     * Validates the 'to' address field in the data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     * @throws Error if the 'to' address is invalid.
     */
    private static validateAddress(data: Krc20Data) {
        if (data.to && !Address.validate(data.to)) {
            throw new Error(`Invalid 'to' address: ${data.to}`);
        }
        return this;
    }

    /**
     * Validates the 'max' field in the data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     * @throws Error if the 'max' value is invalid.
     */
    private static validateMax(data: Krc20Data) {
        if (data.max && Number(data.max) <= 0) {
            throw new Error(`Invalid input: max must be greater than 0`);
        }
        return this;
    }

    /**
     * Validates the 'lim' field in the data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     * @throws Error if the 'lim' value is invalid.
     */
    private static validateLim(data: Krc20Data) {
        if (data.lim && Number(data.lim) <= 0) {
            throw new Error(`Invalid input: lim must be greater than 0`);
        }
        return this;
    }

    /**
     * Validates the 'amt' field in the data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     * @throws Error if the 'amt' value is invalid.
     */
    private static validateAmt(data: Krc20Data) {
        if (data.amt && Number(data.amt) <= 0) {
            throw new Error(`Invalid input: amt must be greater than 0`);
        }
        return this;
    }

    /**
     * Validates the 'dec' field in the data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     * @throws Error if the 'dec' value is invalid.
     */
    private static validateDec(data: Krc20Data) {
        if (data.dec && (Number(data.dec) < 0 || Number(data.dec) > 18)) {
            throw new Error(`Invalid input: dec must be between 0 and 18`);
        }
        return this;
    }

    /**
     * Validates the 'pre' field in the data.
     * @param data The Krc20Data object to validate.
     * @returns The current instance for chaining.
     * @throws Error if the 'pre' value is invalid.
     */
    private static validatePre(data: Krc20Data) {
        if (data.pre && Number(data.pre) <= 0) {
            throw new Error(`Invalid input: pre must be greater than 0`);
        }
        return this;
    }

    /**
     * Validates the Krc20Data based on the operation type.
     * @param data The Krc20Data object to validate.
     * @throws Error if the operation type is invalid or data validation fails.
     */
    public static validate(data: Krc20Data) {
        switch (data.op) {
            case OP.Deploy:
                this.validateDeploy(data);
                break;
            case OP.Mint:
                this.validateMint(data);
                break;
            case OP.Transfer:
                this.validateTransfer(data);
                break;
            case OP.List:
                this.validateList(data);
                break;
            case OP.Send:
                this.validateSend(data);
                break;
            default:
                throw new Error(`Invalid input: op must be ${OP.Deploy}, ${OP.Mint}, ${OP.Transfer}`);
        }
    }
}

export { ValidateKrc20Data };