import {Referencable} from "../referencing/referencable/referenceable";
import {JsonDeserializable, JsonOf} from "../serialization/json-deserializable";

export interface RegistryEntry<T extends Referencable> {
    cls: JsonDeserializable<T, JsonOf<JsonDeserializable<T, any>>>
}
