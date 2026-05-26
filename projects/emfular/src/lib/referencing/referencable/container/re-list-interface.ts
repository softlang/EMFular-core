import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ModelList} from "../../../binding/proxy/model-list";
import {Kind} from "../../../binding/proxy/reference-typing";

export interface ReListInterface<
    T extends Referencable<any>,
    P extends Referencable<any>,
    K extends Kind
> extends ReContainer<T, P> {

    get proxy(): ModelList<T, K>

    get(): T[]

    move(from: number, to: number): void
    swap(from: number, to: number): void
}
