import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";
import {ListUpdater} from "../../../../utils/list-updater";
import {ReListContainer} from "../re-list-container";
import {ReferenceMeta} from "../../../../binding/model-definition";
import {DeletionMode} from "../../../../utils/deletion-mode";
import {REFERENCE_INTERNAL_API} from "../../referencable-symbols";

export class ReLinkListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReListContainer<T,P>
implements ReLinkContainer<T, P> {

    constructor(parent: P, name: string, refMeta: ReferenceMeta) {
        super(parent, name, refMeta);
        this._parent[REFERENCE_INTERNAL_API].otherLinks().push(this)
    }

    addWithoutTypeCheck(item: T): boolean {
        let res = ListUpdater.addToListIfMissing(item, this._instance)
        if (res) {
            if(this.inverseName !== undefined) {
                return item[REFERENCE_INTERNAL_API].addToReference(this.inverseName, this._parent)
            }
            return true;
        } else {
            return false;
        }
    }

    override toJson(ctx: SerializationContext): Ref[] {
        return this._instance.map(i => ctx.get(i))
    }

    override remove(item: T, mode: DeletionMode = DeletionMode.RELAXED): boolean {
        const res =  ListUpdater.removeFromList(item, this._instance)
        if (res) {
            if(this.inverseName !== undefined) {
                item[REFERENCE_INTERNAL_API].removeFromReference(this.inverseName, this._parent, mode)
            }
        }
        return res; //todo behaviour of flag different to add??
    }

    removeFromInverse(item: T, mode: DeletionMode = DeletionMode.RELAXED): boolean {
        if(this.inverseName !== undefined) {
            for (const child of [...this._instance]) {
                child[REFERENCE_INTERNAL_API].removeFromReference(this.inverseName, item, mode)
            }
            return true; // todo - refine?
        }
        return false;
    }

}
