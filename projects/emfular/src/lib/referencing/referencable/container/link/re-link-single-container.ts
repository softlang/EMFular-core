import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";

export class ReLinkSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReSingleContainer<T,P>
    implements ReLinkContainer<T,P> {

    constructor(parent: P, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
        this._parent.$otherReferences.push(this)
    }

    override toJson(ctx: SerializationContext): Ref|undefined {
        if (this._instance)
            return ctx.get(this._instance)
        else return undefined
    }

}
