import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../deserialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";

export class ReTreeSingleContainer<T extends Referencable> extends ReSingleContainer<T>  {

    readonly defaultEClass?: string;

    constructor(parent: Referencable, referenceName: string, inverseName?: string, eClass?: string) {
        super(parent, referenceName, inverseName);
        this.defaultEClass = eClass;
        this._parent.$treeChildren.push(this)
    }

    override prepare(ref: string) {
        let newRef = RefHandler.computePrefix(ref, this.referenceName)
        this._instance?.prepare(newRef)
    }

    override toJson(): any {
        return this._instance?.toJson()
    }

    fromJson(formerPrefix: string, context: Deserializer) {
        let eClass;
        let refStr = RefHandler.computePrefix(formerPrefix, this.referenceName)
        let json: JsonOf<T> = context.getJsonFromTree(refStr)
        if (json) eClass = Deserializer.getEClass(json, this.defaultEClass);
        if (!eClass){
            eClass = this.defaultEClass
            if(!eClass){
                throw "Cannot determine eClass for "+formerPrefix
            }
        }
        let ref = RefHandler.createRef(refStr, eClass)
        this.add(context.createWithChildren<T>(ref))
    }
}
