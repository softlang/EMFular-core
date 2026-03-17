import { ReTreeListContainer } from './re-tree-list-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";

describe('ReferencableTreeListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeListContainer(tester, 'refName',  refTesterRef.references.test)).toBeTruthy();
  });
});
