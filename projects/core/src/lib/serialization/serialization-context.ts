import {Referencable} from "../referencing/referencable/referenceable";
import {Ref} from "../referencing/ref/ref";

export class SerializationContext {

    private refs = new Map<Referencable<any>, Ref>();

    put<T extends Referencable<any>>(obj: T, ref: Ref) {
        this.refs.set(obj, ref);
    }

    get<T extends Referencable<any>>(obj: T): Ref {
        const ref = this.refs.get(obj);
        if (!ref) {
            throw new Error("No ref assigned for object " + obj);
        }
        return ref;
    }
}
