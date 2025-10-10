import {Referencable} from "./referenceable";
import {ReferencableListContainer} from "./referencable-list-container";
import {RefHandler} from "../ref/ref-handler";

export class ReferencableTreeListContainer<T extends Referencable> extends ReferencableListContainer<T> {

    static prepareList<T extends Referencable>(prefix: string, list: T[]): void {
        if (list?.length > 0) {
            list.map((ref: Referencable, index) => {
                ref.prepare(RefHandler.mixWithIndex(prefix, index))
            })
        }
    }

    override prepare(ref: string) {
        ReferencableTreeListContainer.prepareList(RefHandler.computePrefix(ref, this.referenceName),this._instance)
    }

}
