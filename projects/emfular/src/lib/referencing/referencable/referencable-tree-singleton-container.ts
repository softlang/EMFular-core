import {Referencable} from "./referenceable";
import {ReferencableSingletonContainer} from "./referencable-singleton-container";
import {RefHandler} from "../ref/ref-handler";

export class ReferencableTreeSingletonContainer<T extends Referencable> extends ReferencableSingletonContainer<T>  {
    override prepare(ref: string) {
        let newRef = RefHandler.computePrefix(ref, this.referenceName)
        this._instance?.prepare(newRef)
    }
}
