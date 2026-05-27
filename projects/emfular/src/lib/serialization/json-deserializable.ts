import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import {ModelList} from "../binding/proxy/model-list";
import {SingleRef} from "../binding/proxy/single-ref";
import {Kind} from "../binding/proxy/reference-kind";

export interface JsonDeserializable<T extends Referencable<any>> {
    new(): T;
}

type IsReferenceProp<T> =
    T extends object
        ? T extends ModelList<any, any> ? true
        : T extends SingleRef<any, any> ? true
        : false
    : false;

type KindOfRef<T> =
    T extends ModelList<any, infer Ki> ? Ki :
            T extends SingleRef<any, infer Ki> ? Ki :
                never;


type ReferenceKeys<T> = {
    [K in keyof T]:
    StartsWithPrivate<K> extends true ? never :
        K extends "ParentType" ? never :
            IsReferenceProp<T[K]> extends true
                ? (
                    // but only if its kind is not "none"
                    KindOfRef<T[K]> extends "none" ? never : K
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
                    IsReferenceProp<T[K]> extends true ? never :
                        K
}[keyof T];

type JsonForSingleByKind<C, Ki extends Kind> =
    Ki extends "tree" ? JsonOf<C> | undefined :
        Ki extends "link" ? Ref | undefined :
            never; // "none"

export type JsonForSingleReference<T, K extends keyof T> =
    T[K] extends SingleRef<infer C, infer Ki>
        ? JsonForSingleByKind<C, Ki>
            : never;


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

