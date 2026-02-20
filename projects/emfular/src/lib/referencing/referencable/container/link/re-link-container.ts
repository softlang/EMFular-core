import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {Ref} from "../../../ref/ref";
import {Deserializer} from "../../../../serialization/deserializer";

export abstract class ReLinkContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T,P> {

    readonly inverseName?: string;

    protected constructor(parent: P, referenceName: string, inverseName?: string) {
        super(parent, referenceName);
        this.inverseName = inverseName;
        this._parent.$otherReferences.push(this)
    }

    abstract removeFromInverse(item: T): boolean;

    //adds the real elements behind refs as received from getOrCreate to the container
    addLinks(context: Deserializer, ...refs: Ref[]): void {
        refs?.map((ref: Ref) => {
            let elem: T = context.get(ref.$ref) as T
            this.add(elem)
        })
    }

    abstract override toJson(ctx: SerializationContext): Ref[] | Ref | undefined
}
