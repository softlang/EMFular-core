import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import {ModelList} from "../binding/proxy/model-list";
import {SingleRef, SingleRef2} from "../binding/proxy/single-ref";
import {Kind} from "../binding/proxy/reference-kind";

export interface JsonDeserializable<T extends Referencable<any>> {
    new(): T;
}

type IsReferencable<T> =
    T extends Referencable<any> ? true : false;

type IsReferenceProp2<T> =
    T extends object
        ? T extends ModelList<any, any> ? true
        : T extends SingleRef2<any, any> ? true
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

    T[K] extends SingleRef2<infer C, "tree"> ? JsonOf<C> | undefined :
        T[K] extends SingleRef2<any, "link"> ? Ref | undefined :
            T[K] extends SingleRef2<any, "none"> ? never :


                    // 2. simple case
                T[K] extends SingleRef<infer C, "tree"> ? JsonOf<C> | undefined :
                    T[K] extends SingleRef<any, "link"> ? Ref | undefined :
                        T[K] extends SingleRef<any, "none"> ? never :
     never;


export type JsonForListReference<
    T,
    Ki extends Kind
> =
    Ki extends "tree" ? JsonOf<T>[] :
        Ki extends "link" ? Ref[] :
            never;

export type JsonForReference<T, K extends keyof T> =
    T[K] extends ModelList<infer Ty, infer Ki>
        ? JsonForListReference<Ty, Ki>
        : JsonForSingleReference<T, K>;

export type JsonOf<T> =
    & { eClass?: string }
    & { [K in AttributeKeys<T>]?: T[K]; }
    & { [K in ReferenceKeys<T>]?: JsonForReference<T, K> };

