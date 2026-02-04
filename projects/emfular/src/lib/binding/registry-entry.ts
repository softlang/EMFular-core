import {Referencable} from "../referencing/referencable/referenceable";
import {Ref} from "../referencing/ref/ref";

export interface RegistryEntry<T extends Referencable> {
    new (ref?: Ref) : T
}
