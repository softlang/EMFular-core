import {ModelListFromMeta} from "./model-list";
import {ReListInterface} from "../../referencing/referencable/container/re-list-interface";
import {Referencable} from "../../referencing/referencable/referenceable";
import {ReferenceMeta} from "../model-definition";

export function listProxyAccessor<
    T extends Referencable<any>,
    M extends ReferenceMeta
>(propertyKey: string | symbol, symbol: symbol) {
    return {
        get(this: any): ModelListFromMeta<T, M> {
            const c = this[symbol] as ReListInterface<T, any>;
            return c.proxy;
        },
        set(_: T | null) {
            throw new Error(
                `Cannot assign directly to multi-valued reference '${String(propertyKey)}'. Use list operations instead.`
            );
        },
        enumerable: true,
        configurable: true
    }
}