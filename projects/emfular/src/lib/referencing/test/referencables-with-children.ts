import {ReTreeListContainer} from "../referencable/container/tree/re-tree-list-container";
import {Referencable} from "../referencable/referenceable";
import {ReLinkListContainer} from "../referencable/container/link/re-link-list-container";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-deserializable";

export enum EClasses {
    'Referencable1WithChildren' = 'namespace/Referencable1WithChildren',
    'Referencable2WithChildren' = 'namespace/Referencable2WithChildren',
    'Referencable3WithChildren' = 'namespace/Referencable3WithChildren'
}


@eClass(EClasses.Referencable1WithChildren)
export class Referencable1WithChildren extends Referencable {

    static readonly c1_1_prefix = "c1_1";
    static readonly c1_2_prefix = "c1_2";

    readonly _c1_1: ReTreeListContainer<Referencable2WithChildren>;
    readonly _c1_2: ReLinkListContainer<Referencable3WithChildren>;

    @attribute()
    name: string = "referencable1";

    constructor() {
        super();
        this._c1_1 = new ReTreeListContainer(this, Referencable1WithChildren.c1_1_prefix);
        this._c1_2 = new ReLinkListContainer(this, Referencable1WithChildren.c1_2_prefix, Referencable3WithChildren.c1_2_reversed_prefix);
    }

    addc1_1(...c2s: Referencable2WithChildren[]) {
        c2s.map(c2 => this._c1_1.add(c2))
    }
    addc1_2(...c3s: Referencable3WithChildren[]) {
        c3s.map(c3 => this._c1_2.add(c3))
    }

}

@eClass(EClasses.Referencable2WithChildren)
export class Referencable2WithChildren extends Referencable {
    static readonly c2_1_prefix = "c2_1";
    readonly _c2_1: ReTreeListContainer<Referencable3WithChildren>;

    @attribute()
    name: string = "referencable2";

    constructor() {
        super();
        this._c2_1 = new ReTreeListContainer(this, Referencable2WithChildren.c2_1_prefix)
    }

    addc2_1(...c3s: Referencable3WithChildren[]) {
        c3s.map(c3 => this._c2_1.add(c3))
    }
}

@eClass(EClasses.Referencable3WithChildren)
export class Referencable3WithChildren extends Referencable {
    static readonly c1_2_reversed_prefix = "c1_2_reversed";
    readonly _c1_2_reversed: ReLinkListContainer<Referencable1WithChildren>;

    @attribute()
    name: string = "referencable3";

    constructor() {
        super();
        this._c1_2_reversed = new ReLinkListContainer(this, Referencable3WithChildren.c1_2_reversed_prefix, Referencable1WithChildren.c1_2_prefix)
    }
    addc1_2_reversed(...c1s: Referencable1WithChildren[]) {
        c1s.map(c1 => this._c1_2_reversed.add(c1))
    }
}



export type Referencable1WithChildrenJson = JsonOf<Referencable1WithChildren>
export type Referencable2WithChildrenJson = JsonOf<Referencable2WithChildren>
export type Referencable3WithChildrenJson = JsonOf<Referencable3WithChildren>

