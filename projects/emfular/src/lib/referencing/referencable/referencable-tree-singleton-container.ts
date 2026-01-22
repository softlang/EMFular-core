import {Referencable} from "./referenceable";
import {ReSingleContainer} from "./re-single-container";
import {RefHandler} from "../ref/ref-handler";

export class ReferencableTreeSingletonContainer<T extends Referencable> extends ReSingleContainer<T>  {
    override prepare(ref: string) {
        let newRef = RefHandler.computePrefix(ref, this.referenceName)
        this._instance?.prepare(newRef)
    }

    override toJson(): any {
        return this._instance?.toJson()
    }
}
