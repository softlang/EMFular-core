import {ReferencableTreeListContainer} from "../referencable/referencable-tree-list-container";
import {Referencable} from "../referencable/referenceable";
import {Ref} from "../ref/ref";
import {ReListContainer} from "../referencable/re-list-container";
import {
    Referencable1WithChildrenJson,
    Referencable2WithChildrenJson,
    Referencable3WithChildrenJson
} from "./referencables-with-children-json";

export class Referencable1WithChildren extends Referencable {

    static readonly c1_1_prefix: string = "c1_1";
    static readonly c1_2_prefix: string = "c1_2";


    readonly _c1_1: ReferencableTreeListContainer<Referencable2WithChildren>;
    readonly _c1_2: ReListContainer<Referencable3WithChildren>;

    constructor(ref: Ref) {
        super(ref);
        this._c1_1 = new ReferencableTreeListContainer<Referencable2WithChildren>(this, Referencable1WithChildren.c1_1_prefix);
        this._c1_2 = new ReListContainer(this, Referencable1WithChildren.c1_1_prefix, Referencable3WithChildren.c1_2_reversed_prefix);

        this.$treeChildren.push(this._c1_1)
        this.$otherReferences.push(this._c1_2)
    }

    addc1_1(...c2s: Referencable2WithChildren[]) {
        c2s.map(c2 => this._c1_1.add(c2))
    }
    addc1_2(...c3s: Referencable3WithChildren[]) {
        c3s.map(c3 => this._c1_2.add(c3))
    }

    override toJson(): Referencable1WithChildrenJson {
        return {
            c1_1: this._c1_1.toJson(),
            c1_2: this._c1_2.toJson(),
        }
    }
}

export class Referencable2WithChildren extends Referencable {
    static readonly c2_1_prefix: string = "c2_1";
    readonly _c2_1: ReferencableTreeListContainer<Referencable3WithChildren>;

    constructor(ref: Ref) {
        super(ref);
        this._c2_1 = new ReferencableTreeListContainer<Referencable3WithChildren>(this, Referencable2WithChildren.c2_1_prefix)
        this.$treeChildren.push(this._c2_1)
    }

    addc2_1(...c3s: Referencable3WithChildren[]) {
        c3s.map(c3 => this._c2_1.add(c3))
    }

    override toJson(): Referencable2WithChildrenJson {
        return {
            c2_1: this._c2_1.toJson(),
        }
    }
}

export class Referencable3WithChildren extends Referencable {
    static readonly c1_2_reversed_prefix: string = "c1_2_reversed";
    readonly _c1_2_reversed: ReListContainer<Referencable1WithChildren>;

    constructor(ref: Ref) {
        super(ref);
        this._c1_2_reversed = new ReListContainer<Referencable1WithChildren>(this, Referencable3WithChildren.c1_2_reversed_prefix, Referencable1WithChildren.c1_2_prefix)
        this.$otherReferences.push(this._c1_2_reversed)
    }
    addc1_2_reversed(...c1s: Referencable1WithChildren[]) {
        c1s.map(c1 => this._c1_2_reversed.add(c1))
    }

    override toJson(): Referencable3WithChildrenJson {
        return {
            c1_2_reversed: this._c1_2_reversed.toJson()
        }
    }
}
