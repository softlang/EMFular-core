import {Referencable} from "./referenceable";
import {ReferencableContainer} from "./referencable-container";
import {RefHandler} from "../ref/ref-handler";

export class ReferencableListContainer<T extends Referencable> extends ReferencableContainer<T> {

    readonly _instance: T[] = [];

    constructor(parent: Referencable, name: string, inverse?: string) {
        super(parent, name, inverse);
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
                return item.removeFromReferencableContainer(this.inverseName, this._parent)
            }
            return true;
        }
        return false;
    }

}
