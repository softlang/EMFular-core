// attribute-decorator.ts
import "reflect-metadata";

export const ATTRIBUTES_KEY = Symbol("attributes");

export interface AttributeOptions {
    default?: any;
    jsonName?: string;
}

export function attribute(options: AttributeOptions = {}) {
    return function (target: any, propertyKey: string) {
        // target is the prototype
        const existing: Record<string, AttributeOptions> =
            Reflect.getMetadata(ATTRIBUTES_KEY, target) || {};

        existing[propertyKey] = options;

        Reflect.defineMetadata(ATTRIBUTES_KEY, existing, target);
    };
}
