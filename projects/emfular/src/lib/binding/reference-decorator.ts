import {Referencable} from "../referencing/referencable/referenceable";
import {ReferenceMeta} from "./model-definition";
import {createContainer} from "./reference-creator";
import {ReContainer} from "../referencing/referencable/container/re-container";
import {ModelList} from "../referencing/referencable/container/hide/model-list";
import {createListProxy} from "../referencing/referencable/container/hide/list-proxy";
import {ReListContainer} from "../referencing/referencable/container/re-list-container";
import {ReSingleInterface} from "../referencing/referencable/container/re-single-interface";

export function reference<T extends Referencable<any>>(
    meta: ReferenceMeta
): PropertyDecorator {

    return function (prototype: any, propertyKey: string | symbol) {

        const symbol = Symbol(String(propertyKey));
        meta.containerKey = symbol;

        if ( meta.max !== 1) {
            Object.defineProperty(prototype, propertyKey, {
                get(): ModelList<T> {
                    const c = this[symbol] as ReListContainer<T, any>;
                    return createListProxy(c)
                },
                set(_: T | null) {
                    throw new Error(
                        `Cannot assign directly to multi-valued reference '${String(propertyKey)}'. Use list operations instead.`
                    );
                },
                enumerable: true,
                configurable: true
            });
        } else {
            Object.defineProperty(prototype, propertyKey, {
                get(): T | undefined {
                    const c = this[symbol] as ReSingleInterface<T, any>;
                    return c?.get();
                },
                set(value: T | null) {
                    const c = this[symbol] as ReContainer<T, any>;
                    if (!c) throw new Error("Container not initialized");
                    if (value == null) c.delete(); //todo
                    else c.add(value);
                },
                enumerable: true,
                configurable: true
            });

        }

        if (!prototype.__referenceInitializers) {
            prototype.__referenceInitializers = [];
        }

        (prototype.__referenceInitializers as Array<(this: any) => void>)
            .push(function (this: any) {
                this[symbol] = createContainer<T, any>(
                    this, meta, String(propertyKey)
                );
            });
    };
}
