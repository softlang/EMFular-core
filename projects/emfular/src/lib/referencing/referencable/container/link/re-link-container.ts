import {Referencable} from "../../referenceable";
import { ReContainer } from "../re-container";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {Ref} from "../../../ref/ref";

export interface ReLinkContainer<T extends Referencable, P extends Referencable> extends ReContainer<T,P>{
    toJson(ctx: SerializationContext): Ref[] | Ref | undefined
}
