import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {ReListContainer} from "../re-list-container";

export class ReLinkListContainer<T extends Referencable> extends ReListContainer<T> {

    constructor(parent: Referencable, name: string, inverse?: string) {
        super(parent, name, inverse);
    }

    override toJson(): Ref[] {
        return this._instance.map(i => i.getRef())
    }

}
