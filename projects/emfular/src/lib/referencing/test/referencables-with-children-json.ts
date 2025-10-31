import {Ref} from "../ref/ref";

export interface Referencable1WithChildrenJson {
    c1_1: Referencable2WithChildrenJson[]
    c1_2: Ref[]
}

export interface Referencable2WithChildrenJson {
    c2_1: Referencable3WithChildrenJson[]
}

export interface Referencable3WithChildrenJson {
    c1_2_reversed: Ref[]
}
