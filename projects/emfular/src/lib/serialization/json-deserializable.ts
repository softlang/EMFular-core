import { Referencable } from "../referencing/referencable/referenceable";
import { Ref } from "../referencing/ref/ref";
import { ReTreeChildrenContainer } from "../referencing/referencable/container/tree/re-tree-children-container";
import { ReLinkContainer } from "../referencing/referencable/container/link/re-link-container";

// ---------------------------------------------------------
//  JsonDeserializable<T>
// ---------------------------------------------------------
export interface JsonDeserializable<T extends Referencable> {
    new(): T;
}

// ---------------------------------------------------------
//  JsonOf<T> — main JSON type
// ---------------------------------------------------------
export type JsonOf<T extends Referencable> = {
    eClass?: string;
} & {
    [K in JsonKeys<T>]?: JsonValueForKey<T, K>;
};

// ---------------------------------------------------------
//  Extract literal containment keys from instance fields
// ---------------------------------------------------------
type ContainmentKeys<T> = {
    [K in keyof T]:
    T[K] extends ReTreeChildrenContainer<any, infer Name>
        ? Name
        : never
}[keyof T];

// ---------------------------------------------------------
//  Extract literal reference keys from instance fields
// ---------------------------------------------------------
type ReferenceKeys<T> = {
    [K in keyof T]:
    T[K] extends ReLinkContainer<any, infer Name>
        ? Name
        : never
}[keyof T];

// ---------------------------------------------------------
//  Extract containment element type
// ---------------------------------------------------------
type ContainmentElement<T> = {
    [K in keyof T]:
    T[K] extends ReTreeChildrenContainer<infer U, any>
        ? U
        : never
}[keyof T];

// ---------------------------------------------------------
//  Extract reference element type
// ---------------------------------------------------------
type ReferenceElement<T> = {
    [K in keyof T]:
    T[K] extends ReLinkContainer<infer U, any>
        ? U
        : never
}[keyof T];

// ---------------------------------------------------------
//  Attribute keys
// ---------------------------------------------------------
type AttributeKeys<T> = {
    [K in keyof T]:
    K extends `$${string}` ? never :
        K extends `_${string}` ? never :
            T[K] extends (...args: any[]) => any ? never :
                T[K] extends ReTreeChildrenContainer<any, any> ? never :
                    T[K] extends ReLinkContainer<any, any> ? never :
                        K
}[keyof T];

// ---------------------------------------------------------
//  All JSON keys
// ---------------------------------------------------------
type JsonKeys<T> =
    | AttributeKeys<T>
    | ContainmentKeys<T>
    | ReferenceKeys<T>;

// ---------------------------------------------------------
//  JSON value for a given key
// ---------------------------------------------------------
type JsonValueForKey<T extends Referencable, K extends JsonKeys<T>> =
// attribute
    (K extends AttributeKeys<T> ? T[K] : never)
    |
    // containment
    (K extends ContainmentKeys<T>
        ? JsonOf<ContainmentElement<T>> | Array<JsonOf<ContainmentElement<T>>>
        : never)
    |
    // reference
    (K extends ReferenceKeys<T>
        ? Ref | Ref[]
        : never);
