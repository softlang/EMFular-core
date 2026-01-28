import {Referencable} from "../referencing/referencable/referenceable";
import {Ref} from "../referencing/ref/ref";

export interface JsonDeserializable<T extends Referencable, J> {
    fromJson(json: J, ref: Ref): T
    new (...args: any[]): T
}

export type JsonOf<C> =
    C extends JsonDeserializable<any, infer J> ? J : never
