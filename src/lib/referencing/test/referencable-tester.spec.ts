import { describe, expect, it } from 'vitest';
import { ReferencableTester } from './referencable-tester';

describe('ReferencableTester', () => {
  it('should create an instance', () => {
    expect(
        new ReferencableTester()
    ).toBeTruthy();
  });
});
