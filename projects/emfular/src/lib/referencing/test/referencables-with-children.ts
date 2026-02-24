import {Referencable} from "../referencable/referenceable";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-deserializable";
import {ModelDefinition} from "../../binding/model-definition";
import {reference} from "../../binding/reference-decorator";
import {ModelList} from "../referencable/container/hide/model-list";

export const ModelWithChildren = {
    name: "namespace",
    prefix: "ns",
    uri: "namespace/",

    classes: {
        RootWithChildren: {
            references: {
                child2: {
                    target: "Middle2WithChildren",
                    containment: true,
                    min: 0,
                    max: -1
                },
                link3: {
                    target: "ReChild3",
                    opposite: "link1",
                    min: 0,
                    max: -1
                }
            }
        },

        Middle2WithChildren: {
            references: {
                child3: {
                    target: "ReChild3",
                    containment: true,
                    opposite: "parentPointer",
                    min: 0,
                    max: -1
                }
            }
        },

        ReChild3: {
            references: {
                link1: {
                    target: "RootWithChildren",
                    opposite: "link3",
                    min: 0,
                    max: -1
                },
                parentPointer: {
                    target: "Middle2WithChildren",
                    containment: true,
                    isParent: true,
                    opposite: "child3",
                    min: 0,
                    max: 1
                }
            }
        }
    }
} as const satisfies ModelDefinition;

export const RootWithChildrenRefs = {
    child2: ModelWithChildren.classes["RootWithChildren"].references["child2"],
    link3: ModelWithChildren.classes["RootWithChildren"].references["link3"],
} as const;
export const Middle2WithChildrenRefs = {
    child3: ModelWithChildren.classes["Middle2WithChildren"].references["child3"],
} as const;
export const ReChild3Refs = {
    link1: ModelWithChildren.classes["ReChild3"].references["link1"],
    parentPointer: ModelWithChildren.classes["ReChild3"].references["parentPointer"],
} as const;

export enum EClasses {
    'RootWithChildren' = 'namespace/RootWithChildren',
    'Middle2WithChildren' = 'namespace/Middle2WithChildren',
    'ReChild3' = 'namespace/ReChild3'
}

@eClass(ModelWithChildren)
export class RootWithChildren extends Referencable<any> {

    @reference(RootWithChildrenRefs.child2)
    declare child2: ModelList<Middle2WithChildren>
    @reference(RootWithChildrenRefs.link3)
    declare link3: ModelList<ReChild3>;

    @attribute()
    name: string = "referencable1";

    constructor() {
        super();
    }
}

@eClass(ModelWithChildren)
export class Middle2WithChildren extends Referencable<RootWithChildren> {
    
    @reference(Middle2WithChildrenRefs.child3)
    declare child3: ModelList<ReChild3>

    @attribute()
    name: string = "referencable2";

    constructor() {
        super();
    }
}

@eClass(ModelWithChildren)
export class ReChild3 extends Referencable<Middle2WithChildren> {
    @reference(ReChild3Refs.link1)
    declare link1: ModelList<RootWithChildren>

    @reference(ReChild3Refs.parentPointer)
    declare parentPointer?: Middle2WithChildren;

    @attribute()
    name: string = "referencable3";

    constructor() {
        super();
    }
}


export type RootWithChildrenJson = JsonOf<RootWithChildren>
export type Middle2WithChildrenJson = JsonOf<Middle2WithChildren>
export type ReChild3Json = JsonOf<ReChild3>

