import {ReferencableTester} from "../../test/referencable-tester";
import {Referencable1WithChildren, Referencable3WithChildren} from "../../test/referencables-with-children";
import {Referencable} from "../referenceable";
import {ReSingleContainer} from "./re-single-container";

describe('ReferencableListContainer', () => {
  class ReListTester<T extends Referencable> extends ReSingleContainer<T> {
    constructor(parent: Referencable, referenceName: string, inverseName?: string ) {
      super(parent, referenceName, inverseName);
    }
    toJson(): any {
    }
  }
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReListTester(tester, 'refName')).toBeTruthy();
  });

  it("should give true if the remove and remove inverse chain triggered an element removal", () => {
    let tester = new Referencable1WithChildren()
    let elem2 = new Referencable3WithChildren()
    expect(tester._c1_2.remove(elem2)).toBeFalse()
    tester.addc1_2(elem2)
    expect(tester._c1_2.get().length).toBe(1)
    expect(tester._c1_2.get()).toContain(elem2)
    expect(tester._c1_2.remove(elem2)).toBeTrue()
    expect(tester._c1_2.get().length).toBe(0)
  })
});
