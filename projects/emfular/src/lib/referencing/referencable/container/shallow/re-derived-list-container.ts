import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReContainer} from "../re-container";
import {ReListInterface} from "../re-list-interface";
import {ModelList} from "../../../../binding/proxy/model-list";
import {createListProxy} from "../../../../binding/proxy/list-proxy";
import {ReShallowInterface} from "./re-shallow-interface";
import {ReDerivationResolver} from "./re-derivation-resolver";
import {ReferenceMeta} from "../../../../binding/model-definition";

export class ReDerivedListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P>
    implements ReListInterface<T, P, "none">,
        ReShallowInterface<T, P> {

    private _proxy?: ModelList<T, "none">;
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

    get proxy(): ModelList<T, "none"> {
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
}