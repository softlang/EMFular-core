import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";
import { DeletionMode } from "../../../../utils/deletion-mode";

export class ReLinkSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReLinkContainer<T,P> {

    _instance?: T

    constructor(parent: P, referenceName: string, inverseName?: string ) {
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

    override delete(mode: DeletionMode) {
        this._instance?.destruct(mode)
    }

    removeFromInverse(item: T): boolean {
        if(this.inverseName !== undefined) {
            this._instance?.removeFromReferencableContainer(this.inverseName, item)
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
