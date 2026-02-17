import { Referencable } from "../referencing/referencable/referenceable";
import { JsonDeserializable } from "../serialization/json-deserializable";

export class ModelRegistry {
    private static map = new Map<string, JsonDeserializable<any>>();

    static register<T extends Referencable<any>>(
        key: string,
        cls: JsonDeserializable<T>
    ) {
        this.map.set(key, cls);
    }

    static get<T extends Referencable<any>>(key: string): JsonDeserializable<T> {
        const entry = this.map.get(key);
        if (!entry) {
            throw new Error(`Unable to find a constructor for ${key}`);
        }
        return entry as JsonDeserializable<T>;
    }
}
