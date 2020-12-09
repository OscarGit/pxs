declare module '*.sass' {}

interface WasmModule {
    instantiate: <T>() => Promise<T>;
}
declare module '*.go' {
    const content: WasmModule;
    export default content;
}
