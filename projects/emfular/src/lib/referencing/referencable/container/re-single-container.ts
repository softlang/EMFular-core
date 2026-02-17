import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {Deserializer} from "../../../serialization/deserializer";
import {JsonOf} from "../../../serialization/json-deserializable";

export abstract class ReSingleContainer<T extends Referencable<any>, P extends Referencable<any>> extends ReContainer<T,P> {

    _instance?: T

    protected constructor(parent: P, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
    }

    get(): T | undefined {
        return this._instance;
    }

    protected set(instance: T): void {
        if(this.inverseName !== undefined) {
            this._instance?.removeFromReferencableContainer(this.inverseName, this._parent)
            this._instance = instance;
            instance.addToReferencableContainer(this.inverseName, this._parent)
        } else {
            this._instance = instance;
        }
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

    createRefsOnChildren(context: Deserializer, json: any) {
        let myJson: JsonOf<T> = json[this.referenceName];
        if(this._instance && myJson ) {
            this._instance.deserializeLinks(context, myJson)
        }
    }

}
