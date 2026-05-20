import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ModelList} from "../../../binding/proxy/model-list";

export interface ReListInterface<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P> {

    get proxy(): ModelList<T>

    get(): T[]

    move(from: number, to: number): void
    swap(from: number, to: number): void
}
