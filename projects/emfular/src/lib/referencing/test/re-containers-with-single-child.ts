import {Referencable} from "../referencable/referenceable";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-deserializable";
import {Deserializer} from "../../serialization/deserializer";
import {ModelDefinition} from "../../binding/model-definition";
import {reference} from "../../binding/reference-decorator";


export const ModelSingleChild: ModelDefinition = {
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
                    max: 1
                },
                link: {
                    target: "ReSingleChildExample",
                    opposite: "otherLink",
                    max: 1
                }
            }
        },
        ReContainersWithSingleChild2: {
            references: {
                child: {
                    target: "ReSingleChildExample2",
                    containment: true,
                    opposite: "myParent",
                    max: 1
                },
                link: {
                    target: "ReSingleChildExample2",
                    opposite: "otherLink",
                    max: 1
                }
            }
        },

        ReSingleChildExample: {
            references: {
                myParent: {
                    target: "ReContainersWithSingleChild",
                    isParent: true,
                    opposite: "child",
                    max: 1
                },
                otherLink: {
                    target: "ReContainersWithSingleChild",
                    opposite: "link",
                    max: 1
                }
            }
        },

        ReSingleChildExample2: {
            references: {
                myParent: {
                    target: "ReContainersWithSingleChild2",
                    isParent: true,
                    opposite: "child",
                    max: 1
                },
                otherLink: {
                    target: "ReContainersWithSingleChild2",
                    opposite: "link",
                    min: 1,
                    max: 1
                }
            }
        }
    }
} as const;

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
    declare child: ReSingleChildExample | undefined;

    @reference(ReContainersWithSingleChildRefs.link)
    declare link: ReSingleChildExample | undefined;

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
    declare child: ReSingleChildExample2 | undefined;

    @reference(ReContainersWithSingleChild2Refs.link)
    declare link: ReSingleChildExample2 | undefined;

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
    declare myParent: ReContainersWithSingleChild | undefined;

    @reference(ReSingleChildExampleRefs.otherLink)
    declare otherLink: ReContainersWithSingleChild | undefined;

    @attribute()
    myBool = true;

    constructor() {
        super();
    }
}

@eClass(ModelSingleChild, "ReSingleChildExample2")
export class ReSingleChildExample2 extends Referencable<ReContainersWithSingleChild2> {

    @reference(ReSingleChildExample2Refs.myParent)
    declare myParent: ReContainersWithSingleChild2 | undefined;

    @reference(ReSingleChildExample2Refs.otherLink)
    declare otherLink: ReContainersWithSingleChild2 | undefined;

    @attribute()
    myBool = true;

    constructor() {
        super();
    }
}
