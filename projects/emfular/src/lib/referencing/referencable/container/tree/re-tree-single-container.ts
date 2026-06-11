import {Referencable} from "../../referenceable";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../serialization/deserializer";
import {JsonOf} from "../../../../serialization/json-typing";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReTreeChildrenContainer} from "./re-tree-children-container";
import {ReSingleContainer} from "../re-single-container";
import {ReferenceMeta} from "../../../../binding/model-definition";
import {DeletionMode} from "../../../../utils/deletion-mode";
import {REFERENCE_INTERNAL_API} from "../../referencable-symbols";

export class ReTreeSingleContainer<
    T extends Referencable<P>,
    P extends Referencable<any> =T["$ParentType"]
> extends ReSingleContainer<T, P, "tree">
implements ReTreeChildrenContainer<T> {

    readonly defaultEClass?: string;

    constructor(parent: P, referenceName: string,  refMeta: ReferenceMeta, eClass?: string) {
        super(parent, referenceName, refMeta);
        this.defaultEClass = eClass;
        this._parent[REFERENCE_INTERNAL_API].treeChildren().push(this)
    }

    assignRefs(ctx: SerializationContext, path: string) {
        this._instance?.[REFERENCE_INTERNAL_API].serialize_assignRefs(ctx, RefHandler.computePrefix(path, this.referenceName))
    }

    toJson(ctx: SerializationContext): JsonOf<T>|undefined {
        return this._instance?.toJson(ctx)
    }

    addWithoutTypeCheck(item: T): boolean {
        if(item == this._instance) {
            return false;
        } else {
            item[REFERENCE_INTERNAL_API].setParentContainer(this);
            this._instance = item;
            return true;
        }
    }

    remove(item: T, mode: DeletionMode = DeletionMode.RELAXED): boolean {
        if(this._instance == item) {
            if (mode === DeletionMode.RELAXED) {
                this._instance = undefined;
                item[REFERENCE_INTERNAL_API].setParentContainer(undefined);
                return true;
            }
            // if remove is called on an items parent the CASCADE mode would cause an infinite loop,
            // however this can be easily avoided since parent removal does not require any kind of following cascading deletes
            this._instance?.$destruct(mode);
            return true;
        }
        return false;
    }

    delete(mode: DeletionMode = DeletionMode.RELAXED) {
        if (mode === DeletionMode.CASCADE) {
            this._instance?.$destruct(mode)
        } else if (mode === DeletionMode.RELAXED) {
            this._instance?.[REFERENCE_INTERNAL_API].getParentContainer()?.remove(this._instance, mode)
        }
    }

    fromJson(formerPrefix: string, context: Deserializer, json: any) {
        let myJson: JsonOf<T> = json[this.referenceName]
        if (myJson) {
            let eClass = Deserializer.getEClass(myJson, this.defaultEClass);
            if (!eClass){
                eClass = this.defaultEClass
                if(!eClass){
                    throw new Error("Cannot determine eClass for "+formerPrefix)
                }
            }
            let refStr = RefHandler.computePrefix(formerPrefix, this.referenceName)
            let ref = RefHandler.createRef(refStr, eClass)
            this.add(context.createTreeBackbone<T>(ref, myJson))
        }
    }

    createRefsOnChildren(context: Deserializer, json: any) {
        let myJson: JsonOf<T> = json[this.referenceName];
        if(this._instance && myJson ) {
            this._instance[REFERENCE_INTERNAL_API].deserializeOtherReferences(context, myJson)
        }
    }
}
