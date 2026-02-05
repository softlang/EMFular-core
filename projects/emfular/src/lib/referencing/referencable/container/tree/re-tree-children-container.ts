import {SerializationContext} from "../../../../serialization/serialization-context";
import {Deserializer} from "../../../../serialization/deserializer";
import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";

export interface ReTreeChildrenContainer<T extends Referencable> extends ReContainer<T> {
    assignRefs(ctx: SerializationContext, path: string) : void
    createRefsOnChildren(context: Deserializer, json: any): void
    fromJson(formerPrefix: string, context: Deserializer, json: any): void
}
