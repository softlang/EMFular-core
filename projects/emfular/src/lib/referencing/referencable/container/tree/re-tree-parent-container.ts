import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";
import {Ref} from "../../../ref/ref";

export class ReTreeParentContainer<T extends Referencable> extends ReSingleContainer<T> {

    constructor(parent: Referencable, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
    }

    override toJson(): Ref | undefined {
        return this._instance?.getRef()
    }

}
