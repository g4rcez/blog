import { mergeWith, isNil, concat, uniq } from "ramda";

const deepMerge = <T>(v1: T, v2: T): T => {
    if (Array.isArray(v1) && Array.isArray(v2)) {
        return uniq(concat(v1, v2)) as never;
    } 
    if (typeof v1 === 'object' && typeof v2 === 'object' && !isNil(v1) && !isNil(v2)){
        return mergeWith(deepMerge, v1, v2)
    }
    return v2;
}

export const merge = <T>(one: T, two: T) => mergeWith(deepMerge,one, two)