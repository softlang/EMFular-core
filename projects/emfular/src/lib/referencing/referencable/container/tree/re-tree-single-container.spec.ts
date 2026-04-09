import { ReTreeSingleContainer } from './re-tree-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";
import {ReContainersWithSingleChild, ReSingleChildExample} from "../../../test/re-containers-with-single-child";
import {DeletionMode} from "../../../../utils/deletion-mode";

describe('ReferencableTreeSingletonContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeSingleContainer(tester, 'test', refTesterRef.references.test)).toBeTruthy();
  });

  it('should be working', () => {
    let tester = new ReContainersWithSingleChild();
    let middle = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    tester.child = middle;
    middle.otherLink = elem1;
    expect(tester.child).toBeDefined();
    expect(tester.child).toEqual(middle);
    expect(middle.myParent).toBeDefined();
    expect(middle.myParent).toEqual(tester);
    expect(middle.otherLink).toBeDefined();
    expect(middle.otherLink).toEqual(elem1);
    expect(elem1.link).toBeDefined();
    expect(elem1.link).toEqual(middle);
    expect(tester.$treeChildren[0].remove(middle)).toBeTrue();
    expect(tester.child).toBeUndefined();
    expect(middle.myParent).toBeUndefined();
    expect(middle.otherLink).toBeDefined();
    expect(middle.otherLink).toEqual(elem1);
    expect(elem1.link).toBeDefined();
    expect(elem1.link).toEqual(middle);
  });

  it('should be working 2', () => {
    let tester = new ReContainersWithSingleChild();
    let middle = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    tester.child = middle;
    middle.otherLink = elem1;
    expect(tester.child).toBeDefined();
    expect(tester.child).toEqual(middle);
    expect(middle.myParent).toBeDefined();
    expect(middle.myParent).toEqual(tester);
    expect(middle.otherLink).toBeDefined();
    expect(middle.otherLink).toEqual(elem1);
    expect(elem1.link).toBeDefined();
    expect(elem1.link).toEqual(middle);
    expect(tester.$treeChildren[0].remove(middle, DeletionMode.CASCADE)).toBeTrue();
    expect(tester.child).toBeUndefined();
    expect(middle.myParent).toBeUndefined();
    expect(middle.otherLink).toBeUndefined();
    expect(elem1.link).toBeUndefined();
  });
});
