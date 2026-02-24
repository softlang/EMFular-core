import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import {MetaAwareModelList, SingleRef} from "../referencing/referencable/container/hide/model-list";

export interface JsonDeserializable<T extends Referencable<any>> {
    new(): T;
}

type IsReferencable<T> =
    T extends Referencable<any> ? true : false;

type IsReferenceProp<T, K> =
    K extends "ParentType" ? false :
        T extends object
            ? T extends MetaAwareModelList<any, any> ? true
                : T extends SingleRef<any, any>
                    ? true
                    : IsReferencable<T> extends true
                        ? true
                        : false
            : false;

type ReferenceKeys<T> = {
    [K in keyof T]:
    IsReferenceProp<T[K], K> extends true
        ? (
            T[K] extends SingleRef<any, infer Kind>
                ? (Kind extends "parent" ? never : K) // exclude SingleRef<..., "parent">
                : K                                   // include all list refs + other refs
            )
        : never
}[keyof T];

// ignore these on attributes:
type StartsWithPrivate<K> =
    K extends `_${string}` | `$${string}` ? true : false;

type AttributeKeys<T> = {
    [K in keyof T]:
    K extends "ParentType" ? never :
        StartsWithPrivate<K> extends true ? never :
            T[K] extends Function ? never :
                    IsReferenceProp<T[K], K> extends true ? never :
                        K
}[keyof T];

type JsonForReference<T> =
    T extends MetaAwareModelList<infer C, infer Kind>
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

