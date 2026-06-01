import {SerializationContext} from "../../../../serialization/serialization-context";
import {Deserializer} from "../../../../serialization/deserializer";
import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";
import {JsonOf} from "../../../../serialization/json-deserializable";

export interface ReTreeChildrenContainer<
    T extends Referencable<P>,
    P extends Referencable<any> =T["$ParentType"]
> extends ReContainer<T, T["$ParentType"]> {

    // serialization
    assignRefs(ctx: SerializationContext, path: string) : void
    toJson(ctx: SerializationContext): JsonOf<T>[] | JsonOf<T> | undefined
    //deserialization
    fromJson(formerPrefix: string, context: Deserializer, json: any): void
    createRefsOnChildren(context: Deserializer, json: any): void
}
