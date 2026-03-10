import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";
import {ListUpdater} from "../../../../utils/list-updater";
import { DeletionMode } from "../../../../utils/deletion-mode";

export class ReLinkListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReLinkContainer<T,P> {

    readonly _instance: T[] = [];

    constructor(parent: P, name: string, isRequired: boolean, inverse?: string) {
        super(parent, name, isRequired, inverse);
    }

    override get(): T[] {
        return this._instance;
    }

    add(item: T): boolean {
        let res = ListUpdater.addToListIfMissing(item, this._instance)
        if (res) {
            if(this.inverseName !== undefined) {
                return item.addToReferencableContainer(this.inverseName, this._parent)
            }
            return true;
        } else {
            return false;
        }
    }

    override toJson(ctx: SerializationContext): Ref[] {
        return this._instance.map(i => ctx.get(i))
    }

    override remove(item: T, mode: DeletionMode): boolean {
        const res =  ListUpdater.removeFromList(item, this._instance)
        if (res) {
            if(this.inverseName !== undefined) {
                item.removeFromReferencableContainer(this.inverseName, this._parent, mode)
            }
        }
        return res; //todo behaviour of flag different to add??
    }

    override delete(mode: DeletionMode) {
        ListUpdater.destructAllFromChangingList(this._instance, mode)
    }

    override removeFromInverse(item: T, mode: DeletionMode): boolean {
        if(this.inverseName !== undefined) {
            for (const child of [...this._instance]) {
                child.removeFromReferencableContainer(this.inverseName, item, mode)
            }
            return true; // todo - refine?
        }
        return false;
    }

}
