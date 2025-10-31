import {ReferencableTreeListContainer} from "../referencable/referencable-tree-list-container";
import {Referencable} from "../referencable/referenceable";
import {Ref} from "../ref/ref";
import {ReferencableListContainer} from "../referencable/referencable-list-container";

export class Referencable1WithChildren extends Referencable {

    static readonly c1_1_prefix: string = "c1_1";
    static readonly c1_2_prefix: string = "c1_2";


    private readonly _c1_1: ReferencableTreeListContainer<Referencable2WithChildren>;
    private readonly _c1_2: ReferencableListContainer<Referencable3WithChildren>;

    constructor(ref: Ref) {
        super(ref);
        this._c1_1 = new ReferencableTreeListContainer<Referencable2WithChildren>(this, Referencable1WithChildren.c1_1_prefix);
        this._c1_2 = new ReferencableListContainer(this, Referencable1WithChildren.c1_1_prefix, Referencable3WithChildren.c1_2_reversed_prefix);

        this.$treeChildren.push(this._c1_1)
        this.$otherReferences.push(this._c1_2)
    }
}

export class Referencable2WithChildren extends Referencable {
    static readonly c2_1_prefix: string = "c2_1";
    private readonly _c2_1: ReferencableTreeListContainer<Referencable3WithChildren>;

    constructor(ref: Ref) {
        super(ref);
        this._c2_1 = new ReferencableTreeListContainer<Referencable3WithChildren>(this, Referencable2WithChildren.c2_1_prefix)
        this.$treeChildren.push(this._c2_1)
    }
}

export class Referencable3WithChildren extends Referencable {
    static readonly c1_2_reversed_prefix: string = "c1_2_reversed";
    private readonly _c1_2_reversed: ReferencableListContainer<Referencable1WithChildren>;

    constructor(ref: Ref) {
        super(ref);
        this._c1_2_reversed = new ReferencableListContainer<Referencable1WithChildren>(this, Referencable3WithChildren.c1_2_reversed_prefix, Referencable1WithChildren.c1_2_prefix)
        this.$otherReferences.push(this._c1_2_reversed)
    }

}
