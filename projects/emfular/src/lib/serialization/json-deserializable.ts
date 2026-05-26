import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import {KindFromMeta, ModelList, ModelListFromMeta, ModelListWithKind} from "../binding/proxy/model-list";
import {SingleRef, SingleRef2, SingleRef2FromMeta, SingleRef2WithKind} from "../binding/proxy/single-ref";

export interface JsonDeserializable<T extends Referencable<any>> {
    new(): T;
}

type IsReferencable<T> =
    T extends Referencable<any> ? true : false;

type IsReferenceProp2<T> =
    T extends object
        ? T extends ModelList<any> ? true
        : T extends SingleRef2<any> ? true
        : T extends SingleRef<any, any> ? true
        : IsReferencable<T> extends true ? true : false
        : false;

type ReferenceKeys<T> = {
    [K in keyof T]:
    IsReferenceProp2<T[K]> extends true
        ? K
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
                    IsReferenceProp2<T[K]> extends true ? never :
                        K
}[keyof T];

export type JsonForSingleReference<T, K extends keyof T> =

// 1. Precise: Kind explicitly known
    T[K] extends SingleRef2WithKind<infer C, "tree"> ? JsonOf<C> | undefined :
        T[K] extends SingleRef2WithKind<any, "link"> ? Ref | undefined :
            T[K] extends SingleRef2WithKind<any, "none"> ? undefined :

                // 2. Meta-driven
                T[K] extends SingleRef2FromMeta<infer C, infer RMeta>
                    ? KindFromMeta<RMeta> extends "tree" ? JsonOf<C> | undefined :
                        KindFromMeta<RMeta> extends "link" ? Ref | undefined :
                            undefined
                    :

                    // 3. Agnostic: user didn’t specify anything
                    T[K] extends SingleRef2<infer C>
                        ? JsonOf<C> | Ref | undefined
                        : T[K] extends SingleRef<infer C, any>
    ? JsonOf<C> | Ref| undefined: never;

export type JsonForListReference<T, K extends keyof T> =

// 1. Precise: Kind is explicitly known
    T[K] extends ModelListWithKind<infer C, "tree"> ? JsonOf<C>[] :
        T[K] extends ModelListWithKind<any, "link"> ? Ref[] :
            T[K] extends ModelListWithKind<any, "none"> ? undefined | []
    :
    // 2. Meta-driven
     T[K] extends ModelListFromMeta<infer C, infer RMeta>
        ? KindFromMeta<RMeta> extends "tree" ? JsonOf<C>[] :
           KindFromMeta<RMeta> extends "link" ? Ref[] :
              undefined | [] // none
     :
     // 3. Agnostic: user didn’t specify anything
     T[K] extends ModelList<infer C> ? undefined | [] | Ref[] | JsonOf<C>[] :
         never;

export type JsonForReference<T, K extends keyof T> =
// LIST reference?
    T[K] extends ModelList<any>
        ? JsonForListReference<T, K>

        // SINGLE reference?
        :  JsonForSingleReference<T, K>


export type JsonOf<T> =
    & { eClass?: string }
    & { [K in AttributeKeys<T>]?: T[K]; }
    & { [K in ReferenceKeys<T>]?: JsonForReference<T, K> };

