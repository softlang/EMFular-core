import { Referencable } from "../referencing/referencable/referenceable";

export interface JsonDeserializable<T extends Referencable<any>> {
    new(): T;
}