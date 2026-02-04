import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";

export class ReLinkSingleContainer<T extends Referencable> extends ReSingleContainer<T> {

    constructor(parent: Referencable, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
        this._parent.$otherReferences.push(this)
    }

    override toJson(ctx: SerializationContext): Ref|undefined {
        if (this._instance)
            return ctx.get(this._instance)
        else return undefined
    }

}
