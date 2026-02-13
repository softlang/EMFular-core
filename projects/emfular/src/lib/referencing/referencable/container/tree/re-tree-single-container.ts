import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../serialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReTreeChildrenContainer} from "./re-tree-children-container";

export class ReTreeSingleContainer<T extends Referencable> extends ReSingleContainer<T> implements ReTreeChildrenContainer<T> {

    readonly defaultEClass?: string;

    constructor(parent: Referencable, referenceName: string, inverseName?: string, eClass?: string) {
        super(parent, referenceName, inverseName);
        this.defaultEClass = eClass;
        this._parent.$treeChildren.push(this)
    }

    assignRefs(ctx: SerializationContext, path: string) {
        this._instance?.assignRefs(ctx, RefHandler.computePrefix(path, this.referenceName))
    }

    override toJson(ctx: SerializationContext): JsonOf<T>|undefined {
        return this._instance?.toJson(ctx)
    }

    override add(item: T): boolean {
        let res = super.add(item);
        item.setParent(this);
        return res;
    }

    override remove(item: T): boolean {
        let res = super.remove(item);
        item.setParent(undefined);
        return res;
    }

    override removeFromInverse(item: T): boolean {
        return false;
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
}
