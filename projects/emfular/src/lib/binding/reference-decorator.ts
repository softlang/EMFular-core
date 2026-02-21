import {Referencable} from "../referencing/referencable/referenceable";
import {ModelDefinition, ReferenceMeta} from "./model-definition";
import {createContainer} from "./reference-creator";
import {ReContainer} from "../referencing/referencable/container/re-container";

export function reference<T extends Referencable<any>>(
    meta: ReferenceMeta,
    model: ModelDefinition
): PropertyDecorator {

    return function (prototype: any, propertyKey: string | symbol) {

        const hidden = Symbol(String(propertyKey));

        Object.defineProperty(prototype, propertyKey, {
            get(): T | T[] | undefined {
                const c = this[hidden] as ReContainer<T, any>;
                return c?.get();
            },
            set(value: T | null) {
                const c = this[hidden] as ReContainer<T, any>;
                if (!c) throw new Error("Container not initialized");
                if (value == null) c.delete(); //todo
                else c.add(value);
            },
            enumerable: true,
            configurable: true
        });

        if (!prototype.__referenceInitializers) {
            prototype.__referenceInitializers = [];
        }

        (prototype.__referenceInitializers as Array<(this: any) => void>)
            .push(function (this: any) {
                this[hidden] = createContainer<T, any>(
                    this, meta, model, String(propertyKey)
                );
            });
    };
}
