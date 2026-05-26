import {ReSingleInterface} from "../../referencing/referencable/container/re-single-interface";
import {Referencable} from "../../referencing/referencable/referenceable";
import {DeletionMode} from "../../utils/deletion-mode";
import {SingleRef2} from "./single-ref";
import {Kind} from "./reference-kind";

export function createSingleRefProxy<
    T extends Referencable<any>,
    P extends Referencable<any>,
    K extends Kind
>(container: ReSingleInterface<T, P, K>
): SingleRef2<T, K> {


    return new Proxy({} as SingleRef2<T, K>, {
        get(_target, prop, _receiver) {
            if (prop === "value") return container.get();

            if (prop === "remove") {
                return (item: T) => container.remove(item);
            }

            if (prop === "removeCascade") {
                return (item: T) => container.remove(item, DeletionMode.CASCADE);
            }

            if (prop === "delete") {
                return (mode?: DeletionMode) => {
                    container.delete(mode);
                }
            }

            //forward unknown methods to underlying T
            const v = container.get();
            if (v && prop in v) {
                const val = (v as any)[prop];
                return typeof val === "function" ? val.bind(v) : val;
            }

            return undefined;
        },

        set(_target: SingleRef2<T, K>, prop: string|symbol, value: T) {
            if (prop === "value") {
                return container.add(value);
            }
            return false;
        }
    });
}
