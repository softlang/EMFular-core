import {Referencable} from "../referencable/referenceable";
import {eClass2} from "../../binding/eclass-decorator";
import {ModelDefinition} from "../../binding/model-definition";


const modelDef= {
     name: "", prefix: "", uri: "",
    classes: {
         ReferencableTester: {
            references: {}
         }
     }
}  as const satisfies ModelDefinition;

@eClass2(modelDef)
export class ReferencableTester extends Referencable<any> {
    constructor() {
        super();
    }
}
