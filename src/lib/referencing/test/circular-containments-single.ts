import {ModelDefinition} from "../../binding/model-definition";
import {eClass} from "../../binding/eclass-decorator";
import {Referencable} from "../referencable/referenceable";
import {reference} from "../../binding/reference-decorator";
import {JsonOf} from "../../serialization/json-deserializable";

export const CircularContainmentsSingle: ModelDefinition = {
    name: "CircularContainmentsSingle",
    prefix: "ccs",
    uri: "ccs://",
    classes: {
        RootA: {
            references: {
                childB: {
                    target: "RootB",
                    containment: true,
                    max: 1
                }
            }
        },
        RootB: {
            references: {
                childA: {
                    target: "RootA",
                    containment: true,
                    max: 1
                }
            }
        }
    }
} as const;

export const RootARefs = {
    childB: CircularContainmentsSingle.classes["RootA"].references["childB"]
} as const;

export const RootBRefs = {
    childA: CircularContainmentsSingle.classes["RootB"].references["childA"]
} as const;

export enum EClassesCircularContainmentsList {
    'RootA' = 'ccs://RootA',
    'RootB' = 'ccs://RootB'
}

@eClass(CircularContainmentsSingle, "RootA")
export class RootA extends Referencable<RootB> {

    @reference(RootARefs.childB)
    declare childB: RootB | undefined;

    constructor() {
        super();
    }
}

@eClass(CircularContainmentsSingle, "RootB")
export class RootB extends Referencable<RootA> {

    @reference(RootBRefs.childA)
    declare childA: RootA | undefined;

    constructor() {
        super();
    }
}

export type RootAJson = JsonOf<RootA>
export type RootBJson = JsonOf<RootB>