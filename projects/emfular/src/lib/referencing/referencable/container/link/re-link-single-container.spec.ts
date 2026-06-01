import {ReLinkSingleContainer} from './re-link-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";
import {
  ReContainersWithSingleChild,
  ReContainersWithSingleChild2,
  ReSingleChildExample,
  ReSingleChildExample2
} from "../../../test/re-containers-with-single-child";
import {DeletionMode} from "../../../../utils/deletion-mode";
import {REFERENCE_INTERNAL_API} from "../../referencable-symbols";

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
    tester1.child = middle1;
    middle1.otherLink = elem1;
    tester2.child = middle2;
    middle2.otherLink = elem2;
    expect(tester1.child).toBeDefined();
    expect(tester1.child).toEqual(middle1);
    expect(tester2.child).toBeDefined();
    expect(tester2.child).toEqual(middle2);
    expect(middle1.myParent).toBeDefined();
    expect(middle1.myParent).toEqual(tester1);
    expect(middle2.myParent).toBeDefined();
    expect(middle2.myParent).toEqual(tester2);
    expect(middle1.otherLink).toBeDefined();
    expect(middle1.otherLink).toEqual(elem1);
    expect(middle2.otherLink).toBeDefined();
    expect(middle2.otherLink).toEqual(elem2);
    expect(elem1.link).toBeDefined();
    expect(elem1.link).toEqual(middle1);
    expect(elem2.link).toBeDefined();
    expect(elem2.link).toEqual(middle2);
    expect(elem1[REFERENCE_INTERNAL_API].otherLinks()[0].remove(middle1)).toBeTrue();
    expect(elem2[REFERENCE_INTERNAL_API].otherLinks()[0].remove(middle2)).toBeTrue();
    expect(tester1.child).toBeDefined();
    expect(tester1.child).toEqual(middle1);
    expect(tester2.child).toBeDefined();
    expect(tester2.child).toEqual(middle2);
    expect(middle1.myParent).toBeDefined();
    expect(middle1.myParent).toEqual(tester1);
    expect(middle2.myParent).toBeDefined();
    expect(middle2.myParent).toEqual(tester2);
    expect(middle1.otherLink).toBeUndefined();
    expect(middle2.otherLink).toBeUndefined();
    expect(elem1.link).toBeUndefined();
    expect(elem2.link).toBeUndefined();
  });

  it('should remove reference from container, triggering its deletion in case of required reference getting removed', () => {
    let tester1 = new ReContainersWithSingleChild();
    let middle1 = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    let tester2 = new ReContainersWithSingleChild2();
    let middle2 = new ReSingleChildExample2();
    let elem2 = new ReContainersWithSingleChild2();
    tester1.child = middle1;
    middle1.otherLink = elem1;
    tester2.child = middle2;
    middle2.otherLink = elem2;
    expect(tester1.child).toBeDefined();
    expect(tester1.child).toEqual(middle1);
    expect(tester2.child).toBeDefined();
    expect(tester2.child).toEqual(middle2);
    expect(middle1.myParent).toBeDefined();
    expect(middle1.myParent).toEqual(tester1);
    expect(middle2.myParent).toBeDefined();
    expect(middle2.myParent).toEqual(tester2);
    expect(middle1.otherLink).toBeDefined();
    expect(middle1.otherLink).toEqual(elem1);
    expect(middle2.otherLink).toBeDefined();
    expect(middle2.otherLink).toEqual(elem2);
    expect(elem1.link).toBeDefined();
    expect(elem1.link).toEqual(middle1);
    expect(elem2.link).toBeDefined();
    expect(elem2.link).toEqual(middle2);
    expect(elem1[REFERENCE_INTERNAL_API].otherLinks()[0].remove(middle1, DeletionMode.CASCADE)).toBeTrue();
    expect(elem2[REFERENCE_INTERNAL_API].otherLinks()[0].remove(middle2, DeletionMode.CASCADE)).toBeTrue();
    expect(tester1.child).toBeDefined();
    expect(tester1.child).toEqual(middle1);
    expect(tester2.child).toBeUndefined();
    expect(middle1.myParent).toBeDefined();
    expect(middle1.myParent).toEqual(tester1);
    expect(middle2.myParent).toBeUndefined();
    expect(middle1.otherLink).toBeUndefined();
    expect(middle2.otherLink).toBeUndefined();
    expect(elem1.link).toBeUndefined();
    expect(elem2.link).toBeUndefined();
  });
});
