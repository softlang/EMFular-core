import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";

export abstract class ReListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P>{

    _instance: T[] = [];


}
