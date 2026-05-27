import {Referencable} from "../../referencing/referencable/referenceable";
import {SingleRef} from "./single-ref";
import {ReSingleInterface} from "../../referencing/referencable/container/re-single-interface";
import {ReferenceMeta} from "../model-definition";
import {KindFromMeta} from "./reference-kind";


export function singleProxyAccessor<
    T extends Referencable<any>,
    M extends ReferenceMeta
>(symbol: symbol) {

    type Ki = KindFromMeta<M>

    return {
        get(this: any): SingleRef<T, Ki> {
            const c = this[symbol] as ReSingleInterface<T, any, Ki>;
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
