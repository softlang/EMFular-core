import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "../link/re-link-container";

export class ReTreeParentContainer<T extends Referencable> extends ReSingleContainer<T> implements ReLinkContainer<T> {

    constructor(parent: Referencable, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
        this._parent.$otherReferences.push(this)
    }

    //todo always undefined (as soon as we know the parent all the time)
    override toJson(ctx: SerializationContext): Ref | undefined {
        if (this._instance)
            return ctx.get(this._instance)
        else return undefined
    }

}
