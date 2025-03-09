declare module 'bun:test' {
    export function describe(name: string, fn: () => void): void;
    export function test(name: string, fn: (t: any) => Promise<void> | void, timeout?: number): void;
    export function expect(value: any): any;
}