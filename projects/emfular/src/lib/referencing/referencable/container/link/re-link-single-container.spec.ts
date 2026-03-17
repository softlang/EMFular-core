import { ReLinkSingleContainer } from './re-link-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";

describe('ReLinkSingleContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReLinkSingleContainer(tester, 'refName',  refTesterRef.references.test)).toBeTruthy();
  });
});
