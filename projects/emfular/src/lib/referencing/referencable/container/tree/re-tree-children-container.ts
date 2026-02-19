import {SerializationContext} from "../../../../serialization/serialization-context";
import {Deserializer} from "../../../../serialization/deserializer";
import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";
import {JsonOf} from "../../../../serialization/json-deserializable";

export abstract class ReTreeChildrenContainer<
    T extends Referencable<any>,
> extends ReContainer<T, T["ParentType"]> {

    readonly defaultEClass?: string;

    protected constructor(parent: T["ParentType"], name: string, eClass?: string) {
        super(parent, name);
        this.defaultEClass = eClass;
        this._parent.$treeChildren.push(this)
    }
    // serialization
    abstract assignRefs(ctx: SerializationContext, path: string) : void
    abstract override toJson(ctx: SerializationContext): JsonOf<T>[] | JsonOf<T> | undefined
    //deserialization
    abstract fromJson(formerPrefix: string, context: Deserializer, json: any): void
    abstract createRefsOnChildren(context: Deserializer, json: any): void
}
