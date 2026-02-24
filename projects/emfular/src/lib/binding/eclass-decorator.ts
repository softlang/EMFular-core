import 'reflect-metadata';
import {ModelRegistry} from "./model-registry";
import {ClassMeta, ModelDefinition} from "./model-definition";

export const ECLASS_METADATA_KEY = "eClass";


export function eClass(model: ModelDefinition): ClassDecorator {
    return function (ctor: any) {

        //todo might be minified
        const className = ctor.name;
        const classMeta: ClassMeta = model.classes[className];
        console.log(className, classMeta);

        if (!classMeta) {
            throw new Error(`Class ${className} not found in model ${model.uri}`);
        }

        ctor.prototype.$classMeta = classMeta;
        ctor.prototype.$modelUri = model.uri;
        const eClass = model.uri + className;
        Reflect.defineMetadata(ECLASS_METADATA_KEY, eClass, ctor);
        ModelRegistry.register(eClass, ctor);
    };
}
