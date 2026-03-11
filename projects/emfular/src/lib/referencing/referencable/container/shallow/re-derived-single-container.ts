import {Referencable} from "../../referenceable";
import {ReContainer} from "../re-container";
import {ReSingleInterface} from "../re-single-interface";
import {SerializationContext} from "../../../../serialization/serialization-context";

export class ReDerivedSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P>
    implements ReSingleInterface<T,P> {

    compute: (owner: P) => T|undefined

    constructor(parent: P,
                compute: (owner: P) => T|undefined,
                referenceName: string,
                inverseName?: string     //todo not really used
    ) {
        super(parent, referenceName, inverseName);
        this.compute = compute;
    }

    get(): T|undefined {
        return this.compute(this._parent)
    }

    override toJson(_: SerializationContext): any {
        return undefined
    }

    override add(_: T): boolean {
        return false;
    }

    override remove(_: T): boolean {
        return false;
    }

    override delete() {}
}
