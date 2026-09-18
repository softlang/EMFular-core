import { describe, expect, it } from 'vitest';

import { ReTreeListContainer } from './re-tree-list-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";
import {Middle2WithChildren, ReChild3, ReChild4, RootWithChildren, ReChildCircle} from "../../../test/referencables-with-children";
import {REFERENCE_INTERNAL_API} from "../../referencable-symbols";

describe('ReferencableTreeListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeListContainer(tester, 'refName',  refTesterRef.references.test)).toBeTruthy();
  });

  it("should give true if the remove and remove inverse chain triggered an element removal without removing element from different container", () => {
    let tester = new RootWithChildren()
    let middle = new Middle2WithChildren()
    let elem1 = new ReChild3()
    let elem2 = new ReChild4()
    expect(tester.child2.remove(middle)).toBeFalsy()
    tester.link3.push(elem1)
    tester.link4.push(elem2)
    tester.child2.push(middle)
    middle.child3.push(elem1)
    middle.child4.push(elem2)
    expect(tester.link3.length).toBe(1)
    expect(tester.link4.length).toBe(1)
    expect(tester.link3).toContain(elem1)
    expect(tester.link4).toContain(elem2)
    expect(middle.child3.length).toBe(1)
    expect(middle.child4.length).toBe(1)
    expect(middle.child3).toContain(elem1)
    expect(middle.child4).toContain(elem2)
    expect(elem1.link1.length).toBe(1)
    expect(elem2.link1.length).toBe(1)
    expect(elem1.link1).toContain(tester)
    expect(elem2.link1).toContain(tester)
    expect(elem1.parentPointer).toBeDefined()
    expect(elem2.parentPointer).toBeDefined()
    expect(elem1.parentPointer).toEqual(middle)
    expect(elem2.parentPointer).toEqual(middle)
    expect(tester.child2.remove(middle)).toBeTruthy()
    expect(tester.child2.length).toBe(0)
    expect(tester.link3.length).toBe(1)
    expect(tester.link4.length).toBe(1)
    expect(middle.child3.length).toBe(1)
    expect(middle.child4.length).toBe(1)
    expect(elem1.link1.length).toBe(1)
    expect(elem2.link1.length).toBe(1)
    expect(elem1.parentPointer).toBeDefined()
    expect(elem2.parentPointer).toBeDefined()
    expect(elem1.parentPointer).toEqual(middle)
    expect(elem2.parentPointer).toEqual(middle)
  });

  it("should give true if the removeCascade and remove inverse chain triggered an element removal, also removing it from other containers if required reference is deleted", () => {
    let tester = new RootWithChildren()
    let middle = new Middle2WithChildren()
    let elem1 = new ReChild3()
    let elem2 = new ReChild4()
    expect(tester.child2.removeCascade(middle)).toBeFalsy()
    tester.link3.push(elem1)
    tester.link4.push(elem2)
    tester.child2.push(middle)
    middle.child3.push(elem1)
    middle.child4.push(elem2)
    expect(tester.link3.length).toBe(1)
    expect(tester.link4.length).toBe(1)
    expect(tester.link3).toContain(elem1)
    expect(tester.link4).toContain(elem2)
    expect(middle.child3.length).toBe(1)
    expect(middle.child4.length).toBe(1)
    expect(middle.child3).toContain(elem1)
    expect(middle.child4).toContain(elem2)
    expect(elem1.link1.length).toBe(1)
    expect(elem2.link1.length).toBe(1)
    expect(elem1.link1).toContain(tester)
    expect(elem2.link1).toContain(tester)
    expect(elem1.parentPointer).toBeDefined()
    expect(elem2.parentPointer).toBeDefined()
    expect(elem1.parentPointer).toEqual(middle)
    expect(elem2.parentPointer).toEqual(middle)
    expect(tester.child2.removeCascade(middle)).toBeTruthy()
    expect(tester.child2.length).toBe(0)
    expect(tester.link3.length).toBe(0)
    expect(tester.link4.length).toBe(0)
    expect(middle.child3.length).toBe(0)
    expect(middle.child4.length).toBe(0)
    expect(elem1.link1.length).toBe(0)
    expect(elem2.link1.length).toBe(0)
    expect(elem1.parentPointer).toBeUndefined()
    expect(elem2.parentPointer).toBeUndefined()
  })

  it("should collect violations recursively, keyed by graphical id", () => {
    let root = new RootWithChildren();
    let middleChild = new Middle2WithChildren();
    let child = new ReChild4();
    root.child2.push(middleChild);
    middleChild.child4.push(child);
    const modelViolations = child.collectConstraintViolations();
    expect(modelViolations.size).toBe(1);
    expect(modelViolations.has(root.$gId)).toBeFalsy();
    expect(modelViolations.has(middleChild.$gId)).toBeFalsy();
    expect(modelViolations.has(child.$gId)).toBeTruthy();
    expect(modelViolations.get(child.$gId)).toBe(child[REFERENCE_INTERNAL_API].violations());
    expect(modelViolations.get(child.$gId)!.has("link1")).toBeTruthy();
    child.link1.push(new RootWithChildren());
    expect(root.collectConstraintViolations().size).toBe(0);
  })

  it("should collect violations recursively, keyed by graphical id", () => {
    let root = new RootWithChildren();
    let middleChild = new Middle2WithChildren();
    let child = new ReChild4();
    root.child2.push(middleChild);
    middleChild.child4.push(child);
    const modelViolations = root.collectConstraintViolations();
    expect(modelViolations.size).toBe(1);
    expect(modelViolations.has(root.$gId)).toBeFalsy();
    expect(modelViolations.has(middleChild.$gId)).toBeFalsy();
    expect(modelViolations.has(child.$gId)).toBeTruthy();
    expect(modelViolations.get(child.$gId)).toBe(child[REFERENCE_INTERNAL_API].violations());
    expect(modelViolations.get(child.$gId)!.has("link1")).toBeTruthy();
    child.link1.push(new RootWithChildren());
    expect(root.collectConstraintViolations().size).toBe(0);
  })

  it("should detect circular containment", () => {
    let root = new RootWithChildren();
    let child = new ReChildCircle();
    root.circleChild.push(child);
    child.closeCircle.push(root);
    const modelViolations = root.collectConstraintViolations();
    expect(modelViolations.size).toBe(1);
    expect(modelViolations.has(root.$gId)).toBeFalsy();
    expect(modelViolations.has(child.$gId)).toBeTruthy();
    expect(modelViolations.get(child.$gId)).toBe(child[REFERENCE_INTERNAL_API].violations());
    expect(modelViolations.get(child.$gId)!.has("closeCircle")).toBeTruthy();
    child.closeCircle.remove(root);
    expect(root.collectConstraintViolations().size).toBe(0);
  })

  it("create infinite loop from toJson() call", () => {
    let root = new RootWithChildren();
    let child = new ReChildCircle();
    root.circleChild.push(child);
    child.closeCircle.push(root);
    root.toJson();
  })
});
