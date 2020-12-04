declare module '*.sass' {}
declare module '*.go' {
    const sortImage: (data: Uint8ClampedArray) => Promise<Uint8ClampedArray>;
}
