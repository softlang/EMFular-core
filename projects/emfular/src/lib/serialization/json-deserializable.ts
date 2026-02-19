import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import { ReTreeChildrenContainer } from "../referencing/referencable/container/tree/re-tree-children-container";
import { ReLinkContainer } from "../referencing/referencable/container/link/re-link-container";
import {ReContainer} from "../referencing/referencable/container/re-container";
import {ReTreeListContainer} from "../referencing/referencable/container/tree/re-tree-list-container";
import {ReLinkListContainer} from "../referencing/referencable/container/link/re-link-list-container";

export interface JsonDeserializable<T extends Referencable<any>> {
    new(): T;
}

// Remove leading "_" from container field names
type StripPrivate<K> =
    K extends `_${infer Rest}` ? Rest : K;

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

// Map container → JsonOf<X> or Ref, List or Single
type JsonForContainer<T> =
    T extends ReTreeChildrenContainer<infer C>
        ? T extends ReTreeListContainer<any>
            ? JsonOf<C>[]
            : JsonOf<C> | null
        : T extends ReLinkContainer<any, any>
            ? T extends ReLinkListContainer<any, any>
                ? Ref[]
                : Ref | null
            : never;

// Final JSON type
export type JsonOf<T> =
    & { eClass?: string }
    & { [K in ContainerKeys<T> as StripPrivate<K>]?: JsonForContainer<T[K]>; }
    & { [K in AttributeKeys<T>]?: T[K]; };
