import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";

export abstract class ReSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P> {

    protected _instance?: T ;

    override get(): T | undefined {
        return this._instance;
    }
}
