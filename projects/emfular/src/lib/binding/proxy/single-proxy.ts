import {ContainerAwareSingleRef} from "./single-ref";
import {ReSingleInterface} from "../../referencing/referencable/container/re-single-interface";
import {Referencable} from "../../referencing/referencable/referenceable";
import {DeletionMode} from "../../utils/deletion-mode";

export function createSingleRefProxy<
    T extends Referencable<any>,
    P extends Referencable<any>
>(container: ReSingleInterface<T, P>
): ContainerAwareSingleRef<T> {


    return new Proxy({} as ContainerAwareSingleRef<T>, {
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

        set(_target: ContainerAwareSingleRef<T>, prop: string|symbol, value: T) {
            if (prop === "value") {
                return container.add(value);
            }
            return false;
        }
    });
}
