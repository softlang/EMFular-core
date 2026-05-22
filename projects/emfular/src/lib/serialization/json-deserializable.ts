import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import {ModelList, ModelListFromMeta, ModelListWithKind} from "../binding/proxy/model-list";
import {SingleRef} from "../binding/proxy/single-ref";

export interface JsonDeserializable<T extends Referencable<any>> {
    new(): T;
}

type IsReferencable<T> =
    T extends Referencable<any> ? true : false;

type IsReferenceProp<T, K> =
    K extends "ParentType" ? false :
        T extends object
            ? T extends ModelList<any> ? true
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


export type JsonForReference<T, K extends keyof T> =
    JsonForListReference<T, K>

export type JsonForListReference<T, K extends keyof T> =

// 1. Precise: Kind is explicitly known
    T[K] extends ModelListWithKind<infer C, "tree"> ? JsonOf<C>[] :
        T[K] extends ModelListWithKind<any, "link"> ? Ref[] :
            T[K] extends ModelListWithKind<any, "none"> ? undefined | []
    :
    // 2. Meta-driven: Kind derived from ReferenceMeta
     T[K] extends ModelListFromMeta<infer C, infer M, infer L>
        ? M["classes"][L]["references"][Extract<K, string>] extends infer R
             ? R extends { isParent: true }
                ? undefined | []
             : R extends { derivingMethod: symbol }
                ? undefined | []
             : R extends { containment: true }
                ? JsonOf<C>[]
                : Ref[]
                   : never
     :
     // 3. Agnostic: user didn’t specify anything
     T[K] extends ModelList<infer C> ? (JsonOf<C> | Ref)[]|[]|undefined :
         never;


export type JsonOf<T> =
    & { eClass?: string }
    & { [K in AttributeKeys<T>]?: T[K]; }
    & { [K in ReferenceKeys<T>]?: JsonForReference<T, K> };

