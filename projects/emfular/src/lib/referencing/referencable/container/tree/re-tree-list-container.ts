import {Referencable} from "../../referenceable";
import {ReListContainer} from "../re-list-container";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../deserialization/deserializer";

export class ReTreeListContainer<T extends Referencable> extends ReListContainer<T> {

    constructor(parent: Referencable, name: string, inverse?: string) {
        super(parent, name, inverse);
        this._parent.$treeChildren.push(this)
    }

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

    override toJson(): any[] {
        return this._instance.map(
            (ref: T) => ref.toJson()
        )
    }

    //creates one child level plus calls next createChildren
    fromJson(formerPrefix: string, context: Deserializer, eClasses?: string[]) {
        //todo get eclasses inside?
        let eclasses: string[] = [];
        let refList = RefHandler.createRefList(formerPrefix, this.referenceName, eClasses)
        refList.forEach(ref => {
          this.add(context.create<T>(ref))
        })
    }

}
