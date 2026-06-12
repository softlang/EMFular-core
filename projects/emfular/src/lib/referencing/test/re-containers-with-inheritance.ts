import { ModelDefinition } from "../../binding/model-definition";
import { Referencable } from "../referencable/referenceable";
import { eClass } from "../../binding/eclass-decorator";
import { reference } from "../../binding/reference-decorator";
import {ModelList} from "../../binding/proxy/model-list";
import {SingleRefI} from "../../binding/proxy/single-ref";

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
                    max: -1,
                    kind: "tree"
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
                    kind: "link"
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

export const ModelInheritanceRefs = {
    children: ModelInheritance.classes["InheritanceRoot"].references["children"]
}

export const AbstractBaseRefs = {
    myParent: ModelInheritance.classes["AbstractBase"].references["myParent"]
}

@eClass(ModelInheritance, "InheritanceRoot")
export class InheritanceRoot extends Referencable<any> {

    constructor() {
        super();
    }

    @reference(ModelInheritanceRefs.children)
    declare children: ModelList<AbstractBase, typeof ModelInheritanceRefs.children.kind>;
}

@eClass(ModelInheritance, "AbstractBase")
export abstract class AbstractBase extends Referencable<InheritanceRoot> {

    protected constructor() {
        super();
    }

    @reference(AbstractBaseRefs.myParent)
    declare myParent: SingleRefI<InheritanceRoot, typeof AbstractBaseRefs.myParent.kind>;
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

