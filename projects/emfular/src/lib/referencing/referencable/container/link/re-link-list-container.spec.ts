import { ReLinkListContainer } from './re-link-list-container';
import {ReferencableTester} from "../../../test/referencable-tester";
import {RootWithChildren, ReChild3} from "../../../test/referencables-with-children";

describe('ReLinkListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReLinkListContainer(tester, 'refName')).toBeTruthy();
  });

  it("should give true if the remove and remove inverse chain triggered an element removal", () => {
    let tester = new RootWithChildren()
    let elem2 = new ReChild3()
    expect(tester.link3.remove(elem2)).toBeFalse()
    tester.link3.push(elem2)
    expect(tester.link3.length).toBe(1)
    expect(tester.link3).toContain(elem2)
    expect(tester.link3.remove(elem2)).toBeTrue()
    expect(tester.link3.length).toBe(0)
  })
});
