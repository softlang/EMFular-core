import {Referencable} from "../../referenceable";
import {RefHandler} from "../../../ref/ref-handler";
import {Deserializer} from "../../../../serialization/deserializer";
import {JsonOf} from "../../../../serialization/json-deserializable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReTreeChildrenContainer} from "./re-tree-children-container";
import {ReSingleContainer} from "../re-single-container";
import {ReferenceMeta} from "../../../../binding/model-definition";
import { DeletionMode } from "../../../../utils/deletion-mode";

export class ReTreeSingleContainer<T extends Referencable<any>>
    extends ReSingleContainer<T, T["ParentType"]>
implements ReTreeChildrenContainer<T> {

    readonly defaultEClass?: string;

    constructor(parent: T["ParentType"], referenceName: string,  refMeta: ReferenceMeta, isRequired: boolean, eClass?: string) {
        super(parent, referenceName, refMeta, isRequired);
        this.defaultEClass = eClass;
        this._parent.$treeChildren.push(this)
    }

    assignRefs(ctx: SerializationContext, path: string) {
        this._instance?.assignRefs(ctx, RefHandler.computePrefix(path, this.referenceName))
    }

    toJson(ctx: SerializationContext): JsonOf<T>|undefined {
        return this._instance?.toJson(ctx)
    }

    addWithoutTypeCheck(item: T): boolean {
        if(item == this._instance) {
            return false;
        } else {
            item.setParent(this);
            this._instance = item;
            return true;
        }
    }

    remove(item: T): boolean {
        if(this._instance == item) {
            this._instance = undefined;
            item.setParent(undefined);
            return true;
        }
        return false;
    }

    delete(mode: DeletionMode) {
        if (mode === DeletionMode.CASCADE) {
            this._instance?.destruct(mode)
        } else if (mode === DeletionMode.RELAXED) {
            this._instance?.parent?.remove(this._instance, mode)
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
            this._instance.deserializeLinks(context, myJson)
        }
    }
}
