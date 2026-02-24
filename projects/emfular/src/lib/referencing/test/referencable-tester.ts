import {Referencable} from "../referencable/referenceable";
import {eClass} from "../../binding/eclass-decorator";
import {ModelDefinition} from "../../binding/model-definition";


const modelDef= {
     name: "", prefix: "", uri: "",
    classes: {
         ReferencableTester: {
            references: {}
         }
     }
}  as const satisfies ModelDefinition;

@eClass(modelDef)
export class ReferencableTester extends Referencable<any> {
    constructor() {
        super();
    }
}
