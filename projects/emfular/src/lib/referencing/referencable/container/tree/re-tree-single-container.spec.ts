import { ReTreeSingleContainer } from './re-tree-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";
import {ReContainersWithSingleChild, ReSingleChildExample} from "../../../test/re-containers-with-single-child";
import {DeletionMode} from "../../../../utils/deletion-mode";

describe('ReferencableTreeSingletonContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeSingleContainer(tester, 'test', refTesterRef.references.test)).toBeTruthy();
  });

  it('should remove child from specified container without it being deleted from any other references', () => {
    let tester = new ReContainersWithSingleChild();
    let middle = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    tester.child.assign(middle);
    middle.otherLink.assign(elem1);
    expect(tester.child).toBeDefined();
    expect(tester.child.value).toEqual(middle);
    expect(middle.myParent.value).toBeDefined();
    expect(middle.myParent.value).toEqual(tester);
    expect(middle.otherLink.value).toBeDefined();
    expect(middle.otherLink.value).toEqual(elem1);
    expect(elem1.link.value).toBeDefined();
    expect(elem1.link.value).toEqual(middle);
    expect(tester.$treeChildren[0].remove(middle)).toBeTrue();
    expect(tester.child.value).toBeUndefined();
    expect(middle.myParent.value).toBeUndefined();
    expect(middle.otherLink.value).toBeDefined();
    expect(middle.otherLink.value).toEqual(elem1);
    expect(elem1.link.value).toBeDefined();
    expect(elem1.link.value).toEqual(middle);
  });

  it('should remove child from specified container and delete its references from all other containers', () => {
    let tester = new ReContainersWithSingleChild();
    let middle = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    tester.child.assign(middle);
    middle.otherLink.assign(elem1);
    expect(tester.child.value).toBeDefined();
    expect(tester.child.value).toEqual(middle);
    expect(middle.myParent.value).toBeDefined();
    expect(middle.myParent.value).toEqual(tester);
    expect(middle.otherLink.value).toBeDefined();
    expect(middle.otherLink.value).toEqual(elem1);
    expect(elem1.link.value).toBeDefined();
    expect(elem1.link.value).toEqual(middle);
    expect(tester.$treeChildren[0].remove(middle, DeletionMode.CASCADE)).toBeTrue();
    expect(tester.child.value).toBeUndefined();
    expect(middle.myParent.value).toBeUndefined();
    expect(middle.otherLink.value).toBeUndefined();
    expect(elem1.link.value).toBeUndefined();
  });
});
