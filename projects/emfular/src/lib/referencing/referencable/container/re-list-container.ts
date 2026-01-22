import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ListUpdater} from "../../../utils/list-updater";

export abstract class ReListContainer<T extends Referencable> extends ReContainer<T> {

    readonly _instance: T[];

    protected constructor(parent: Referencable, name: string, inverse?: string) {
        super(parent, name, inverse);
        this._instance = []
    }

    add(item: T): boolean {
        const index = this._instance.indexOf(item);
        if(index > -1) {
            return false;
        } else {
            this._instance.push(item);
            if(this.inverseName !== undefined) {
                return item.addToReferencableContainer(this.inverseName, this._parent)
            }
            return true;
        }
    }

    get(): T[] {
        return this._instance;
    }

    remove(item: T): boolean {
        const index = this._instance.indexOf(item)
        if(index > -1) {
            this._instance.splice(index, 1);
            if(this.inverseName !== undefined) {
                item.removeFromReferencableContainer(this.inverseName, this._parent)
            }
            return true;
        }
        return false;
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
