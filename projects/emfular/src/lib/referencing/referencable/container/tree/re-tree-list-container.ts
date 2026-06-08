import {Referencable} from "../../referenceable";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../serialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReTreeChildrenContainer} from "./re-tree-children-container";
import {ListUpdater} from "../../../../utils/list-updater";
import {DeletionMode} from "../../../../utils/deletion-mode";
import {ReListContainer} from "../re-list-container";
import {ReferenceMeta} from "../../../../binding/model-definition";
import {REFERENCE_INTERNAL_API} from "../../referencable-symbols";


export class ReTreeListContainer<
    T extends Referencable<P>,
    P extends Referencable<any> =T["$ParentType"]
> extends ReListContainer<T, P, "tree">

implements ReTreeChildrenContainer<T> {

    readonly defaultEClass?: string;

    constructor(parent: P, name: string,  refMeta: ReferenceMeta, eClass?: string) {
        super(parent, name, refMeta);
        this.defaultEClass = eClass;
        this._parent[REFERENCE_INTERNAL_API].treeChildren().push(this)
    }

    assignRefs(ctx: SerializationContext, path: string) {
        const ownPath = RefHandler.computePrefix(path, this.referenceName)
        this._instance.map((elem, index) =>
            elem[REFERENCE_INTERNAL_API].serialize_assignRefs(ctx, RefHandler.mixWithIndex(ownPath, index))
        )
    }

    override toJson(ctx: SerializationContext): JsonOf<T>[] {
        return this._instance.map(
            (ref: T) => ref.toJson(ctx)
        )
    }

    //todo rewrite without using item parent explicitly?
    addWithoutTypeCheck(item: T): boolean {
        const oldParent = item[REFERENCE_INTERNAL_API].getParentContainer();
        if(oldParent == this) {
            return false;
        } else {
            item[REFERENCE_INTERNAL_API].setParentContainer(this);
            oldParent?.remove(item)
            return ListUpdater.addToListIfMissing(item, this._instance)
        }
    }

    override remove(item: T, mode: DeletionMode = DeletionMode.RELAXED): boolean {
        if (mode === DeletionMode.CASCADE) {
            if (this._instance.indexOf(item) > -1) {
                // if remove is called on an items parent the CASCADE mode would cause an infinite loop,
                // however this can be easily avoided since parent removal does not require any kind of following cascading deletes
                item.$destruct(mode);
                return true;
            }
            return false;
        }
        let removed =  ListUpdater.removeFromList(item, this._instance)
        if(removed){
            item[REFERENCE_INTERNAL_API].setParentContainer(undefined);
            return true
        }
        return false;
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
                this._instance[index][REFERENCE_INTERNAL_API].deserializeOtherReferences(context, ref)
            })
        }
    }

}
