import "reflect-metadata";
import { ATTRIBUTES_KEY, AttributeOptions } from "./attribute-decorator";

export function getAllAttributes(ctor: Function): Map<string, AttributeOptions> {
    const result = new Map<string, AttributeOptions>();

    let current = ctor.prototype;
    while (current && current !== Object.prototype) {
        const attrs: Record<string, AttributeOptions> =
            Reflect.getMetadata(ATTRIBUTES_KEY, current) || {};

        // base class attributes should not override subclass attributes
        for (const key of Object.keys(attrs)) {
            if (!result.has(key)) {
                result.set(key, attrs[key]);
            }
        }

        current = Object.getPrototypeOf(current);
    }

    return result;
}
