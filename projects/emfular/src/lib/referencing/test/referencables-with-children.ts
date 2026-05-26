import {Referencable} from "../referencable/referenceable";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-deserializable";
import {ModelDefinition} from "../../binding/model-definition";
import {reference} from "../../binding/reference-decorator";
import {ModelListFromMeta} from "../../binding/proxy/model-list";

export const ModelWithChildren: ModelDefinition = {
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
                },
                link4: {
                    target: "ReChild4",
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
                },
                child4: {
                    target: "ReChild4",
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
        },
        ReChild4: {
            references: {
                link1: {
                    target: "RootWithChildren",
                    opposite: "link4",
                    min: 1,
                    max: -1
                },
                parentPointer: {
                    target: "Middle2WithChildren",
                    containment: true,
                    isParent: true,
                    opposite: "child4",
                    min: 0,
                    max: 1
                }
            }
        }
    }
} as const;

export const RootWithChildrenRefs = {
    child2: ModelWithChildren.classes["RootWithChildren"].references["child2"],
    link3: ModelWithChildren.classes["RootWithChildren"].references["link3"],
    link4: ModelWithChildren.classes["RootWithChildren"].references["link4"]
} as const;
export const Middle2WithChildrenRefs = {
    child3: ModelWithChildren.classes["Middle2WithChildren"].references["child3"],
    child4: ModelWithChildren.classes["Middle2WithChildren"].references["child4"]
} as const;
export const ReChild3Refs = {
    link1: ModelWithChildren.classes["ReChild3"].references["link1"],
    parentPointer: ModelWithChildren.classes["ReChild3"].references["parentPointer"],
} as const;
export const ReChild4Refs = {
    link1: ModelWithChildren.classes["ReChild4"].references["link1"],
    parentPointer: ModelWithChildren.classes["ReChild4"].references["parentPointer"],
} as const;

export enum EClasses {
    'RootWithChildren' = 'namespace/RootWithChildren',
    'Middle2WithChildren' = 'namespace/Middle2WithChildren',
    'ReChild3' = 'namespace/ReChild3',
    'ReChild4' = 'namespace/ReChild4'
}

@eClass(ModelWithChildren, "RootWithChildren")
export class RootWithChildren extends Referencable<any> {

    @reference(RootWithChildrenRefs.child2)
    declare child2: ModelListFromMeta<Middle2WithChildren, typeof RootWithChildrenRefs.child2>
    @reference(RootWithChildrenRefs.link3)
    declare link3: ModelListFromMeta<ReChild3, typeof RootWithChildrenRefs.link3>;
    @reference(RootWithChildrenRefs.link4)
    declare link4: ModelListFromMeta<ReChild4, typeof RootWithChildrenRefs.link4>;

    @attribute()
    name: string = "referencable1";

    constructor() {
        super();
    }
}

@eClass(ModelWithChildren, "Middle2WithChildren")
export class Middle2WithChildren extends Referencable<RootWithChildren> {

    @reference(Middle2WithChildrenRefs.child3)
    declare child3: ModelListFromMeta<ReChild3, typeof Middle2WithChildrenRefs.child3>
    @reference(Middle2WithChildrenRefs.child4)
    declare child4: ModelListFromMeta<ReChild4, typeof Middle2WithChildrenRefs.child4>

    @attribute()
    name: string = "referencable2";

    constructor() {
        super();
    }
}

@eClass(ModelWithChildren, "ReChild3")
export class ReChild3 extends Referencable<Middle2WithChildren> {
    @reference(ReChild3Refs.link1)
    declare link1: ModelListFromMeta<RootWithChildren, typeof ReChild3Refs.link1>

    @reference(ReChild3Refs.parentPointer)
    declare parentPointer?: Middle2WithChildren;

    @attribute()
    name: string = "referencable3";

    constructor() {
        super();
    }
}

@eClass(ModelWithChildren, "ReChild4")
export class ReChild4 extends Referencable<Middle2WithChildren> {
    @reference(ReChild4Refs.link1)
    declare link1: ModelListFromMeta<RootWithChildren, typeof ReChild4Refs.link1>

    @reference(ReChild4Refs.parentPointer)
    declare parentPointer?: Middle2WithChildren;

    @attribute()
    name: string = "referencable4";

    constructor() {
        super();
    }
}


export type RootWithChildrenJson = JsonOf<RootWithChildren>
export type Middle2WithChildrenJson = JsonOf<Middle2WithChildren>
export type ReChild3Json = JsonOf<ReChild3>
export type ReChild4Json = JsonOf<ReChild4>

