import {ModelList} from "../binding/proxy/model-list";
import {SingleRef} from "../binding/proxy/single-ref";
import {Kind} from "../binding/proxy/reference-kind";
import {Ref} from "../referencing/ref/ref";

type IsReferenceProp<T> =
    T extends ModelList<any, any> ? true
        : T extends SingleRef<any, any> ? true
            : false;

type KindOfRef<T> =
    T extends ModelList<any, infer Ki> ? Ki :
        T extends SingleRef<any, infer Ki> ? Ki :
            never;


type ReferenceKeys<T> = {
    [K in keyof T]:
    StartsWithPrivate<K> extends true ? never :
        IsReferenceProp<T[K]> extends true
            ? (KindOfRef<T[K]> extends "none" ? never : K)
            : never
}[keyof T];


// ignore these on attributes:
type StartsWithPrivate<K> =
    K extends `_${string}` | `$${string}` ? true : false;

type AttributeKeys<T> = {
    [K in keyof T]:
    K extends "$ParentType" ? never :
        StartsWithPrivate<K> extends true ? never :
            T[K] extends Function ? never :
                IsReferenceProp<T[K]> extends true ? never :
                    K
}[keyof T];

export type JsonForSingleReference<T, Ki extends Kind> =
    Ki extends "tree" ? JsonOf<T> | undefined :
        Ki extends "link" ? Ref | undefined :
            never; // "none";

export type JsonForListReference<T, Ki extends Kind> =
    Ki extends "tree" ? JsonOf<T>[] :
        Ki extends "link" ? Ref[] :
            never;

export type JsonForReference<T> =
    T extends ModelList<infer Ty, infer Ki>
        ? JsonForListReference<Ty, Ki>:
        T extends SingleRef<infer Ty, infer Ki>
            ? JsonForSingleReference<Ty, Ki>:
            never;

export type JsonOf<T> =
    & { eClass?: string }
    & { [K in AttributeKeys<T>]?: T[K]; }
    & { [K in ReferenceKeys<T>]?: JsonForReference<T[K]> };
