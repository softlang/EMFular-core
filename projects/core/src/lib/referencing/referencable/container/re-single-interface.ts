import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";

export interface ReSingleInterface<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P>{
    get(): T | undefined
}
