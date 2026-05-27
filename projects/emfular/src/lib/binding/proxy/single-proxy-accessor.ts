import {Referencable} from "../../referencing/referencable/referenceable";
import {ReSingleInterface} from "../../referencing/referencable/container/re-single-interface";
import {ReferenceMeta} from "../model-definition";
import {KindFromMeta} from "./reference-kind";
import {SingleRef} from "./single-ref";

//todo old behaviour: now needs extra annotation
export function plainSingleProxyAccessor<
    T extends Referencable<any>,
    R extends ReferenceMeta
>(symbol: symbol) {

    type Ki = KindFromMeta<R>

    return {
        get(this: any): SingleRef<T, Ki> {
            const c = this[symbol] as ReSingleInterface<T, any, Ki>;
            return c.proxy;
        },
        set(this: any, value: T | null) {
            const c = this[symbol] as ReSingleInterface<T, any, Ki>;
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
    }
}