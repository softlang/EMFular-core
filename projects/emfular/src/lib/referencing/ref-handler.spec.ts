import { RefHandler } from './ref-handler';
import {Ref} from "./ref";

describe('RefHandler', () => {
  it('should create an instance', () => {
    expect(new RefHandler()).toBeTruthy();
  });

  it('should deliver the final part (after last .) from the string as number', () => {
    expect(RefHandler.getIndexFromString('/...../vhgvh.78')).toBe(78);
  })
});
