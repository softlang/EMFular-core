import {Kind} from "./proxy/reference-kind";

export type TsEnum = Record<string, string | number>;

export interface ReferenceMeta {
    target: string;        // name of target class
    containment?: true;
    isParent?: true;
    derivingMethod?: symbol;
    opposite?: string;
    min?: number;
    max?: number;

    // assigned by @reference
    containerKey?: symbol

    kind: Kind
}

export interface ClassMeta {
    references: Record<string, ReferenceMeta>;
}

export interface ModelDefinition {
    name: string;
    prefix: string;
    uri: string;

    classes: Record<string, ClassMeta>;
    enums?: Record<string, TsEnum>;
}