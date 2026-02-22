import {Referencable} from "../../referenceable";
import {ReSingleContainer} from "../re-single-container";

export function createSingleProxy<T extends Referencable<any>, P extends Referencable<any>>(
    container: ReSingleContainer<T, P>
): { value: T | undefined } {
    return new Proxy({} as any, {
        get(_, prop) {
            if (prop === "value") return container.get();
            return undefined;
        },
        set(_, prop, value) {
            if (prop === "value") {
                container.set(value);
                return true;
            }
            return false;
        }
    });
}
