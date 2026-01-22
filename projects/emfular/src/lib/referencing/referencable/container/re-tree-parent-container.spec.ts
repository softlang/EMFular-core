import { ReTreeParentContainer } from './re-tree-parent-container';
import {ReferencableTester} from "../../test/referencable-tester";
import {RefHandler} from "../../ref/ref-handler";

describe('ReferencableTreeParentContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Tester'))
    expect(new ReTreeParentContainer(tester, 'refName')).toBeTruthy();
  });
});
