import {Referencable} from "../referencing/referencable/referenceable";
import {ReferenceMeta} from "./model-definition";
import {createContainer} from "./proxy/create-container";
import {ReSingleInterface} from "../referencing/referencable/container/re-single-interface";
import {ReListInterface} from "../referencing/referencable/container/re-list-interface";
import {ModelListWithKind} from "./proxy/model-list";
import {SingleRef, SingleRef2WithKind} from "./proxy/single-ref";
import {KindFromMeta} from "./proxy/reference-typing";

export function reference<T extends Referencable<any>, M extends ReferenceMeta>(
    meta: M
): PropertyDecorator {

    return function (prototype: any, propertyKey: string | symbol) {

        const symbol = Symbol(String(propertyKey));
        meta.containerKey = symbol;

        // infer kind + multiplicity from meta
        type Kind = KindFromMeta<M>;
        type IsList = M["max"] extends 1 ? false : true;
        type UserType = (typeof prototype)[typeof propertyKey];
        type FinalType =
            IsList extends true
                ? ModelListWithKind<T, Kind>
                : UserType extends Referencable<any> ?
                SingleRef<T, Kind> :
                SingleRef2WithKind<T, Kind>;

        if ( meta.max !== 1) {
            Object.defineProperty(prototype, propertyKey, {
                get(this: any): FinalType {
                    const c = this[symbol] as ReListInterface<T, any>;
                    return c.proxy as FinalType;
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
                get(this: any): FinalType {
                    const c = this[symbol] as ReSingleInterface<T, any>;
                    return c?.get() as FinalType;
                },
                set(this: any, value: T | null) {
                    const c = this[symbol] as ReSingleInterface<T, any>;
                    if (!c) throw new Error("Container not initialized");
                    if (value == null) {
                        const val = c.get();
                        if (val) c.remove(val);
                    } else {
                        c.add(value);
                    }
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
