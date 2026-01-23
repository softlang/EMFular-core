import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {RefHandler} from "../../../ref/ref-handler";

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
}
