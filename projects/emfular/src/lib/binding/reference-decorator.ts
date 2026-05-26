import {Referencable} from "../referencing/referencable/referenceable";
import {ReferenceMeta} from "./model-definition";
import {createContainer} from "./proxy/create-container";
import {listProxyAccessor} from "./proxy/list-proxy-accessor";
import {plainSingleProxyAccessor} from "./proxy/single-proxy-accessor";

export function reference<T extends Referencable<any>, M extends ReferenceMeta>(
    meta: M
): PropertyDecorator {

    return function (prototype: any, propertyKey: string | symbol) {

        const symbol = Symbol(String(propertyKey));
        meta.containerKey = symbol;

        if ( meta.max !== 1) {
            Object.defineProperty(
                prototype,
                propertyKey,
                listProxyAccessor<T,M>(propertyKey, symbol)
            );
        } else {
            Object.defineProperty(
                prototype,
                propertyKey,
                plainSingleProxyAccessor<T,M>(symbol) //todo change
            );
        }

        if (!prototype.__referenceInitializers) {
            prototype.__referenceInitializers = [];
        }

        (prototype.__referenceInitializers as Array<(this: any) => void>)
            .push(function (this: any) {
                this[symbol] = createContainer<T, any>(
                    this, meta, String(propertyKey)
                );
            });
    };
}
