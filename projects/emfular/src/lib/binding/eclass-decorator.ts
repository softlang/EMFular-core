import 'reflect-metadata';
import {ModelRegistry} from "./model-registry";
import {ClassMeta, ModelDefinition} from "./model-definition";

export const ECLASS_METADATA_KEY = "eClass";


export function eClass(model: ModelDefinition, className: keyof typeof model.classes): ClassDecorator {
    return function (ctor: any) {

        const classMeta: ClassMeta = model.classes[className];
        if (!classMeta) {
            throw new Error(`Class ${String(className)} not found in model ${model.uri}`);
        }

        ctor.prototype.$classMeta = classMeta;
        ctor.prototype.$modelUri = model.uri;
        ctor.prototype.$modelMeta = model

        const eClass = model.uri + className;
        Reflect.defineMetadata(ECLASS_METADATA_KEY, eClass, ctor);
        ModelRegistry.register(eClass, ctor);
    };
}
