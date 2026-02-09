import {Ref} from "../ref/ref";
import {JsonOf} from "../../serialization/json-deserializable";
import {
    Referencable1WithChildren,
    Referencable2WithChildren,
    Referencable3WithChildren
} from "./referencables-with-children";

export type Referencable1WithChildrenJson = JsonOf<Referencable1WithChildren>
export type Referencable2WithChildrenJson = JsonOf<Referencable2WithChildren>
export type Referencable3WithChildrenJson = JsonOf<Referencable3WithChildren>


/*
export interface Referencable1WithChildrenJson {
    eClass?: string
    name: string
    c1_1?: Referencable2WithChildrenJson[]
    c1_2?: Ref[]
}

export interface Referencable2WithChildrenJson {
    eClass?: string
    name: string
    c2_1?: Referencable3WithChildrenJson[]
}

export interface Referencable3WithChildrenJson {
    eClass?: string
    name: string
    c1_2_reversed?: Ref[]
}*/
