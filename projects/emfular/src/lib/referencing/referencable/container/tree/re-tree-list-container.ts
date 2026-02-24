import {Referencable} from "../../referenceable";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../serialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReTreeChildrenContainer} from "./re-tree-children-container";
import {ListUpdater} from "../../../../utils/list-updater";
import { DeletionMode } from "../../../../utils/deletion-mode";

export class ReTreeListContainer<T extends Referencable<any>>
    extends ReTreeChildrenContainer<T> {

    readonly _instance: T[] = [];

    constructor(parent: T["ParentType"], name: string, _?: string, eClass?: string) {
        super(parent, name, eClass);
    }

    override get(): T[] {
        return this._instance;
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

    //todo rewrite without using item parent explicitly?
    override add(item: T): boolean {
        const oldParent = item.parent;
        if(oldParent == this) {
            return false;
        } else {
            item.setParent(this);
            oldParent?.remove(item, DeletionMode.RELAXED)
            return ListUpdater.addToListIfMissing(item, this._instance)
        }
    }

    override remove(item: T): boolean {
        let removed =  ListUpdater.removeFromList(item, this._instance)
        if(removed){
            item.setParent(undefined);
            return true
        }
        return false;
    }

    override delete(mode: DeletionMode) {
        ListUpdater.destructAllFromChangingList(this._instance, mode)
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
