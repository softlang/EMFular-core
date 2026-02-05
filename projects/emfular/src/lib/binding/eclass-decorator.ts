import 'reflect-metadata';
import {ModelRegistry} from "./model-registry";

export const ECLASS_METADATA_KEY = "eClass";

export function eClass(eClass: string) {
    return function (ctor: any) {
        Reflect.defineMetadata(ECLASS_METADATA_KEY, eClass, ctor);
        ModelRegistry.register(eClass, ctor);
    };
}
