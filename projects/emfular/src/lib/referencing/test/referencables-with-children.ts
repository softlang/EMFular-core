import {ReTreeListContainer} from "../referencable/container/tree/re-tree-list-container";
import {Referencable} from "../referencable/referenceable";
import {Ref} from "../ref/ref";
import {ReLinkListContainer} from "../referencable/container/link/re-link-list-container";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {EClasses} from "./eclasses";

@eClass(EClasses.Referencable1WithChildren)
export class Referencable1WithChildren extends Referencable {

    static readonly c1_1_prefix: string = "c1_1";
    static readonly c1_2_prefix: string = "c1_2";

    readonly _c1_1: ReTreeListContainer<Referencable2WithChildren>;
    readonly _c1_2: ReLinkListContainer<Referencable3WithChildren>;

    @attribute()
    name: string = "referencable1";

    constructor(ref: Ref) {
        super(ref);
        this._c1_1 = new ReTreeListContainer<Referencable2WithChildren>(this, Referencable1WithChildren.c1_1_prefix);
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
    static readonly c2_1_prefix: string = "c2_1";
    readonly _c2_1: ReTreeListContainer<Referencable3WithChildren>;

    @attribute()
    name: string = "referencable2";

    constructor(ref: Ref) {
        super(ref);
        this._c2_1 = new ReTreeListContainer<Referencable3WithChildren>(this, Referencable2WithChildren.c2_1_prefix)
    }

    addc2_1(...c3s: Referencable3WithChildren[]) {
        c3s.map(c3 => this._c2_1.add(c3))
    }
}

@eClass(EClasses.Referencable3WithChildren)
export class Referencable3WithChildren extends Referencable {
    static readonly c1_2_reversed_prefix: string = "c1_2_reversed";
    readonly _c1_2_reversed: ReLinkListContainer<Referencable1WithChildren>;

    @attribute()
    name: string = "referencable3";

    constructor(ref: Ref) {
        super(ref);
        this._c1_2_reversed = new ReLinkListContainer<Referencable1WithChildren>(this, Referencable3WithChildren.c1_2_reversed_prefix, Referencable1WithChildren.c1_2_prefix)
    }
    addc1_2_reversed(...c1s: Referencable1WithChildren[]) {
        c1s.map(c1 => this._c1_2_reversed.add(c1))
    }
}
