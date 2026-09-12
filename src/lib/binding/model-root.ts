import {Referencable} from "../referencing/referencable/referenceable";
import {ModelDefinition} from "./model-definition";

export abstract class ModelRoot extends Referencable<never> {
    static modelDefinition: ModelDefinition;

    protected constructor() {
        super();
    }
}
