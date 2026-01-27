import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../deserialization/deserializer";

export class ReTreeSingleContainer<T extends Referencable> extends ReSingleContainer<T>  {

    constructor(parent: Referencable, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
        this._parent.$treeChildren.push(this)
    }

    override prepare(ref: string) {
        let newRef = RefHandler.computePrefix(ref, this.referenceName)
        this._instance?.prepare(newRef)
    }

    override toJson(): any {
        return this._instance?.toJson()
    }

    fromJson(formerPrefix: string, context: Deserializer, eClasses?: string[]) {
        let eClass = "noEclass";
        if (eClasses) eClass = eClasses[0];
        let ref = RefHandler.createRef(RefHandler.computePrefix(formerPrefix, this.referenceName), eClass)
        this.add(context.create<T>(ref))
    }
}
