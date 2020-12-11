import sorterModule from '../wasm/sorter.go';

export interface SortOptions {
    desc: boolean;
    direction: 'vertical' | 'horizontal';
    lowerRange: number;
    upperRange: number;
}
export interface Sorter {
    sortImage: (
        data: Uint8ClampedArray,
        width: number,
        height: number,
        options: SortOptions
    ) => Promise<Uint8ClampedArray>;
}

export function instantiateSorter() {
    return sorterModule.instantiate<Sorter>();
}
