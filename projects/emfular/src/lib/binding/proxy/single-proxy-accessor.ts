import {Referencable} from "../../referencing/referencable/referenceable";
import {SingleRef2} from "./single-ref";
import {ReSingleInterface} from "../../referencing/referencable/container/re-single-interface";

//todo old behaviour: now needs extra annotation
export function plainSingleProxyAccessor<
    T extends Referencable<any>
>(symbol: symbol) {

    return {
        get(this: any): T|undefined {
            const c = this[symbol] as ReSingleInterface<T, any>;
            return c?.get();
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
    }
}

export function singleProxyAccessor<
    T extends Referencable<any>
>(symbol: symbol) {

    return {
        get(this: any): SingleRef2<T> {
            const c = this[symbol] as ReSingleInterface<T, any>;
            return c.proxy;
        },
        set() {
            throw new Error(
                "Cannot assign directly to a container-based single reference. Use proxy methods instead."
            );
        },
        enumerable: true,
        configurable: true
    };
}
