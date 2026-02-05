import { ReTreeListContainer } from './re-tree-list-container';
import {ReferencableTester} from "../../../test/referencable-tester";

describe('ReferencableTreeListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeListContainer(tester, 'refName')).toBeTruthy();
  });
});
