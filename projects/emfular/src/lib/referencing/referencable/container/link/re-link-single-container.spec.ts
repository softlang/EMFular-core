import {ReLinkSingleContainer} from './re-link-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";
import {
  ReContainersWithSingleChild,
  ReContainersWithSingleChild2,
  ReSingleChildExample,
  ReSingleChildExample2
} from "../../../test/re-containers-with-single-child";
import {DeletionMode} from "../../../../utils/deletion-mode";

describe('ReLinkSingleContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReLinkSingleContainer(tester, 'refName', refTesterRef.references.test)).toBeTruthy();
  });

  it('should remove child from container without it getting removed from other containers, even if required reference is removed', () => {
    let tester1 = new ReContainersWithSingleChild();
    let middle1 = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    let tester2 = new ReContainersWithSingleChild2();
    let middle2 = new ReSingleChildExample2();
    let elem2 = new ReContainersWithSingleChild2();
    tester1.child.assign(middle1);
    middle1.otherLink.assign(elem1);
    tester2.child.assign(middle2);
    middle2.otherLink.assign(elem2);
    expect(tester1.child.value).toBeDefined();
    expect(tester1.child.value).toEqual(middle1);
    expect(tester2.child.value).toBeDefined();
    expect(tester2.child.value).toEqual(middle2);
    expect(middle1.myParent.value).toBeDefined();
    expect(middle1.myParent.value).toEqual(tester1);
    expect(middle2.myParent.value).toBeDefined();
    expect(middle2.myParent.value).toEqual(tester2);
    expect(middle1.otherLink.value).toBeDefined();
    expect(middle1.otherLink.value).toEqual(elem1);
    expect(middle2.otherLink.value).toBeDefined();
    expect(middle2.otherLink.value).toEqual(elem2);
    expect(elem1.link.value).toBeDefined();
    expect(elem1.link.value).toEqual(middle1);
    expect(elem2.link.value).toBeDefined();
    expect(elem2.link.value).toEqual(middle2);
    expect(elem1.$otherReferences[0].remove(middle1)).toBeTrue();
    expect(elem2.$otherReferences[0].remove(middle2)).toBeTrue();
    expect(tester1.child.value).toBeDefined();
    expect(tester1.child.value).toEqual(middle1);
    expect(tester2.child.value).toBeDefined();
    expect(tester2.child.value).toEqual(middle2);
    expect(middle1.myParent.value).toBeDefined();
    expect(middle1.myParent.value).toEqual(tester1);
    expect(middle2.myParent.value).toBeDefined();
    expect(middle2.myParent.value).toEqual(tester2);
    expect(middle1.otherLink.value).toBeUndefined();
    expect(middle2.otherLink.value).toBeUndefined();
    expect(elem1.link.value).toBeUndefined();
    expect(elem2.link.value).toBeUndefined();
  });

  it('should raise exceptions on single proxy assignment', () => {
    let tester1 = new ReContainersWithSingleChild();
    let middle1 = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    let tester2 = new ReContainersWithSingleChild2();
    let middle2 = new ReSingleChildExample2();
    let middle2b = new ReSingleChildExample2();
    let elem2 = new ReContainersWithSingleChild2();
    let elem2b = new ReContainersWithSingleChild2();
    tester1.child.assign(middle1);
    middle1.otherLink.assign(elem1);
    tester2.child.assign(middle2);
    middle2.otherLink.assign(elem2);
    middle2b.otherLink.assign(elem2b);

    expect(middle1.otherLink.value).toBeDefined();
    expect(middle1.otherLink.value).toEqual(elem1);
    expect(middle2.otherLink.value).toBeDefined();
    expect(middle2.otherLink.value).toEqual(elem2);

    expect(() => {
      middle2.otherLink = middle1.otherLink;
    }).toThrow();
    expect(() => {
      middle2.otherLink = middle2b.otherLink;
    }).toThrow();
  })

  it('should remove reference from container, triggering its deletion in case of required reference getting removed', () => {
    let tester1 = new ReContainersWithSingleChild();
    let middle1 = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    let tester2 = new ReContainersWithSingleChild2();
    let middle2 = new ReSingleChildExample2();
    let elem2 = new ReContainersWithSingleChild2();
    tester1.child.assign(middle1);
    middle1.otherLink.assign(elem1);
    tester2.child.assign(middle2);
    middle2.otherLink.assign(elem2);
    expect(tester1.child.value).toBeDefined();
    expect(tester1.child.value).toEqual(middle1);
    expect(tester2.child.value).toBeDefined();
    expect(tester2.child.value).toEqual(middle2);
    expect(middle1.myParent.value).toBeDefined();
    expect(middle1.myParent.value).toEqual(tester1);
    expect(middle2.myParent.value).toBeDefined();
    expect(middle2.myParent.value).toEqual(tester2);
    expect(middle1.otherLink.value).toBeDefined();
    expect(middle1.otherLink.value).toEqual(elem1);
    expect(middle2.otherLink.value).toBeDefined();
    expect(middle2.otherLink.value).toEqual(elem2);
    expect(elem1.link.value).toBeDefined();
    expect(elem1.link.value).toEqual(middle1);
    expect(elem2.link.value).toBeDefined();
    expect(elem2.link.value).toEqual(middle2);
    expect(elem1.$otherReferences[0].remove(middle1, DeletionMode.CASCADE)).toBeTrue();
    expect(elem2.$otherReferences[0].remove(middle2, DeletionMode.CASCADE)).toBeTrue();
    expect(tester1.child.value).toBeDefined();
    expect(tester1.child.value).toEqual(middle1);
    expect(tester2.child.value).toBeUndefined();
    expect(middle1.myParent.value).toBeDefined();
    expect(middle1.myParent.value).toEqual(tester1);
    expect(middle2.myParent.value).toBeUndefined();
    expect(middle1.otherLink.value).toBeUndefined();
    expect(middle2.otherLink.value).toBeUndefined();
    expect(elem1.link.value).toBeUndefined();
    expect(elem2.link.value).toBeUndefined();
  });
});
