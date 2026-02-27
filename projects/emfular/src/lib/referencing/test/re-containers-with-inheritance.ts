import { ModelDefinition } from "../../binding/model-definition";
import { Referencable } from "../referencable/referenceable";
import { eClass } from "../../binding/eclass-decorator";
import { reference } from "../../binding/reference-decorator";
import {ModelList} from "../referencable/container/hide/model-list";

export const ModelInheritance: ModelDefinition = {
    name: "ModelInheritance",
    prefix: "inh",
    uri: "inh://",
    classes: {
        InheritanceRoot: {
            references: {
                children: {
                    target: "AbstractBase",
                    containment: true,
                    min: 0,
                    max: -1
                }
            }
        },
        AbstractBase: {
            references: {
                myParent: {
                    target: "InheritanceRoot",
                    isParent: true,
                    max: 1,
                    opposite: 'children',
                }
            }
        },

        A: {
            references: {}
        },

        B: {
            references: {}
        },
    }
} as const;

@eClass(ModelInheritance, "InheritanceRoot")
export class InheritanceRoot extends Referencable<any> {

    constructor() {
        super();
    }

    @reference(ModelInheritance.classes["InheritanceRoot"].references["children"])
    declare children: ModelList<AbstractBase>;
}

@eClass(ModelInheritance, "AbstractBase")
export abstract class AbstractBase extends Referencable<InheritanceRoot> {

    protected constructor() {
        super();
    }

    @reference(ModelInheritance.classes["AbstractBase"].references["myParent"])
    declare myParent: InheritanceRoot | undefined;
}

@eClass(ModelInheritance, "A")
export class A extends AbstractBase {
    constructor() {
        super();
    }
}

@eClass(ModelInheritance, "B")
export class B extends AbstractBase {
    constructor() {
        super();
    }
}

