import {Referencable} from "../referencing/referencable/referenceable";

export interface JsonDeserializable<T extends Referencable> {
    new (): T;
    //jsonType: J; // phantom type marker
}

export type JsonOf<T> = any;
