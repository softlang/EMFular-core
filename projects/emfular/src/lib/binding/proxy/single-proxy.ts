import {ReSingleInterface} from "../../referencing/referencable/container/re-single-interface";
import {Referencable} from "../../referencing/referencable/referenceable";
import {DeletionMode} from "../../utils/deletion-mode";
import {SingleRef} from "./single-ref";
import {Kind} from "./reference-kind";

export function createSingleRefProxy<
    T extends Referencable<any>,
    P extends Referencable<any>,
    K extends Kind
>(container: ReSingleInterface<T, P, K>
): SingleRef<T, K> {


    return new Proxy({} as SingleRef<T, K>, {
        get(_target, prop, _receiver) {

            if (prop === "value") return container.get();

            if (prop === "remove") {
                return (item: T) => container.remove(item);
            }

            if (prop === "removeCascade") {
                return (item: T) => container.remove(item, DeletionMode.CASCADE);
            }

            if (prop === "delete") {
                return (mode?: DeletionMode) => container.delete(mode);
            }

            if (prop === "assign") {
                return (item: T) => container.add(item);
            }

            //forward unknown methods to underlying T
            const v = container.get();
            if (v && prop in v) {
                const val = (v as any)[prop];
                return typeof val === "function" ? val.bind(v) : val;
            }
            return undefined;
        },

        set(_target: SingleRef<T, K>, prop: string|symbol, value: T): boolean {
            // attribute sets on T:
            const v: T | undefined = container.get();
            // forward sets to underlying T
            if (v && prop in v) {
                (v as any)[prop] = value;
                return true;
            }
            // set complete T (only change elem inside container)
            if (prop === "value") {
                return container.add(value);
            }
            return false;
        }
    });
}
