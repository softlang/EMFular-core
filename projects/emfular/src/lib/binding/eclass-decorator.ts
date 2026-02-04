import 'reflect-metadata';

export const ECLASS_METADATA_KEY = "eClass";

export function eClass(eClass: string) {
    return function (ctor: Function) {
        Reflect.defineMetadata(ECLASS_METADATA_KEY, eClass, ctor);
    };
}
