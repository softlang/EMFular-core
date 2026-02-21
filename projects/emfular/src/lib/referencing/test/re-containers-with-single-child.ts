import {Referencable} from "../referencable/referenceable";
import {eClass, eClass2} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {ReTreeSingleContainer} from "../referencable/container/tree/re-tree-single-container";
import {ReLinkSingleContainer} from "../referencable/container/link/re-link-single-container";
import {ReTreeParentContainer} from "../referencable/container/tree/re-tree-parent-container";
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
        }
    }
} as const;

// Generated ergonomic reference accessors
export const ReContainersWithSingleChildRefs = {
    child: ModelSingleChild.classes["ReContainersWithSingleChild"].references["child"],
    link: ModelSingleChild.classes["ReContainersWithSingleChild"].references["link"]
};

export const ReSingleChildExampleRefs = {
    myParent: ModelSingleChild.classes["ReSingleChildExample"].references["myParent"],
    otherLink: ModelSingleChild.classes["ReSingleChildExample"].references["otherLink"]
};

export enum EClassesSingleChild {
    'ReContainersWithSingleChild' = 'class://ReContainersWithSingleChild',
    'ReSingleChildExample' = 'class://ReSingleChildExample'
}

@eClass2(ModelSingleChild)
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

@eClass2(ModelSingleChild)
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
