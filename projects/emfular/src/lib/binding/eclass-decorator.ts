import 'reflect-metadata';
import {ModelRegistry} from "./model-registry";
import {ClassMeta, ModelDefinition} from "./model-definition";

export const ECLASS_METADATA_KEY = "eClass";


export function eClass(eClass: string) {
    return function (ctor: any) {
        Reflect.defineMetadata(ECLASS_METADATA_KEY, eClass, ctor);
        ModelRegistry.register(eClass, ctor);
    };
}

export function eClass2(model: ModelDefinition): ClassDecorator {
    return function (ctor: any) {

        //todo might be minified
        const className = ctor.name;
        const classMeta: ClassMeta = model.classes[className];
        console.log(className, classMeta);

        if (!classMeta) {
            throw new Error(`Class ${className} not found in model ${model.uri}`);
        }

        ctor.prototype.$classMeta = classMeta;

        const eClass = model.uri + className;
        Reflect.defineMetadata(ECLASS_METADATA_KEY, eClass, ctor);
        ModelRegistry.register(eClass, ctor);

        // New behavior: store constructor in model
        //classMeta.ctor = ctor;
    };
}

/*
export function eClass2(model: ModelDefinition): ClassDecorator {
    return function (ctor: any) {

        //todo might be minified
        const className = ctor.name;

        // Store class name on prototype for lookup
        Object.defineProperty(ctor.prototype, "$className", {
            value: className,
            enumerable: false
        });

        // Register constructor in the model
        const cls = model.classes[className];
        if (!cls) {
            throw new Error(`Class ${className} not found in model definition`);
        }

        const eClass = model.uri+className

        Reflect.defineMetadata(ECLASS_METADATA_KEY, eClass, ctor);
        ModelRegistry.register(eClass, ctor);

        // Incremental opposite resolution
        resolveOpposites(model);
    };
}
*/