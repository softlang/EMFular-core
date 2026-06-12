import {Referencable} from "../../referenceable";
import {ReContainer} from "../re-container";
import {ReSingleInterface} from "../re-single-interface";
import {ReDerivationResolver} from "./re-derivation-resolver";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReferenceMeta} from "../../../../binding/model-definition";
import {SingleRef, SingleRefI} from "../../../../binding/proxy/single-ref";
import {createSingleRefProxy} from "../../../../binding/proxy/single-proxy";

export class ReDerivedSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P>
    implements ReSingleInterface<T,P, "none"> {

    private _proxy?: SingleRefI<T, "none">;

    private resolver: ReDerivationResolver<P, T | undefined>;

    constructor(
        parent: P,
        computeOrSymbol: ((owner: P) => T | undefined) | symbol,
        referenceName: string,
        refMeta: ReferenceMeta
    ) {
        super(parent, referenceName, refMeta);
        this.resolver = new ReDerivationResolver(computeOrSymbol);
    }

    get(): T | undefined {
        return this.resolver.resolve(this._parent);
    }

    get proxy(): SingleRefI<T, "none"> {
        if (!this._proxy) {
            this._proxy = createSingleRefProxy(this);
        }
        return this._proxy;
    }

    override toJson(_: SerializationContext) { return undefined; }
    override addWithoutTypeCheck(_:T) { return false; }
    override remove(_:T) { return false; }
    override delete() {}
}
