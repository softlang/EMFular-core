import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReContainer} from "../re-container";
import {ReSingleInterface} from "../re-single-interface";
import {ReShallowInterface} from "./re-shallow-interface";
import {ReferenceMeta} from "../../../../binding/model-definition";
import { DeletionMode } from "../../../../utils/deletion-mode";

export class ReTreeParentContainer<T extends Referencable<any>>
    extends ReContainer<T["ParentType"],T>
implements ReSingleInterface<T["ParentType"], T>,
    ReShallowInterface<T["ParentType"], T>{

    constructor(parent: T, referenceName: string,  refMeta: ReferenceMeta, isRequired: boolean) {
        super(parent, referenceName, refMeta, isRequired); // referenceName is actually unused for this container type
    }

    get(): T["ParentType"] | undefined {
        return (this._parent.getParentReferencable() as T["ParentType"])
    }

    //todo rewrite without using item parent explicitly?
    addWithoutTypeCheck(item: T["ParentType"]): boolean {
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
