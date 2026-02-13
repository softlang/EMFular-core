import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ListUpdater} from "../../../utils/list-updater";

export abstract class ReListContainer<T extends Referencable, P extends Referencable> extends ReContainer<T, P> {

    readonly _instance: T[] = [];

    protected constructor(parent: P, name: string, inverse?: string) {
        super(parent, name, inverse);
        this._instance = []
    }

    add(item: T): boolean {
        let res = this.addIfMissing(item)
        if (res) {
            if(this.inverseName !== undefined) {
                return item.addToReferencableContainer(this.inverseName, this._parent)
            }
            return true;
        } else {
            return false;
        }
    }

    protected addIfMissing(item: T): boolean {
        const index = this._instance.indexOf(item);
        if(index > -1) {
            return false;
        } else {
            this._instance.push(item);
            return true;
        }
    }

    get(): T[] {
        return this._instance;
    }

    remove(item: T): boolean {
        const res = this.removeIfThere(item);
        if (res) {
            if(this.inverseName !== undefined) {
                item.removeFromReferencableContainer(this.inverseName, this._parent)
            }
        }
        return res; //todo behaviour of flag different to add??
    }

    protected removeIfThere(item: T): boolean {
        const index = this._instance.indexOf(item)
        if(index > -1) {
            this._instance.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    override delete() {
        ListUpdater.destructAllFromChangingList(this._instance)
    }

    removeFromInverse(item: T): boolean {
        if(this.inverseName !== undefined) {
            for (const child of this._instance) {
                child.removeFromReferencableContainer(this.inverseName, item)
            }
            return true; // todo - refine?
        }
        return false;
    }

}
