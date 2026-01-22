import { ReListContainer } from './re-list-container';
import {ReferencableTester} from "../../test/referencable-tester";
import {RefHandler} from "../../ref/ref-handler";
import {Referencable1WithChildren, Referencable3WithChildren} from "../../test/referencables-with-children";

describe('ReferencableListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Tester'))
    expect(new ReListContainer(tester, 'refName')).toBeTruthy();
  });

  it("should give true if the remove and remove inverse chain triggered an element removal", () => {
    let tester = new Referencable1WithChildren(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Referencable1WithChildren'))
    let elem2 = new Referencable3WithChildren(RefHandler.createRef('2', 'http://www.uni-koblenz.de/Referencable3WithChildren'))

    expect(tester._c1_2.remove(elem2)).toBeFalse()
    tester.addc1_2(elem2)
    expect(tester._c1_2.get().length).toBe(1)
    expect(tester._c1_2.get()).toContain(elem2)
    expect(tester._c1_2.remove(elem2)).toBeTrue()
    expect(tester._c1_2.get().length).toBe(0)
  })
});
