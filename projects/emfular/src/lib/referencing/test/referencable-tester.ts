import {Referencable} from "../referencable/referenceable";
import {eClass} from "../../binding/eclass-decorator";

@eClass("ReferencableTester")
export class ReferencableTester extends Referencable {
    constructor() {
        super();
    }
}
