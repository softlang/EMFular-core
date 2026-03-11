import {Referencable} from "../../referenceable";
import {ReContainer} from "../re-container";
import {SerializationContext} from "../../../../serialization/serialization-context";

export interface ReShallowInterface<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P> {
    toJson(_: SerializationContext):  undefined |[]
}
