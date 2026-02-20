export type TsEnum = Record<string, string | number>;

export interface ReferenceMeta {
    target: string;        // name of target class
    containment: boolean;
    opposite?: string;
    min?: number;
    max?: number;
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