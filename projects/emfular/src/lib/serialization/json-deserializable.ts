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

export type JsonOf<T> =
    & { eClass?: string }
    & {
        [P in keyof T as T[P] extends Function ? never : P]:
        T[P] extends ReTreeChildrenContainer<infer C, any>
         ? T[P] extends ReListContainer<any, any>
            ? JsonOf<C>[]
            : JsonOf<C> | null
        : T[P] extends ReLinkContainer<any, any>
            ? T[P] extends ReListContainer<any, any>
                ? Ref[]
                : Ref | null
            : T[P];
};
