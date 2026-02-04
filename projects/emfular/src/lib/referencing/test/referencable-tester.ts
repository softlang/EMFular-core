import {Referencable} from "../referencable/referenceable";
import {Ref} from "../ref/ref";
import {RefHandler} from "../ref/ref-handler";
import {eClass} from "../../binding/eclass-decorator";

@eClass("ReferencableTester")
export class ReferencableTester extends Referencable {
    constructor(ref?: Ref) {
        const refDef = RefHandler.createRefIfMissing("testEclass", ref)
        super(refDef);
    }
}
