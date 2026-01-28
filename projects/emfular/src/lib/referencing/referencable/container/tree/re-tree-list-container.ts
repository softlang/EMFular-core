import {Referencable} from "../../referenceable";
import {ReListContainer} from "../re-list-container";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../deserialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";

export class ReTreeListContainer<T extends Referencable> extends ReListContainer<T> {

    readonly defaultEClass?: string;

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
        let eClasses: (string|undefined)[] = Deserializer.getEClasses(json, this.defaultEClass);
        let definedEClasses: string[] = eClasses.filter(i => i !=undefined)
        if (definedEClasses.length < eClasses.length) {
            throw new Error("Could not determine all EClasses for "+formerPrefix+": we have "+eClasses.join(","))
        }

        let refList = RefHandler.createRefList(formerPrefix, this.referenceName, definedEClasses)
        refList.forEach(ref => {
          this.add(context.createWithChildren<T>(ref))
        })
    }

}
