import {Referencable} from "./referenceable";
import {ReferencableContainer} from "./referencable-container";

export class ReferencableSingletonContainer<T extends Referencable> extends ReferencableContainer<T> {

    _instance?: T

    constructor(parent: Referencable, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
    }

    get(): T | undefined {
        return this._instance;
    }

    private set(instance: T): void {
        if(this.inverseName !== undefined) {
            this._instance?.removeFromReferencableContainer(this.inverseName, this._parent)
            instance.addToReferencableContainer(this.inverseName, this._parent)
        }
        this._instance = instance;
    }

    add(item: T): boolean {
        if (this._instance == item) {
            return false;
        } else {
            this.set(item);
            return true;
        }
    }

    remove(item: T): boolean {
        if(this._instance == item) {
            if (this.inverseName != undefined) {
                item.removeFromReferencableContainer(this.inverseName, this._parent)
            }
            this._instance = undefined;
            return true;
        } else {
            return false;
        }
    }

}
