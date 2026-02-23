import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import {ReContainer} from "../referencing/referencable/container/re-container";
import {ModelList, SingleRef} from "../referencing/referencable/container/hide/model-list";

export interface JsonDeserializable<T extends Referencable<any>> {
    new(): T;
}

// Remove leading "_" from container field names
type StripPrivate<K> =
    K extends `_${infer Rest}` ? Rest : K;

type IsModelList<T> =
    T extends ModelList<infer C, infer Kind> ? [C, Kind] : never;

type IsSingleRef<T> =
    T extends SingleRef<infer C, infer Kind> ? [C, Kind] : never;


export type ReferenceKeys<T> = {
    [K in keyof T]:
    IsModelList<T[K]> extends never
        ? (IsSingleRef<T[K]> extends never ? never : K)
        : K
}[keyof T];


// Identify container fields
type IsContainer<T> =
    T extends ReContainer<any, any> ? true : false;

type ContainerKeys<T> = {
    [K in keyof T]: IsContainer<T[K]> extends true ? K : never
}[keyof T];

type ContainerPublicNames<T> = StripPrivate<ContainerKeys<T>>;

// ignore these on attributes:
type StartsWithPrivate<K> =
    K extends `_${string}` | `$${string}` ? true : false;

type IsExactlyRef<T> =
    [T] extends [Ref] ? ([Ref] extends [T] ? true : false) : false;

type AttributeKeys<T> = {
    [K in keyof T]:
    IsContainer<T[K]> extends true ? never :
        // don't treat public container accessors (get!) as attributes
        K extends ContainerPublicNames<T> ? never :
            T[K] extends Function ? never :
                StartsWithPrivate<K> extends true ? never :
                    IsExactlyRef<T[K]> extends true ? never :
                        K
}[keyof T];

type JsonForReference<T> =
    T extends ModelList<infer C, infer Kind>
        ? Kind extends "tree"
            ? JsonOf<C>[]
            : Ref[]
        : T extends SingleRef<infer C, infer Kind>
            ? Kind extends "tree"
                ? JsonOf<C> | null
                : Ref | null
            : never;


// Final JSON type
export type JsonOf<T> =
    & { eClass?: string }
    & { [K in AttributeKeys<T>]?: T[K]; }
    & { [K in ReferenceKeys<T>]?: JsonForReference<T[K]> };

