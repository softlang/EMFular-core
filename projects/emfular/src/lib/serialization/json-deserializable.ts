import {Referencable} from "../referencing/referencable/referenceable";

export interface JsonDeserializable<T extends Referencable, J> {
    fromJson(json: J): T
}
