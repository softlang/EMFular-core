import {Referencable} from "./referenceable";
import {ReContainer} from "./re-container";

export class ReSingleContainer<T extends Referencable> extends ReContainer<T> {

    _instance?: T

    constructor(parent: Referencable, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
    }

    get(): T | undefined {
        return this._instance;
    }

    override toJson(): any {
        return this._instance?.getRef()
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

    override delete() {
        this._instance?.destruct()
    }

    removeFromInverse(item: T): boolean {
        if(this.inverseName !== undefined) {
            this._instance?.removeFromReferencableContainer(this.inverseName, item)
            return true; // todo refine?
        }
        return false;
    }

}
