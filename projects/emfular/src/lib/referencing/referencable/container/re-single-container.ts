import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ReSingleInterface} from "./re-single-interface";
import {ReferenceMeta} from "../../../binding/model-definition";
import {SingleRef} from "../../../binding/proxy/single-ref";
import {createSingleRefProxy} from "../../../binding/proxy/single-proxy";
import {Kind} from "../../../binding/proxy/reference-kind";

export abstract class ReSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>,
    K extends Kind
> extends ReContainer<T, P>
implements ReSingleInterface<T, P, K>{

    protected _instance?: T ;

    private _proxy?: SingleRef<T, K>;

    protected constructor(parent: P, referenceName: string, refMeta: ReferenceMeta) {
        super(parent, referenceName, refMeta);
    }

    override get(): T | undefined {
        return this._instance;
    }

    get proxy(): SingleRef<T, K> {
        if (!this._proxy) {
            this._proxy = createSingleRefProxy<T, P, K>(this);
        }
        return this._proxy;
    }
}
