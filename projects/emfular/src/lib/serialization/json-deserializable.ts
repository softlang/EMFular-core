import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import { ReTreeChildrenContainer } from "../referencing/referencable/container/tree/re-tree-children-container";
import { ReLinkContainer } from "../referencing/referencable/container/link/re-link-container";
import {ReListContainer} from "../referencing/referencable/container/re-list-container";

// ---------------------------------------------------------
//  JsonDeserializable<T>
// ---------------------------------------------------------
export interface JsonDeserializable<T extends Referencable> {
    new(): T;
}

// ignore these on attributes:
type StartsWithPrivate<K> =
    K extends `_${string}` | `$${string}` ? true : false;

// Identify attribute fields
type AttributeKeys<T> = {
    [K in keyof T]:
    IsContainer<T[K]> extends true ? never :
        T[K] extends Function ? never :
            StartsWithPrivate<K> extends true ? never :
                K
}[keyof T];

// Remove leading "_" from container field names
type StripPrivate<K> =
    K extends `_${infer Rest}` ? Rest : K;

// Identify container fields
type IsContainer<T> =
    T extends ReTreeChildrenContainer<any, any> ? true :
        T extends ReLinkContainer<any, any> ? true :
            false;

type ContainerKeys<T> = {
    [K in keyof T]: IsContainer<T[K]> extends true ? K : never
}[keyof T];

// Map container → JSON
type JsonForContainer<T> =
    T extends ReTreeChildrenContainer<infer C, any>
        ? T extends ReListContainer<any, any>
            ? JsonOf<C>[]
            : JsonOf<C> | null
        : T extends ReLinkContainer<any, any>
            ? T extends ReListContainer<any, any>
                ? Ref[]
                : Ref | null
            : never;

// Final JSON type
export type JsonOf<T> =
    & { eClass?: string }
    & {
    // containers → JSON relationships
    [K in ContainerKeys<T> as StripPrivate<K>]?:
    JsonForContainer<T[K]>;
}
    & {
    // attributes → primitive JSON values
    [K in AttributeKeys<T>]?: T[K];
};
