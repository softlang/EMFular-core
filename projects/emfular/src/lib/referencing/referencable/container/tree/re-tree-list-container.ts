import {Referencable} from "../../referenceable";
import {ReListContainer} from "../re-list-container";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../serialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";
import {SerializationContext} from "../../../../serialization/serialization-context";

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

    assignRefs(ctx: SerializationContext, path: string) {
        const ownPath = RefHandler.computePrefix(path, this.referenceName)
        this._instance.map((elem, index) =>
            elem.assignRefs(ctx, RefHandler.mixWithIndex(ownPath, index))
        )
    }

    override toJson(ctx: SerializationContext): JsonOf<T>[] {
        return this._instance.map(
            (ref: T) => ref.toJson(ctx)
        )
    }

    //creates one child level plus calls next createChildren
    fromJson(formerPrefix: string, context: Deserializer, json: any) {
        let myJson: JsonOf<T>[] = json[this.referenceName];
        if (myJson) {
            let eClasses: (string|undefined)[] = Deserializer.getEClasses(myJson, this.defaultEClass);
            let definedEClasses: string[] = eClasses.filter(i => i != undefined)
            if (definedEClasses.length < eClasses.length) {
                throw new Error("Could not determine all EClasses for "+formerPrefix+": we have "+eClasses.join(","))
            }
            if(definedEClasses.length != myJson.length) {
                throw new Error(`Determined eclasses for ${formerPrefix} do not fit available json elements: `+definedEClasses.join(","))
            }
            let refList = RefHandler.createRefList(formerPrefix, this.referenceName, definedEClasses)
            myJson.forEach((js, index) => {
                this.add(context.createTreeBackbone<T>(refList[index], js))
            })
        }
    }

    createRefsOnChildren(context: Deserializer, json: any) {
        let myJson: JsonOf<T>[] = json[this.referenceName];
        if(myJson && myJson.length == this._instance.length) {
            myJson.forEach((ref, index) => {
                this._instance[index].deserializeLinks(context, ref)
            })
        }
    }

}
