import {Referencable} from "../referencable/referenceable";
import {Ref} from "../ref/ref";

export class ReferencableTester extends Referencable {
    constructor(ref: Ref) {
        super(ref);
    }

    override toJson(): any {
    }
}
