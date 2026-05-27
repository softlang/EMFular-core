import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReContainer} from "../re-container";
import {ReSingleInterface} from "../re-single-interface";
import {ReShallowInterface} from "./re-shallow-interface";
import {ReferenceMeta} from "../../../../binding/model-definition";
import { DeletionMode } from "../../../../utils/deletion-mode";
import {SingleRef} from "../../../../binding/proxy/single-ref";
import {createSingleRefProxy} from "../../../../binding/proxy/single-proxy";

export class ReTreeParentContainer<T extends Referencable<any>>
    extends ReContainer<T["ParentType"],T>
implements ReSingleInterface<T["ParentType"], T, "none">,
    ReShallowInterface<T["ParentType"], T>{

    private _proxy?: SingleRef<T, "none">;

    constructor(parent: T, referenceName: string,  refMeta: ReferenceMeta) {
        super(parent, referenceName, refMeta); // referenceName is actually unused for this container type
    }

    get(): T["ParentType"] | undefined {
        return (this._parent.getParentReferencable() as T["ParentType"])
    }

    get proxy(): SingleRef<T, "none"> {
        if (!this._proxy) {
            this._proxy = createSingleRefProxy(this);
        }
        return this._proxy;
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

    remove(item: T["ParentType"], mode: DeletionMode = DeletionMode.RELAXED): boolean {
        return item.removeFromReferencableContainer(this.inverseName, this._parent, mode)
    }

    delete(): void {}

    toJson(_: SerializationContext):  undefined {
        return undefined
    }

}
