import {SerializationContext} from "../../../../serialization/serialization-context";
import {Deserializer} from "../../../../serialization/deserializer";
import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";

export interface ReTreeChildrenContainer<T extends Referencable> extends ReContainer<T> {
    // serialization
    assignRefs(ctx: SerializationContext, path: string) : void
    toJson(ctx: SerializationContext): T[] | T | undefined
    //deserialization
    fromJson(formerPrefix: string, context: Deserializer, json: any): void
    createRefsOnChildren(context: Deserializer, json: any): void
}
