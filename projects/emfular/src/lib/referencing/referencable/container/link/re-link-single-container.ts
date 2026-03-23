import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";
import {ReSingleContainer} from "../re-single-container";
import {ReferenceMeta} from "../../../../binding/model-definition";
import { DeletionMode } from "../../../../utils/deletion-mode";

export class ReLinkSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReSingleContainer<T,P>
implements ReLinkContainer<T, P> {

    constructor(parent: P, referenceName: string, refMeta: ReferenceMeta) {
        super(parent, referenceName, refMeta);
        this._parent.$otherReferences.push(this)
    }

    protected set(instance: T): void {
        if(this.inverseName !== undefined) {
            this._instance?.removeFromReferencableContainer(this.inverseName, this._parent, DeletionMode.RELAXED)
            this._instance = instance;
            instance.addToReferencableContainer(this.inverseName, this._parent)
        } else {
            this._instance = instance;
        }
    }

    addWithoutTypeCheck(item: T): boolean {
        if (this._instance == item) {
            return false;
        } else {
            this.set(item);
            return true;
        }
    }

    remove(item: T, mode: DeletionMode = DeletionMode.RELAXED): boolean {
        if(this._instance == item) {
            if (this.inverseName != undefined) {
                item.removeFromReferencableContainer(this.inverseName, this._parent, mode)
            }
            this._instance = undefined;
            return true;
        } else {
            return false;
        }
    }

    override delete(mode: DeletionMode = DeletionMode.RELAXED) {
        this._instance?.destruct(mode)
    }

    removeFromInverse(item: T, mode: DeletionMode = DeletionMode.RELAXED): boolean {
        if(this.inverseName !== undefined) {
            this._instance?.removeFromReferencableContainer(this.inverseName, item, mode)
            return true; // todo refine?
        }
        return false;
    }

    override toJson(ctx: SerializationContext): Ref|undefined {
        if (this._instance)
            return ctx.get(this._instance)
        else return undefined
    }

}
