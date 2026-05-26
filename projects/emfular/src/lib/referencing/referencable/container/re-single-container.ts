import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ReSingleInterface} from "./re-single-interface";
import {ReferenceMeta} from "../../../binding/model-definition";
import {SingleRef2} from "../../../binding/proxy/single-ref";
import {createSingleRefProxy} from "../../../binding/proxy/single-proxy";

export abstract class ReSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P>
implements ReSingleInterface<T, P>{

    protected _instance?: T ;

    private _proxy?: SingleRef2<T>;

    protected constructor(parent: P, referenceName: string, refMeta: ReferenceMeta) {
        super(parent, referenceName, refMeta);
    }

    override get(): T | undefined {
        return this._instance;
    }

    get proxy(): SingleRef2<T> {
        if (!this._proxy) {
            this._proxy = createSingleRefProxy(this);
        }
        return this._proxy;
    }
}
