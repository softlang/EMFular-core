import {Referencable} from "../../referenceable";
import {ReListContainer} from "../re-list-container";
import {SerializationContext} from "../../../../serialization/serialization-context";

export class ReDerivedListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReListContainer<T,P> {
    //todo we could just use an interface so that no empty instance exists

    compute: (owner: P) => T[]

    constructor(parent: P,
                compute: (owner: P) => T[],
                referenceName: string,
                inverseName?: string  //todo not really used
    ) {
        super(parent, referenceName, inverseName);
        this.compute = compute;
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

}
