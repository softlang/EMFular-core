import "reflect-metadata";

export const ATTRIBUTES_KEY = Symbol("attributes");

export function attribute(target: any, propertyKey: string) {
    const existing = Reflect.getMetadata(ATTRIBUTES_KEY, target.constructor) || [];
    Reflect.defineMetadata(ATTRIBUTES_KEY, [...existing, propertyKey], target.constructor);
}
