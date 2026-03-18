import { ReDerivedSingleContainer } from './re-derived-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";

describe('ReDerivedSingleContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReDerivedSingleContainer<any, any>(tester, () => {},'refName',  refTesterRef.references.test, false)).toBeTruthy();
  });
});
