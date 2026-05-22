import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import {ModelList} from "../binding/proxy/model-list";
import {SingleRef} from "../binding/proxy/single-ref";
import {ModelDefinition} from "../binding/model-definition";

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


// --- Registry types (you already conceptually have these) ---
interface TypeRegistry {
    // e.g. "http://www.example.org/basicfamily#//Person": Person;
}

interface ModelRegistryMeta {
    // e.g. basicfamily: typeof FamilyMeta;
}

// Class name from TS type (URI#//EClassName)
type ClassName<T> = {
    [K in keyof TypeRegistry]:
    T extends TypeRegistry[K] ? K : never
}[keyof TypeRegistry];

// ModelDefinition lookup from URI
type LookupMeta<CName extends string> =
    {
        [K in keyof ModelRegistryMeta]:
        CName extends `${ModelRegistryMeta[K]["uri"]}${infer _}`
            ? ModelRegistryMeta[K]
            : never
    }[keyof ModelRegistryMeta];


type JsonForReference<
    T,
    K extends keyof T,
    CName extends string = ClassName<T>,
    M extends ModelDefinition | never = LookupMeta<CName>
> =
    T[K] extends ModelList<infer C>
        ? [M] extends [never]
            // no meta → either tree or ref
            ? (JsonOf<C> | Ref)[]
            // meta → precise
            : M["classes"][CName]["references"][Extract<K, string>] extends { containment: true }
                ? JsonOf<C>[]
                : Ref[]
        : T[K] extends SingleRef<infer C, any>
            ? [M] extends [never]
                // no meta → either tree or ref
                ? JsonOf<C> | Ref | undefined
                // meta → precise
                : M["classes"][CName]["references"][Extract<K, string>] extends { containment: true }
                    ? JsonOf<C> | undefined
                    : Ref | undefined
            : never;

/*
type JsonForReference<T,
    CName extends string = ClassName<T>,
    M extends ModelDefinition | never = LookupMeta<CName>
> =
    T extends ModelList<infer C>
        ? [M] extends [never]
            // no meta → either tree or ref
            ? (JsonOf<C> | Ref)[]
            // meta → precise
            : M["classes"][CName]["references"][Extract<K, string>] extends { containment: true }
                ? JsonOf<C>[]
                : Ref[]
        : T extends SingleRef<infer C>
            ? [M] extends [never]
                // no meta → either tree or ref
                ? JsonOf<C> | Ref | undefined
                // meta → precise
                : M["classes"][CName]["references"][Extract<K, string>] extends { containment: true }
                    ? JsonOf<C> | undefined
                    : Ref | undefined
            : never;
*/


export type JsonOf<T> =
    & { eClass?: string }
    & { [K in AttributeKeys<T>]?: T[K]; }
    & { [K in ReferenceKeys<T>]?: JsonForReference<T, K> };

