import {Referencable} from "../../referenceable";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReContainer} from "../re-container";
import {ReListInterface} from "../re-list-interface";
import {ModelList} from "../hide/model-list";
import {createListProxy} from "../hide/list-proxy";
import {ReShallowInterface} from "./re-shallow-interface";

export class ReDerivedListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P>
    implements ReListInterface<T, P>,
        ReShallowInterface<T, P> {

    _proxy?: ModelList<T>;

    compute: (owner: P) => T[]

    constructor(parent: P,
                compute: (owner: P) => T[],
                referenceName: string,
                inverseName?: string  //todo not really used
    ) {
        super(parent, referenceName, inverseName);
        this.compute = compute;
    }

    get proxy(): ModelList<T> {
        if (!this._proxy) {
            this._proxy = createListProxy(this);
        }
        return this._proxy;
    }

    override get(): T[] {
        // Defensive copy so callers cannot mutate the underlying result
        const result = this.compute(this._parent);
        return result.slice();
    }

    override toJson(_: SerializationContext): any {
        return []
    }

    override add(_: T): boolean {
        return false;
    }

    override remove(_: T): boolean {
        return false;
    }

    override delete() {}

    move(from: number, to: number) {}
    swap(from: number, to: number) {}
}
