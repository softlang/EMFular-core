import {ModelDefinition} from "../../binding/model-definition";
import {eClass} from "../../binding/eclass-decorator";
import {Referencable} from "../referencable/referenceable";
import {reference} from "../../binding/reference-decorator";
import {ModelList} from "../referencable/container/hide/model-list";
import {JsonOf} from "../../serialization/json-deserializable";

export const CircularContainmentsList: ModelDefinition = {
    name: "CircularContainmentsList",
    prefix: "ccl",
    uri: "ccl://",
    classes: {
        RootA: {
            references: {
                childB: {
                    target: "RootB",
                    containment: true,
                    min: 0,
                    max: -1
                }
            }
        },
        RootB: {
            references: {
                childA: {
                    target: "RootA",
                    containment: true,
                    min: 0,
                    max: -1
                }
            }
        }
    }
} as const;

export const RootARefs = {
    childB: CircularContainmentsList.classes["RootA"].references["childB"]
} as const;

export const RootBRefs = {
    childA: CircularContainmentsList.classes["RootB"].references["childA"]
} as const;

export enum EClassesCircularContainmentsList {
    'RootA' = 'ccl://RootA',
    'RootB' = 'ccl://RootB'
}

@eClass(CircularContainmentsList, "RootA")
export class RootA extends Referencable<RootB> {

    @reference(RootARefs.childB)
    declare childB: ModelList<RootB>

    constructor() {
        super();
    }
}

@eClass(CircularContainmentsList, "RootB")
export class RootB extends Referencable<RootA> {

    @reference(RootBRefs.childA)
    declare childA: ModelList<RootA>

    constructor() {
        super();
    }
}

export type RootAJson = JsonOf<RootA>
export type RootBJson = JsonOf<RootB>