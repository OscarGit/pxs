import sorterModule from '../wasm/sorter.go';

export type ColorAttribute = 'raw' | 'brightness' | 'saturation' | 'hue';
export type SortOptions = {
    selectBy: ColorAttribute;
    invert: boolean;
    lowerRange: number;
    upperRange: number;
    desc: boolean;
    direction: 'vertical' | 'horizontal';
    sortBy: ColorAttribute;
};
export interface Sorter {
    sortImage: (
        data: Uint8ClampedArray,
        width: number,
        height: number,
        bpp: number,
        options: SortOptions
    ) => Promise<Uint8ClampedArray>;
}

export function instantiateSorter() {
    return sorterModule.instantiate<Sorter>();
}
