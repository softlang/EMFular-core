import {ModelList} from "./model-list";
import {ReListInterface} from "../../referencing/referencable/container/re-list-interface";
import {Referencable} from "../../referencing/referencable/referenceable";
import {Kind} from "./reference-kind";

export function listProxyAccessor<
    T extends Referencable<any>,
    Ki extends Kind
>(propertyKey: string | symbol, symbol: symbol) {

    return {
        get(this: any): ModelList<T, Ki> {
            const c = this[symbol] as ReListInterface<T, any, Ki>;
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