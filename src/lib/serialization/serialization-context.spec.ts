import { SerializationContext } from './serialization-context';
import { describe, expect, it } from 'vitest';

describe('SerializationContext', () => {
  it('should create an instance', () => {
    expect(new SerializationContext()).toBeTruthy();
  });
});
