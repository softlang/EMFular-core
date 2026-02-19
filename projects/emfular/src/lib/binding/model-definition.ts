import {Referencable} from "../referencing/referencable/referenceable";
import {JsonDeserializable} from "../serialization/json-deserializable";

export interface FeatureDescriptor<T extends Referencable<any>> {
    name: string;
    type: ClassDescriptor<T>;
    containment: boolean;
    inverse?: string;
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
}


export interface ModelDefinition {
    name: string;
    classes: Record<string, ClassDefinition<any>>;
}


