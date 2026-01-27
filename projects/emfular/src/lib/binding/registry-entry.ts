import {Referencable} from "../referencing/referencable/referenceable";
import {JsonDeserializable, JsonOf} from "../serialization/json-deserializable";



export interface RegistryEntry<T extends Referencable> {
    cls: JsonDeserializable<T, JsonOf<JsonDeserializable<T, any>>>
}

export type Registry<E extends string | number> = {
    [K in E]: RegistryEntry<any>
}

export function register<C extends JsonDeserializable<any, any>>(
    cls: C
): RegistryEntry<InstanceType<C>> {
    return { cls }
}


/*export function register<T extends Referencable, J>(
    cls: JsonDeserializable<T, J>
): RegistryEntry<T> {
    return { cls }
}*/
