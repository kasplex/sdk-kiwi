
export interface PaginationParam {
    next?: string;
    prev?: string;
}

export interface KasplexApiResponse extends PaginationParam {
    message: string;
    result: [] | Record<string, any> | null;
}

export interface TokenBaseData {
    ca?: string;
    tick?: string;
    name?: string;
    max: string;
    lim: string;
    pre: string;
    to: string;
    dec: string;
    mod: string;
    minted: string;
    burned: string;
    opScoreAdd: string;
    opScoreMod: string;
    state: string;
    hashRev: string;
    mtsAdd: string;
}

export interface InfoData {
    daaScore: string;
    daaScoreGap: string;
    feeTotal: string;
    opScore: string;
    opTotal: string;
    tokenTotal: string;
    version: string;
    versionApi: string;
}

export interface TokenInfoData extends TokenBaseData {
    holderTotal: string;
    transferTotal: string;
    mintTotal: string;
    holder: {
        address: string;
        amount: string;
    }[];
}

export interface TokenListData extends TokenBaseData { }

export interface AddressTokenList {
    tick?: string;
    ca?: string;
    balance: string;
    locked: string;
    dec: string;
    opScoreMod: string;
}

export interface BalanceData {
    tick: string;
    balance: string;
    locked: string;
    dec: string;
    opScoreMod: string;
}

export interface MarketInfoData {
    tick?: string;
    ca?: string;
    from: string;
    amount: string;
    uTxid: string;
    uAddr: string;
    uAmt: string;
    uScript: string;
    opScoreAdd: string;
}

export interface BlackListData {
    ca: string;
    address: string;
    opScoreAdd: string;
}

export interface OpListData {
    p: "KRC-20";
    op: string;
    tick?: string;
    ca?: string;
    max?: string;
    lim?: string;
    pre?: string;
    dec?: string;
    mod?: string;
    amt?: string;
    name?: string;
    from: string;
    to: string;
    opScore: string;
    hashRev: string;
    feeRev: string;
    txAccept: string;
    opAccept: string;
    opError: string;
    mtsAdd: string;
    mtsMod: string;
    checkpoint: string;
}

export interface ArchiveOpListData {
    opscore: number;
    addressaffc: string;
    script: string;
    state: string;
    tickaffc: string;
    txid: string;
}

export interface TxListData {
    txid: string;
    data: string;
}

export interface ArchiveVspcList {
    chainBlock: Record<string, string | number>;
    txList: TxListData[];
}

export interface OperationInfo extends OpListData {
    utxo: string;
}

export interface StatusInfoResponse extends KasplexApiResponse {
    result: InfoData;
}

export interface TokenListResponse extends KasplexApiResponse {
    result: TokenListData[];
}

export interface TokenInfoResponse extends KasplexApiResponse {
    result: TokenInfoData[];
}

export interface AddressTokenListResponse extends KasplexApiResponse {
    result: AddressTokenList[];
}

export interface BalanceResponse extends KasplexApiResponse {
    result: BalanceData[];
}

export interface MarketInfoResponse extends KasplexApiResponse {
    result: MarketInfoData[];
}

export interface BlackListResponse extends KasplexApiResponse {
    result: BlackListData[];
}

export interface OpListResponse extends KasplexApiResponse {
    result: OpListData[];
}

export interface OperationInfoResponse extends KasplexApiResponse {
    result: OperationInfo[];
}

export interface ArchiveOpListResponse extends KasplexApiResponse {
    result: ArchiveOpListData[];
}

export interface ArchiveVspcListResponse extends KasplexApiResponse {
    result: ArchiveVspcList[];
}
