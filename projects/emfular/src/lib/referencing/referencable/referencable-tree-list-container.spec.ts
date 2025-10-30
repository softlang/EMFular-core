import { ReferencableTreeListContainer } from './referencable-tree-list-container';
import {ReferencableTester} from "../test/referencable-tester";
import {RefHandler} from "../ref/ref-handler";

describe('ReferencableTreeListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Tester'))
    expect(new ReferencableTreeListContainer(tester, 'refName')).toBeTruthy();
  });
});
