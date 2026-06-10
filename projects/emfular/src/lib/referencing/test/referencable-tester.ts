import {Referencable} from "../referencable/referenceable";
import {eClass} from "../../binding/eclass-decorator";
import {ModelDefinition, ReferenceMeta} from "../../binding/model-definition";

export const refTesterRef = {
    references: {
        test: {
            target: "ReferencableTester",
            max: -1,
            kind: "none"
        } satisfies ReferenceMeta
    }
}

export const modelDef= {
    name: "", prefix: "", uri: "",
    classes: {
        ReferencableTester: refTesterRef
    }
}  as const satisfies ModelDefinition;

@eClass(modelDef, "ReferencableTester")
export class ReferencableTester extends Referencable<any> {
    constructor() {
        super();
    }
}
