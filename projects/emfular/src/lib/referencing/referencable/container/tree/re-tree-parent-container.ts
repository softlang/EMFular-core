import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReContainer} from "../re-container";
import { DeletionMode } from "../../../../utils/deletion-mode";

export class ReTreeParentContainer<T extends Referencable<any>>
    extends ReContainer<T["ParentType"],T> {

    inverseName: string;

    constructor(parent: T, referenceName: string, isRequired: boolean, inverseName: string) {
        super(parent, referenceName, isRequired); // referenceName is actually unused for this container type
        this.inverseName = inverseName;
    }

    get(): T["ParentType"] | undefined {
        return (this._parent.getParentReferencable() as T["ParentType"])
    }

    //todo rewrite without using item parent explicitly?
    add(item: T["ParentType"]): boolean {
        let me: T = this._parent
        const currentParentCont = this._parent.parent
        if(currentParentCont != undefined) {
            currentParentCont.remove(this._parent as T["ParentType"], DeletionMode.RELAXED)
        }
        return item.addToReferencableContainer(this.inverseName, me)
    }

    remove(item: T["ParentType"], mode: DeletionMode): boolean {
        return item.removeFromReferencableContainer(this.inverseName, this._parent, mode)
    }

    delete(): void {}

    toJson(_: SerializationContext):  undefined {
        return undefined
    }

}
