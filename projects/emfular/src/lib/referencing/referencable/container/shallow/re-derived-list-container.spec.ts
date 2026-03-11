import { ReDerivedListContainer } from './re-derived-list-container';
import {ReferencableTester} from "../../../test/referencable-tester";

describe('ReDerivedListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReDerivedListContainer<any, any>(tester, () => [],'refName', 'opposite')).toBeTruthy();
  });
});
