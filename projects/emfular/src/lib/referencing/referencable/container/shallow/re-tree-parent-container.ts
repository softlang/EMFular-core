import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReContainer} from "../re-container";
import {ReSingleInterface} from "../re-single-interface";
import {ReShallowInterface} from "./re-shallow-interface";
import {ReferenceMeta} from "../../../../binding/model-definition";
import { DeletionMode } from "../../../../utils/deletion-mode";
import {ADD_TO_REFERENCE, REMOVE_FROM_REFERENCE} from "../../referencable-symbols";

export class ReTreeParentContainer<
    T extends Referencable<any>,
    P extends Referencable<T> = T["$ParentType"]>
    extends ReContainer<P,T>
implements ReSingleInterface<P, T>,
    ReShallowInterface<P, T>{

    constructor(parent: T, referenceName: string,  refMeta: ReferenceMeta) {
        super(parent, referenceName, refMeta); // referenceName is actually unused for this container type
    }

    get(): P | undefined {
        return (this._parent.$getParentReferencable())
    }

    //todo rewrite without using item parent explicitly?
    addWithoutTypeCheck(item: P): boolean {
        return item[ADD_TO_REFERENCE](this.inverseName!, this._parent)
    }

    remove(item: P, mode: DeletionMode = DeletionMode.RELAXED): boolean {
        return item[REMOVE_FROM_REFERENCE](this.inverseName!, this._parent, mode)
    }

    delete(): void {}

    toJson(_: SerializationContext):  undefined {
        return undefined
    }

}
