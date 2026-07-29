import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReContainer} from "../re-container";
import {ReListInterface} from "../re-list-interface";
import {ModelList} from "../hide/model-list";
import {createListProxy} from "../hide/list-proxy";
import {ReShallowInterface} from "./re-shallow-interface";
import {ReDerivationResolver} from "./re-derivation-resolver";
import {ReferenceMeta} from "../../../../binding/model-definition";

export class ReDerivedListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P>
    implements ReListInterface<T, P>,
        ReShallowInterface<T, P> {

    private _proxy?: ModelList<T>;
    private resolver: ReDerivationResolver<P, T[]>;

    constructor(
        parent: P,
        computeOrSymbol: ((owner: P) => T[]) | symbol,
        referenceName: string,
        refMeta: ReferenceMeta
    ) {
        super(parent, referenceName, refMeta);
        this.resolver = new ReDerivationResolver(computeOrSymbol);
    }

    get proxy(): ModelList<T> {
        if (!this._proxy) {
            this._proxy = createListProxy(this);
        }
        return this._proxy;
    }

    override get(): T[] {
        // Defensive copy so callers cannot mutate the underlying result
        const result = this.resolver.resolve(this._parent);
        return result.slice();
    }

    override toJson(_: SerializationContext): any {
        return [];
    }

    override addWithoutTypeCheck(_: T): boolean {
        return false;
    }

    override remove(_: T): boolean {
        return false;
    }

    override delete() {}

    move(from: number, to: number) {}
    swap(from: number, to: number) {}

    checkDerivationMethodExistence(): string | undefined {
        if (!this.resolver.canResolve(this._parent)) {
            return `Derivation violation: no derivation function found for reference '${this.referenceName}'.`;
        }
        return undefined;
    }

    checkDerivationMethodImpl(): string | undefined {
        try {
            this.get()
        } catch (e) {
            if (e instanceof Error) {
                return e.message;
            }
            return String(e);
        }
        return undefined;
    }

    override checkCardinalityConstraints(): string | undefined {
        if (this.meta.min !== undefined && this.get().length < this.meta.min) {
            return `Minimum cardinality violation: current length ${this.get().length} is below the required minimum of ${this.meta.min}.`;
        } else if (this.meta.max !== undefined && this.meta.max !== -1 && this.get().length > this.meta.max) {
            return `Maximum cardinality violation: current length ${this.get().length} exceeds the allowed maximum of ${this.meta.max}.`;
        }
        return
    }
}