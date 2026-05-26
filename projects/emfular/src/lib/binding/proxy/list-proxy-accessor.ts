import {ModelList} from "./model-list";
import {ReListInterface} from "../../referencing/referencable/container/re-list-interface";
import {Referencable} from "../../referencing/referencable/referenceable";
import {ReferenceMeta} from "../model-definition";
import {KindFromMeta} from "./reference-kind";

export function listProxyAccessor<
    T extends Referencable<any>,
    M extends ReferenceMeta
>(propertyKey: string | symbol, symbol: symbol) {

    type Ki = KindFromMeta<M>
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