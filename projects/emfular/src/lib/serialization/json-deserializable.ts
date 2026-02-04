import {Referencable} from "../referencing/referencable/referenceable";
import {Ref} from "../referencing/ref/ref";

export interface JsonDeserializable<T extends Referencable> {
    new (ref?: Ref): T;
    //jsonType: J; // phantom type marker
}

export type JsonOf<T> = any;
