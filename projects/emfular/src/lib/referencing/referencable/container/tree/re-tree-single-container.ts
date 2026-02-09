import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../serialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReTreeChildrenContainer} from "./re-tree-children-container";

export class ReTreeSingleContainer<T extends Referencable, Tname extends string> extends ReSingleContainer<T, Tname> implements ReTreeChildrenContainer<T, Tname> {

    readonly defaultEClass?: string;

    constructor(parent: Referencable, referenceName: Tname, inverseName?: string, eClass?: string) {
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

    fromJson(formerPrefix: string, context: Deserializer, json: any) {
        let eClass;
        let refStr = RefHandler.computePrefix(formerPrefix, this.referenceName)
        let myJson: JsonOf<T> = json[this.referenceName]
        if (myJson) eClass = Deserializer.getEClass(myJson, this.defaultEClass);
        if (!eClass){
            eClass = this.defaultEClass
            if(!eClass){
                throw new Error("Cannot determine eClass for "+formerPrefix)
            }
        }
        let ref = RefHandler.createRef(refStr, eClass)
        this.add(context.createTreeBackbone<T>(ref, myJson))
    }
}
