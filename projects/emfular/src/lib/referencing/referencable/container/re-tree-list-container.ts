import {Referencable} from "../referenceable";
import {ReListContainer} from "./re-list-container";
import {RefHandler} from "../../ref/ref-handler";

export class ReTreeListContainer<T extends Referencable> extends ReListContainer<T> {

    static prepareList<T extends Referencable>(prefix: string, list: T[]): void {
        if (list?.length > 0) {
            list.map((ref: Referencable, index) => {
                ref.prepare(RefHandler.mixWithIndex(prefix, index))
            })
        }
    }

    override prepare(ref: string) {
        ReTreeListContainer.prepareList(RefHandler.computePrefix(ref, this.referenceName),this._instance)
    }

    //todo actually wider than parent (Ref[])
    override toJson(): any[] {
        return this._instance.map(
            (ref: T) => ref.toJson()
        )
    }

}
