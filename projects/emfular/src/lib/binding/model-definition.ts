import {Referencable} from "../referencing/referencable/referenceable";
import {JsonDeserializable} from "../serialization/json-deserializable";


export interface EnumDescriptor {
    name: string;
    literals: string[];
}

export interface AttributeDescriptor<T> {
    name: string;
    type: T;
    default?: T | T[];

    /** Cardinality */
    min?: number;
    max?: number;
}


export interface FeatureDescriptor<T extends Referencable<any>> {
    name: string;
    type: ClassDescriptor<T>;
    containment: boolean;
    inverse?: string;
    /** Cardinality */
    min?: number;
    max?: number;
    doc?: string;
}

export interface ClassDescriptor<T extends Referencable<any>> {
    name: string;
    ctor: JsonDeserializable<T>;
}

export interface ClassDefinition<T extends Referencable<any>> {
    name: string;
    ctor: JsonDeserializable<T>;
    features: Record<string, FeatureDescriptor<any>>;
    attributes: Record<string, AttributeDescriptor<any>>
}

export interface ModelDefinition {
    name: string;
    classes: Record<string, ClassDefinition<any>>;
    enums?: Record<string, EnumDescriptor>;
}


