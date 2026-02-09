import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {ReListContainer} from "../re-list-container";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "./re-link-container";

export class ReLinkListContainer<T extends Referencable, Tname extends string>
    extends ReListContainer<T, Tname>
    implements ReLinkContainer<T, Tname> {

    constructor(parent: Referencable, name: Tname, inverse?: string) {
        super(parent, name, inverse);
        this._parent.$otherReferences.push(this)
    }

    override toJson(ctx: SerializationContext): Ref[] {
        return this._instance.map(i => ctx.get(i))
    }

}
