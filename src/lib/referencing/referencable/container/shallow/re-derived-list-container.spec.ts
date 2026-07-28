import { describe, expect, it } from 'vitest';

import { ReDerivedListContainer } from './re-derived-list-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";
import {ReChild3, ReChild4} from "../../../test/referencables-with-children";
import {REFERENCE_INTERNAL_API} from "../../referencable-symbols";

describe('ReDerivedListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReDerivedListContainer<any, any>(tester, () => [],'refName', refTesterRef.references.test)).toBeTruthy();
  });

  it('should correctly identify missing derived function', () => {
    let elem1 = new ReChild3();
    let elem2 = new ReChild4();
    elem1.collectConstraintViolations();
    expect(elem1[REFERENCE_INTERNAL_API].violations().has("link1Derived")).toBeTruthy();
    elem2.collectConstraintViolations();
    expect(elem2[REFERENCE_INTERNAL_API].violations().has("link1Derived")).toBeFalsy();
  });
});
