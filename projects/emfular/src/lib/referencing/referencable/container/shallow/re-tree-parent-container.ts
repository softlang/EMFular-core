import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReContainer} from "../re-container";
import {ReSingleInterface} from "../re-single-interface";
import {ReShallowInterface} from "./re-shallow-interface";
import {ReferenceMeta} from "../../../../binding/model-definition";
import {DeletionMode} from "../../../../utils/deletion-mode";
import {SingleRef} from "../../../../binding/proxy/single-ref";
import {createSingleRefProxy} from "../../../../binding/proxy/single-proxy";
import {REFERENCE_INTERNAL_API} from "../../referencable-symbols";

export class ReTreeParentContainer<
    T extends Referencable<any>,
    P extends Referencable<T> = T["$ParentType"]>
    extends ReContainer<P,T>
implements ReSingleInterface<P, T, "none">,
    ReShallowInterface<P, T>{

    private _proxy?: SingleRef<P, "none">;

    constructor(parent: T, referenceName: string,  refMeta: ReferenceMeta) {
        super(parent, referenceName, refMeta); // referenceName is actually unused for this container type
    }

    get(): P | undefined {
        return (this._parent.$getEParent())
    }

    get proxy(): SingleRef<P, "none"> {
        if (!this._proxy) {
            this._proxy = createSingleRefProxy<P,T,"none">(this);
        }
        return this._proxy;
    }

    //todo rewrite without using item parent explicitly?
    addWithoutTypeCheck(item: P): boolean {
        return item[REFERENCE_INTERNAL_API].addToReference(this.inverseName!, this._parent)
    }

    remove(item: P, mode: DeletionMode = DeletionMode.RELAXED): boolean {
        return item[REFERENCE_INTERNAL_API].removeFromReference(this.inverseName!, this._parent, mode)
    }

    delete(): void {}

    toJson(_: SerializationContext):  undefined {
        return undefined
    }

}
