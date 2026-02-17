import {ReferencableTester} from "../../test/referencable-tester";
import {RootWithChildren, ReChild3} from "../../test/referencables-with-children";
import {Referencable} from "../referenceable";
import {ReSingleContainer} from "./re-single-container";

describe('ReferencableListContainer', () => {
  class ReListTester<T extends Referencable<P>, P extends Referencable> extends ReSingleContainer<T,P> {
    constructor(parent: P, referenceName: string, inverseName?: string ) {
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
    let tester = new RootWithChildren()
    let elem2 = new ReChild3()
    expect(tester._link3.remove(elem2)).toBeFalse()
    tester.addLink3(elem2)
    expect(tester._link3.get().length).toBe(1)
    expect(tester._link3.get()).toContain(elem2)
    expect(tester._link3.remove(elem2)).toBeTrue()
    expect(tester._link3.get().length).toBe(0)
  })
});
