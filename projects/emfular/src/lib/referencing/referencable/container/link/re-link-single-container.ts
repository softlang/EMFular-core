import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";

export class ReLinkSingleContainer<T extends Referencable, Tname extends string>
    extends ReSingleContainer<T, Tname>
    implements ReLinkContainer<T, Tname> {

    constructor(parent: Referencable, referenceName: Tname, inverseName?: string ) {
        super(parent, referenceName, inverseName);
        this._parent.$otherReferences.push(this)
    }

    override toJson(ctx: SerializationContext): Ref|undefined {
        if (this._instance)
            return ctx.get(this._instance)
        else return undefined
    }

}
