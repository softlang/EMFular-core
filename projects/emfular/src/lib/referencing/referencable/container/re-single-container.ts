import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ReSingleInterface} from "./re-single-interface";
import {ReferenceMeta} from "../../../binding/model-definition";
import {SingleRefI} from "../../../binding/proxy/single-ref";
import {createSingleRefProxy} from "../../../binding/proxy/single-proxy";
import {Kind} from "../../../binding/proxy/reference-kind";

export abstract class ReSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>,
    K extends Kind
> extends ReContainer<T, P>
implements ReSingleInterface<T, P, K>{

    protected _instance?: T ;

    protected _proxy?: SingleRefI<T, K>;

    protected constructor(parent: P, referenceName: string, refMeta: ReferenceMeta) {
        super(parent, referenceName, refMeta);
    }

    public get(): T | undefined {
        return this._instance;
    }

    public get proxy(): SingleRefI<T, K> {
        if (!this._proxy) {
            this._proxy = createSingleRefProxy<T, P, K>(this);
        }
        return this._proxy;
    }
}
