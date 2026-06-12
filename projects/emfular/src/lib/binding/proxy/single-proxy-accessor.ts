import {Referencable} from "../../referencing/referencable/referenceable";
import {SingleRefI} from "./single-ref";
import {ReSingleInterface} from "../../referencing/referencable/container/re-single-interface";
import {Kind} from "./reference-kind";

export function singleProxyAccessor<
    T extends Referencable<any>,
    Ki extends Kind
>(symbol: symbol) {

    return {
        get(this: any): SingleRefI<T, Ki> {
            const c = this[symbol] as ReSingleInterface<T, any, Ki>;
            return c.proxy;
        },
        set() {
            throw new Error(
                "Cannot assign directly to a container-based single reference. Use assign instead."
            );
        },
        enumerable: true,
        configurable: true
    };
}
