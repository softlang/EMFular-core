import {Referencable} from "../referencing/referencable/referenceable";
import {RegistryEntry} from "./registry-entry";
import {JsonDeserializable, JsonOf} from "../serialization/json-deserializable";

export class ModelRegistry {
    private map = new Map<string, RegistryEntry<any>>()

    set<T extends Referencable>(
        key: string,
        cls: JsonDeserializable<T, JsonOf<T>>
    ) {
        this.map.set(key, { cls })
    }

    get<T extends Referencable>(key: string): RegistryEntry<T> {
        return this.map.get(key) as RegistryEntry<T>
    }
}
