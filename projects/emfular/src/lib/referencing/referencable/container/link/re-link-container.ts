import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {Ref} from "../../../ref/ref";

export interface ReLinkContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P> {

    /*protected constructor(parent: P, referenceName: string, inverseName?: string) {
        super(parent, referenceName, inverseName);
        this._parent.$otherReferences.push(this)
    }*/

    removeFromInverse(item: T): boolean;

    toJson(ctx: SerializationContext): Ref[] | Ref | undefined
}
