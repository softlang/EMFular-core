import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";
import {ListUpdater} from "../../../../utils/list-updater";

export class ReLinkListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReLinkContainer<T,P> {

    readonly _instance: T[] = [];

    constructor(parent: P, name: string, inverse?: string) {
        super(parent, name, inverse);
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

    override remove(item: T): boolean {
        const res =  ListUpdater.removeFromList(item, this._instance)
        if (res) {
            if(this.inverseName !== undefined) {
                item.removeFromReferencableContainer(this.inverseName, this._parent)
            }
        }
        return res; //todo behaviour of flag different to add??
    }

    override delete() {
        ListUpdater.destructAllFromChangingList(this._instance)
    }

    override removeFromInverse(item: T): boolean {
        if(this.inverseName !== undefined) {
            for (const child of this._instance) {
                child.removeFromReferencableContainer(this.inverseName, item)
            }
            return true; // todo - refine?
        }
        return false;
    }

}
