import { Referencable } from "../referencing/referencable/referenceable";
import { JsonDeserializable } from "../serialization/json-deserializable";
import {ECLASS_METADATA_KEY} from "./eclass-decorator";

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

    static getEClassForInstance(instance: Referencable<any>): string {
        const ctor = instance.constructor as Function
        return this.getEClassForConstructor(ctor)
    }

    static getEClassForConstructor(ctor: Function): string {
        const eClass = Reflect.getMetadata(ECLASS_METADATA_KEY, ctor);
        if (!eClass) {
            throw new Error( `ModelRegistry: Class '${ctor.name}' has no EClass metadata. `
                + `Did you forget to add @eClass or @autoEClass?`
            );
        }
        return eClass;
    }
}
