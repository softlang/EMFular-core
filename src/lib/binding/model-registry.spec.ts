import { ModelRegistry } from './model-registry';
import { describe, expect, it } from 'vitest';

describe('ModelRegistry', () => {
  it('should create an instance', () => {
    expect(new ModelRegistry()).toBeTruthy();
  });
});
