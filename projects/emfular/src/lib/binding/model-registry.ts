import {Referencable} from "../referencing/referencable/referenceable";
import {RegistryEntry} from "./registry-entry";
import {JsonDeserializable, JsonOf} from "../serialization/json-deserializable";
import {InjectionToken} from "@angular/core";

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

export const MODEL_REGISTRY = new InjectionToken<ModelRegistry>('MODEL_REGISTRY');
