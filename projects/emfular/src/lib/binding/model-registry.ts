import {Referencable} from "../referencing/referencable/referenceable";
import {JsonDeserializable} from "../serialization/json-deserializable";

export class ModelRegistry {
    private map = new Map<string, JsonDeserializable<any>>()

    set<T extends Referencable>(
        key: string,
        cls: JsonDeserializable<T>
    ) {
        this.map.set(key, cls )
    }

    get<T extends Referencable>(key: string): JsonDeserializable<T> {
        const entry = this.map.get(key);
        if (entry) {
            return entry as JsonDeserializable<T>;
        } else {
            throw new Error(`Unable to find a constructor for ${key}`);
        }
    }
}