import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {SingleRef} from "../../../binding/proxy/single-ref";
import {Kind} from "../../../binding/proxy/reference-kind";

export interface ReSingleInterface<
    T extends Referencable<any>,
    P extends Referencable<any>,
    K extends Kind
> extends ReContainer<T, P>{
    get(): T | undefined

    get proxy(): SingleRef<T, K>
}
