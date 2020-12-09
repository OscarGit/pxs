import sorterModule from '../wasm/sorter.go';

export interface Sorter {
    sortImage: (data: Uint8ClampedArray) => Promise<Uint8ClampedArray>;
}

export function instantiateSorter() {
    return sorterModule.instantiate<Sorter>();
}
