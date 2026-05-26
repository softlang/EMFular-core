import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {SingleRef2} from "../../../binding/proxy/single-ref";

export interface ReSingleInterface<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P>{
    get(): T | undefined

    get proxy(): SingleRef2<T>
}
