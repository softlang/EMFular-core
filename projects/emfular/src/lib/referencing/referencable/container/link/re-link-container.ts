import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {Ref} from "../../../ref/ref";

export interface ReLinkContainer<T extends Referencable, Tname extends string>
    extends ReContainer<T, Tname>{
    toJson(ctx: SerializationContext): Ref[] | Ref | undefined
}
