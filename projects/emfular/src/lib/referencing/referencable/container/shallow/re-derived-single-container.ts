import {Referencable} from "../../referenceable";
import {ReContainer} from "../re-container";
import {ReSingleInterface} from "../re-single-interface";
import {ReDerivationResolver} from "./re-derivation-resolver";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReferenceMeta} from "../../../../binding/model-definition";

export class ReDerivedSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P>
    implements ReSingleInterface<T,P> {

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

    override toJson(_: SerializationContext) { return undefined; }
    override addWithoutTypeCheck(_:T) { return false; }
    override remove(_:T) { return false; }
    override delete() {}

    checkDerivationConstraints(): string | undefined {
        if (!this.resolver.canResolve(this._parent)) {
            return `Derivation violation: no derivation function found for reference '${this.referenceName}'.`;
        }
        return undefined;
    }

    override checkCardinalityConstraints(): string | undefined {
        if (this.meta.min !== undefined && this.meta.min === 1 && this.get() === undefined) {
            return `Minimum cardinality violation: current length 0 is below the required minimum of ${this.meta.min}.`;
        }
        return
    }
}
