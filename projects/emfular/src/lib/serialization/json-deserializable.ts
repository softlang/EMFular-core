import {Referencable} from "../referencing/referencable/referenceable";

export interface JsonDeserializable<T extends Referencable, J> {
    fromJson(json: J): T
    new (...args: any[]): T
}

export function deserialize<T extends Referencable, J>(
    cls: JsonDeserializable<T, J>,
    json: J
): T {
    return cls.fromJson(json)
}

export type JsonOf<C> =
    C extends JsonDeserializable<any, infer J> ? J : never
