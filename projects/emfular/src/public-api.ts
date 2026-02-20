/*
 * Public API Surface of emfular
 */

export * from './lib/referencing/ref/ref';
export * from './lib/referencing/ref/ref-handler';
export * from './lib/referencing/referencable/referenceable';
export * from './lib/referencing/referencable/container/re-container';
export * from './lib/referencing/referencable/container/link/re-link-container'
export * from './lib/referencing/referencable/container/link/re-link-list-container'
export * from './lib/referencing/referencable/container/link/re-link-single-container'
export * from './lib/referencing/referencable/container/tree/re-tree-children-container';
export * from './lib/referencing/referencable/container/tree/re-tree-list-container';
export * from './lib/referencing/referencable/container/tree/re-tree-single-container';
export * from './lib/referencing/referencable/container/tree/re-tree-parent-container';

export * from './lib/serialization/deserializer';
export * from './lib/serialization/json-deserializable';
export * from './lib/serialization/serialization-context';
export * from './lib/utils/list-updater';
export * from './lib/utils/json-comparer';

export * from './lib/binding/model-registry'
export * from './lib/binding/attribute-decorator'
export * from './lib/binding/attribute-collector'
export * from './lib/binding/eclass-decorator'
export * from './lib/binding/model-definition'
export * from './lib/binding/model-root'
