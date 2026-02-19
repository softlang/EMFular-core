import {Referencable} from "../../referenceable";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../serialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReTreeChildrenContainer} from "./re-tree-children-container";

export class ReTreeSingleContainer<T extends Referencable<any>>
    extends ReTreeChildrenContainer<T> {

    _instance?: T

    constructor(parent: T["ParentType"], referenceName: string, inverseName?: string, eClass?: string) {
        super(parent, referenceName, eClass);
    }

    override get(): T | undefined {
        return this._instance;
    }

    assignRefs(ctx: SerializationContext, path: string) {
        this._instance?.assignRefs(ctx, RefHandler.computePrefix(path, this.referenceName))
    }

    override toJson(ctx: SerializationContext): JsonOf<T>|undefined {
        return this._instance?.toJson(ctx)
    }

    override add(item: T): boolean {
        if(item == this._instance) {
            return false;
        } else {
            item.setParent(this);
            this._instance = item;
            return true;
        }
    }

    override remove(item: T): boolean {
        if(this._instance == item) {
            this._instance = undefined;
            item.setParent(undefined);
            return true;
        }
        return false;
    }

    override delete() {
        this._instance?.destruct()
    }

    fromJson(formerPrefix: string, context: Deserializer, json: any) {
        let myJson: JsonOf<T> = json[this.referenceName]
        if (myJson) {
            let eClass = Deserializer.getEClass(myJson, this.defaultEClass);
            if (!eClass){
                eClass = this.defaultEClass
                if(!eClass){
                    throw new Error("Cannot determine eClass for "+formerPrefix)
                }
            }
            let refStr = RefHandler.computePrefix(formerPrefix, this.referenceName)
            let ref = RefHandler.createRef(refStr, eClass)
            this.add(context.createTreeBackbone<T>(ref, myJson))
        }
    }

    createRefsOnChildren(context: Deserializer, json: any) {
        let myJson: JsonOf<T> = json[this.referenceName];
        if(this._instance && myJson ) {
            this._instance.deserializeLinks(context, myJson)
        }
    }
}
