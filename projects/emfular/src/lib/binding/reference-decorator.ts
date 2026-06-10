import {Referencable} from "../referencing/referencable/referenceable";
import {ReferenceMeta} from "./model-definition";
import {createContainer} from "./proxy/create-container";
import {listProxyAccessor} from "./proxy/list-proxy-accessor";
import {singleProxyAccessor} from "./proxy/single-proxy-accessor";
import {REFERENCE_INITIALIZERS} from "../referencing/referencable/referencable-symbols";

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
                listProxyAccessor<T,M["kind"]>(propertyKey, symbol)
            );
        } else {
            Object.defineProperty(
                prototype,
                propertyKey,
                singleProxyAccessor<T,M["kind"]>(symbol) //todo change
            );
        }

        if (!prototype[REFERENCE_INITIALIZERS]) {
            prototype[REFERENCE_INITIALIZERS] = [];
        }
        (prototype[REFERENCE_INITIALIZERS] as Array<(this: any) => void>)
            .push(function (this: any) {
                this[symbol] = createContainer<T, any>(
                    this, meta, String(propertyKey)
                );
            });
    };
}
