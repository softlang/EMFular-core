import { ReLinkListContainer } from './re-link-list-container';
import {ReferencableTester} from "../../../test/referencable-tester";
import {RootWithChildren, ReChild3} from "../../../test/referencables-with-children";
import { DeletionMode } from '../../../../utils/deletion-mode';

describe('ReLinkListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReLinkListContainer(tester, 'refName', false)).toBeTruthy();
  });

  it("should give true if the remove and remove inverse chain triggered an element removal", () => {
    let tester = new RootWithChildren()
    let elem2 = new ReChild3()
    expect(tester._link3.remove(elem2, DeletionMode.RELAXED)).toBeFalse()
    tester.addLink3(elem2)
    expect(tester._link3.get().length).toBe(1)
    expect(tester._link3.get()).toContain(elem2)
    expect(tester._link3.remove(elem2, DeletionMode.RELAXED)).toBeTrue()
    expect(tester._link3.get().length).toBe(0)
  })
});
