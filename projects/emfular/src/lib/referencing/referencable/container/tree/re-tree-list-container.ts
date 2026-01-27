import {Referencable} from "../../referenceable";
import {ReListContainer} from "../re-list-container";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../deserialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";

export class ReTreeListContainer<T extends Referencable> extends ReListContainer<T> {

    private defaultEClass?: string;

    constructor(parent: Referencable, name: string, inverse?: string, eClass?: string) {
        super(parent, name, inverse);
        this.defaultEClass = eClass;
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
    fromJson(formerPrefix: string, context: Deserializer) {
        let refStr = RefHandler.computePrefix(formerPrefix, this.referenceName)
        let json: JsonOf<T>[] = context.getJsonFromTree(refStr)
        let eClasses: string[] = Deserializer.getEClasses(json, this.defaultEClass);

        let refList = RefHandler.createRefList(formerPrefix, this.referenceName, eClasses)
        refList.forEach(ref => {
          this.add(context.createWithChildren<T>(ref))
        })
    }

}
