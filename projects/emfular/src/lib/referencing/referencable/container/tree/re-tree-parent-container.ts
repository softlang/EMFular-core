import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "../link/re-link-container";
import {ReContainer} from "../re-container";

export class ReTreeParentContainer<T extends Referencable<any>>
    extends ReContainer<T["ParentType"],T>
    implements ReLinkContainer<T["ParentType"],T> {
    override removeFromInverse(item: T["ParentType"]): boolean {
        throw new Error("Method should never be called, but was with "+item);
    }
    override delete(): void {}

    override inverseName: string;

    constructor(parent: T, referenceName: string, inverseName: string ) {
        super(parent, referenceName, inverseName);
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
            currentParentCont.remove(this._parent as T["ParentType"])
        }
        return item.addToReferencableContainer(this.inverseName, me)
    }

    remove(item: T["ParentType"]): boolean {
        return item.removeFromReferencableContainer(this.inverseName, this._parent)
    }

    override toJson(_: SerializationContext):  undefined {
        return undefined
    }

}
