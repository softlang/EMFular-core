import {Referencable} from "../referencable/referenceable";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-typing";
import {Deserializer} from "../../serialization/deserializer";
import {ModelDefinition} from "../../binding/model-definition";
import {reference} from "../../binding/reference-decorator";
import {SingleRefI} from "../../binding/proxy/single-ref";


export const ModelSingleChild = {
    name: "ModelSingleChild",
    prefix: "class",
    uri:"class://",
    classes: {
        ReContainersWithSingleChild: {
            references: {
                child: {
                    target: "ReSingleChildExample",
                    containment: true,
                    opposite: "myParent",
                    max: 1,
                    kind: "tree"
                },
                link: {
                    target: "ReSingleChildExample",
                    opposite: "otherLink",
                    max: 1,
                    kind: "link"
                }
            }
        },
        ReContainersWithSingleChild2: {
            references: {
                child: {
                    target: "ReSingleChildExample2",
                    containment: true,
                    opposite: "myParent",
                    max: 1,
                    kind: "tree"
                },
                link: {
                    target: "ReSingleChildExample2",
                    opposite: "otherLink",
                    max: 1,
                    kind: "link"
                }
            }
        },

        ReSingleChildExample: {
            references: {
                myParent: {
                    target: "ReContainersWithSingleChild",
                    isParent: true,
                    opposite: "child",
                    max: 1,
                    kind: "none"
                },
                otherLink: {
                    target: "ReContainersWithSingleChild",
                    opposite: "link",
                    max: 1,
                    kind: "link"
                }
            }
        },

        ReSingleChildExample2: {
            references: {
                myParent: {
                    target: "ReContainersWithSingleChild2",
                    isParent: true,
                    opposite: "child",
                    max: 1,
                    kind: "none",
                },
                otherLink: {
                    target: "ReContainersWithSingleChild2",
                    opposite: "link",
                    min: 1,
                    max: 1,
                    kind: "link"
                }
            }
        }
    }
} as const satisfies ModelDefinition;

// Generated ergonomic reference accessors
export const ReContainersWithSingleChildRefs = {
    child: ModelSingleChild.classes["ReContainersWithSingleChild"].references["child"],
    link: ModelSingleChild.classes["ReContainersWithSingleChild"].references["link"]
};

export const ReContainersWithSingleChild2Refs = {
    child: ModelSingleChild.classes["ReContainersWithSingleChild2"].references["child"],
    link: ModelSingleChild.classes["ReContainersWithSingleChild2"].references["link"]
};

export const ReSingleChildExampleRefs = {
    myParent: ModelSingleChild.classes["ReSingleChildExample"].references["myParent"],
    otherLink: ModelSingleChild.classes["ReSingleChildExample"].references["otherLink"]
};

export const ReSingleChildExample2Refs = {
    myParent: ModelSingleChild.classes["ReSingleChildExample2"].references["myParent"],
    otherLink: ModelSingleChild.classes["ReSingleChildExample2"].references["otherLink"]
};

export enum EClassesSingleChild {
    'ReContainersWithSingleChild' = 'class://ReContainersWithSingleChild',
    'ReContainersWithSingleChild2' = 'class://ReContainersWithSingleChild2',
    'ReSingleChildExample' = 'class://ReSingleChildExample',
    'ReSingleChildExample2' = 'class://ReSingleChildExample2'
}

@eClass(ModelSingleChild, "ReContainersWithSingleChild")
export class ReContainersWithSingleChild extends Referencable<any> {

    @reference(ReContainersWithSingleChildRefs.child)
    declare child: SingleRefI<ReSingleChildExample, typeof ReContainersWithSingleChildRefs.child.kind>;

    @reference(ReContainersWithSingleChildRefs.link)
    declare link: SingleRefI<ReSingleChildExample, typeof ReContainersWithSingleChildRefs.link.kind>;

    @attribute()
    name: string = "re1";

    constructor() {
        super();
    }

    static fromJSON (convJson: JsonOf<ReContainersWithSingleChild>): ReContainersWithSingleChild {
        return Deserializer.fromJSON<ReContainersWithSingleChild>(
            convJson,
            EClassesSingleChild.ReContainersWithSingleChild
        )
    }

}

@eClass(ModelSingleChild, "ReContainersWithSingleChild2")
export class ReContainersWithSingleChild2 extends Referencable<any> {

    @reference(ReContainersWithSingleChild2Refs.child)
    declare child: SingleRefI<ReSingleChildExample2, typeof ReContainersWithSingleChildRefs.child.kind>;

    @reference(ReContainersWithSingleChild2Refs.link)
    declare link: SingleRefI<ReSingleChildExample2 , typeof ReContainersWithSingleChildRefs.link.kind>;

    @attribute()
    name: string = "re1";

    constructor() {
        super();
    }

    static fromJSON (convJson: JsonOf<ReContainersWithSingleChild2>): ReContainersWithSingleChild2 {
        return Deserializer.fromJSON<ReContainersWithSingleChild2>(
            convJson,
            EClassesSingleChild.ReContainersWithSingleChild2
        )
    }

}

@eClass(ModelSingleChild, "ReSingleChildExample")
export class ReSingleChildExample extends Referencable<ReContainersWithSingleChild> {

    @reference(ReSingleChildExampleRefs.myParent)
    declare myParent: SingleRefI<ReContainersWithSingleChild, typeof ReSingleChildExampleRefs.myParent.kind>;

    @reference(ReSingleChildExampleRefs.otherLink)
    declare otherLink: SingleRefI<ReContainersWithSingleChild, typeof ReSingleChildExampleRefs.otherLink.kind>;

    @attribute()
    myBool = true;

    constructor() {
        super();
    }
}

@eClass(ModelSingleChild, "ReSingleChildExample2")
export class ReSingleChildExample2 extends Referencable<ReContainersWithSingleChild2> {

    @reference(ReSingleChildExample2Refs.myParent)
    declare myParent: SingleRefI<ReContainersWithSingleChild2, typeof ReSingleChildExample2Refs.myParent.kind>;

    @reference(ReSingleChildExample2Refs.otherLink)
    declare otherLink: SingleRefI<ReContainersWithSingleChild2, typeof ReSingleChildExample2Refs.otherLink.kind>;

    @attribute()
    myBool = true;

    constructor() {
        super();
    }
}