import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {Ref} from "../../../ref/ref";
import { DeletionMode } from "../../../../utils/deletion-mode";

export interface ReLinkContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P> {

    /*protected constructor(parent: P, referenceName: string, isRequired: boolean, inverseName?: string) {
        super(parent, referenceName, isRequired, inverseName);
        this._parent.$otherReferences.push(this)
    }*/

    removeFromInverse(item: T, mode?: DeletionMode): boolean;

    toJson(ctx: SerializationContext): Ref[] | Ref | undefined

    checkConstraints(): string | undefined;
}
