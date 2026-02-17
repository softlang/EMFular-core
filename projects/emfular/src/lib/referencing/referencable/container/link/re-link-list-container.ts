import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {ReListContainer} from "../re-list-container";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";

export class ReLinkListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReListContainer<T,P>
    implements ReLinkContainer<T,P> {

    constructor(parent: P, name: string, inverse?: string) {
        super(parent, name, inverse);
        this._parent.$otherReferences.push(this)
    }

    override toJson(ctx: SerializationContext): Ref[] {
        return this._instance.map(i => ctx.get(i))
    }

}
