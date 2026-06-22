# Referencable Runtime

This directory contains the reference runtime for EMFular model elements. The code here is responsible for object identity, containment parents, containment children, cross-object links, inverse reference updates, serialization references, deserialization hooks, and controlled list mutation.

The implementation has three reference categories:

- Tree references own their children and serialize them inline.
- Link references point to existing objects and serialize as `Ref` values.
- Shallow and derived references expose computed or parent relationships without owning serialized state.

## Top-Level Files

### `referenceable.ts`

Defines `Referencable<Parent>`, the abstract base class for generated model classes.

Fields and metadata:

- `$gId`: generated UUID for graphical identity.
- `$classMeta`: class metadata supplied by the binding layer.
- `$modelMeta`: model metadata supplied by the binding layer.
- `$ParentType`: TypeScript-only marker for the expected containment parent type.

Public modeling API:

- `$getEParent()`: returns the current containment parent by reading the hidden parent container.
- `$getEClass()`: resolves the instance eClass through `ModelRegistry`.
- `$destruct(mode = DeletionMode.RELAXED)`: removes this object from its containment parent, removes inverse links from linked objects, and deletes contained tree children. Parent removal is always performed in relaxed mode to avoid recursive deletion loops.
- `toJson(ctxOpt?)`: serializes the object. If no `SerializationContext` is provided, it walks to the tree root first and assigns `Ref` paths from the root downward before serializing attributes and references.

Private serialization helpers:

- `attributesToJson(json)`: serializes decorated attributes, skips `undefined`, empty strings, `false`, and configured default values, and respects `jsonName` aliases.
- `referencesToJson(json, ctx)`: serializes tree and link containers, omitting `undefined` and empty arrays.
- `initReferences()`: executes prototype reference initializers stored under `REFERENCE_INITIALIZERS`.

`ReferenceApi<Self, Parent>` is the symbol-backed internal API exposed through `REFERENCE_INTERNAL_API`. Containers use it to interact with a `Referencable` without accessing private fields directly.

Internal API methods:

- `serialize_assignRefs(ctx, path)`: stores this object's `Ref` in the context and asks tree children to assign their refs.
- `deserializeAttributes(json)`: applies JSON attribute values and configured defaults.
- `deserializeChildren(context, parent, json)`: builds containment children from JSON.
- `deserializeOtherReferences(context, json)`: resolves link references and then resolves references inside tree children.
- `treeChildren()`: returns registered tree child containers.
- `otherLinks()`: returns registered link containers.
- `getContainer(refName)`: finds the reference metadata on the prototype chain and returns the initialized hidden container.
- `getParentContainer()`: returns the tree container that currently owns this instance.
- `setParentContainer(parent)`: switches the owner container, removing the instance from the previous owner first.
- `addToReference(name, item)`: adds an item to a named reference. Link containers use this for inverse updates.
- `removeFromReference(name, item, mode)`: removes an item from a named reference. In cascade mode, if a required reference becomes empty, the owning parent is destructed.

### `referencable-symbols.ts`

Exports the symbols used for hidden reference machinery.

- `REFERENCE_INTERNAL_API`: key for each instance's internal reference API.
- `REFERENCE_INITIALIZERS`: key for per-class hidden container initializer functions.

### `referenceable.spec.ts`

Placeholder test suite for `Referencable` construction.

## Base Container Files

### `container/re-container.ts`

Defines `ReContainer<T, P>`, the abstract base for every reference container.

Constructor state:

- `_parent`: object that owns the container.
- `meta`: `ReferenceMeta` describing the reference.
- `referenceName`: name used for metadata and JSON fields.
- `inverseName`: configured opposite reference, if any.
- `isRequired`: true when `meta.min` is greater than zero.

Methods:

- `get()`: abstract read method returning one object, many objects, or `undefined`.
- `add(item)`: checks the item type against the target eClass and calls `addWithoutTypeCheck`; returns `false` for rejected types.
- `addWithoutTypeCheck(item)`: subclass hook for actual insertion.
- `isAcceptableItem(item)`: checks whether the item is an instance of the target class from `ModelRegistry`.
- `isAcceptableEclass(eClass)`: instantiates the class for an eClass and validates it with `isAcceptableItem`.
- `remove(item, mode?)`: abstract removal hook.
- `delete(mode?)`: abstract cleanup hook for deleting all values owned by the container.
- `toJson(ctx)`: abstract serialization hook.

### `container/re-single-container.ts`

Defines `ReSingleContainer<T, P>`, the base for single-valued references.

- `_instance`: protected optional stored reference.
- `get()`: returns `_instance`.

### `container/re-list-container.ts`

Defines `ReListContainer<T, P>`, the base for list-valued references.

- `_instance`: backing array.
- `proxy`: lazily-created `ModelList<T>` wrapper from `createListProxy`.
- `get()`: returns the backing array.
- `delete(mode = RELAXED)`: destructs every element from the changing list through `ListUpdater`.
- `move(from, to)`: moves an item inside the backing array and throws on invalid indexes.
- `swap(from, to)`: swaps two items and throws on invalid indexes.

### `container/re-single-interface.ts`

Defines the single-reference interface.

- `get()`: returns one referenced object or `undefined`.

### `container/re-list-interface.ts`

Defines the list-reference interface.

- `proxy`: controlled array-like `ModelList<T>`.
- `get()`: returns the referenced objects.
- `move(from, to)`: reorders an object.
- `swap(from, to)`: swaps two objects.

## Tree Container Files

Tree containers implement containment. They register themselves with `treeChildren()` on the parent, serialize children inline, and maintain each child's parent container.

### `container/tree/re-tree-children-container.ts`

Shared interface for containment containers.

- `assignRefs(ctx, path)`: assigns serialization refs to contained children.
- `toJson(ctx)`: serializes contained children.
- `fromJson(formerPrefix, context, json)`: creates child backbones from JSON.
- `createRefsOnChildren(context, json)`: resolves child links after the containment backbone exists.

### `container/tree/re-tree-single-container.ts`

Single-valued containment container.

- `constructor(parent, referenceName, refMeta, eClass?)`: stores an optional default eClass and registers the container as a tree child container.
- `assignRefs(ctx, path)`: assigns the contained child's ref path using the reference name.
- `toJson(ctx)`: serializes the contained child or returns `undefined`.
- `addWithoutTypeCheck(item)`: sets the item as the contained child and updates its parent container; returns `false` if the same item is already set.
- `remove(item, mode = RELAXED)`: in relaxed mode clears the reference and parent container; in cascade mode destructs the child.
- `delete(mode = RELAXED)`: cascades destruction in cascade mode, otherwise removes the current child from its parent container.
- `fromJson(formerPrefix, context, json)`: determines the eClass, creates a `Ref`, creates the tree backbone via `Deserializer`, and adds it.
- `createRefsOnChildren(context, json)`: resolves the contained child's non-containment references.

### `container/tree/re-tree-list-container.ts`

List-valued containment container.

- `constructor(parent, name, refMeta, eClass?)`: stores an optional default eClass and registers the container as a tree child container.
- `assignRefs(ctx, path)`: assigns indexed child ref paths.
- `toJson(ctx)`: serializes each contained child.
- `addWithoutTypeCheck(item)`: moves the item out of its old parent, updates its parent container, and adds it if missing.
- `remove(item, mode = RELAXED)`: in relaxed mode removes the item and clears its parent container; in cascade mode destructs the item if present.
- `fromJson(formerPrefix, context, json)`: determines all child eClasses, creates child refs, creates child backbones, and adds them.
- `createRefsOnChildren(context, json)`: resolves each child's non-containment references when the JSON array length matches the current list.

The adjacent `*.spec.ts` files verify containment behavior, parent updates, ordering, deserialization, and deletion modes.

## Link Container Files

Link containers implement non-containment references. They register with `otherLinks()` on the parent, serialize as refs from `SerializationContext`, and maintain configured opposite references.

### `container/link/re-link-container.ts`

Shared interface for link containers.

- `removeFromInverse(item, mode?)`: removes inverse references related to the supplied item.
- `toJson(ctx)`: serializes links as one `Ref`, many `Ref` values, or `undefined`.

### `container/link/re-link-single-container.ts`

Single-valued non-containment link.

- `constructor(parent, referenceName, refMeta)`: registers the container as a link container.
- `set(instance)`: replaces the stored instance and updates the configured inverse reference. The old inverse is removed in relaxed mode.
- `addWithoutTypeCheck(item)`: sets the link unless the item is already linked.
- `remove(item, mode = RELAXED)`: clears the link and removes the inverse reference when configured.
- `delete(mode = RELAXED)`: destructs the currently linked instance.
- `removeFromInverse(item, mode = RELAXED)`: asks the linked instance to remove the supplied item from the inverse reference.
- `toJson(ctx)`: returns the linked instance's `Ref` or `undefined`.

### `container/link/re-link-list-container.ts`

List-valued non-containment link.

- `constructor(parent, name, refMeta)`: registers the container as a link container.
- `addWithoutTypeCheck(item)`: adds the item if missing and updates the configured inverse reference.
- `toJson(ctx)`: returns a `Ref` for every linked item.
- `remove(item, mode = RELAXED)`: removes the item and updates the configured inverse reference.
- `delete(mode = RELAXED)`: removes every linked item through `remove()`, so inverse references are cleaned up as the list is emptied.
- `removeFromInverse(item, mode = RELAXED)`: asks every linked child to remove the supplied item from the inverse reference.

The adjacent specs cover single and list link behavior, including inverse updates and deletion behavior.

## Shallow And Derived Container Files

Shallow and derived containers expose relationships that are not stored as normal serialized references.

### `container/shallow/re-shallow-interface.ts`

Shared interface for shallow references.

- `toJson(ctx)`: returns either `undefined` or an empty list because shallow references do not serialize owned state.

### `container/shallow/re-tree-parent-container.ts`

Single-valued shallow view of an object's containment parent.

- `constructor(parent, referenceName, refMeta)`: creates the shallow parent container. The reference name is not used directly.
- `get()`: returns `_parent.$getEParent()`.
- `addWithoutTypeCheck(item)`: adds this object to the inverse tree reference on `item`.
- `remove(item, mode = RELAXED)`: removes this object from the inverse tree reference on `item`.
- `delete()`: no-op.
- `toJson(ctx)`: returns `undefined`.

### `container/shallow/re-derivation-resolver.ts`

Helper for derived references.

- `constructor(computeOrSymbol)`: accepts either a compute function or a symbol identifying a method on the parent.
- `resolve(parent)`: resolves and caches the compute function, binding symbol-derived methods to the parent instance, then returns the computed value.

### `container/shallow/re-derived-single-container.ts`

Read-only single-valued derived reference.

- `constructor(parent, computeOrSymbol, referenceName, refMeta)`: creates a resolver-backed reference.
- `get()`: returns the resolver result.
- `toJson(ctx)`: returns `undefined`.
- `addWithoutTypeCheck(item)`: returns `false`.
- `remove(item)`: returns `false`.
- `delete()`: no-op.

### `container/shallow/re-derived-list-container.ts`

Read-only list-valued derived reference.

- `constructor(parent, computeOrSymbol, referenceName, refMeta)`: creates a resolver-backed derived list.
- `proxy`: lazily-created controlled `ModelList<T>`.
- `get()`: returns a defensive copy of the resolver result.
- `toJson(ctx)`: returns an empty list.
- `addWithoutTypeCheck(item)`: returns `false`.
- `remove(item)`: returns `false`.
- `delete()`: no-op.
- `move(from, to)`: no-op.
- `swap(from, to)`: no-op.

The shallow specs cover parent references and derived single/list resolution.

## Hidden List Proxy Files

### `container/hide/model-list.ts`

Defines the array-like types used by list containers.

- `RefKind`: union of `tree`, `link`, and `parent` reference kinds.
- `SingleRef<T, Kind>`: single-value reference type alias.
- `ModelList<T>`: public list proxy type alias.
- `MetaAwareModelList<T, Kind>`: array interface with controlled mutation helpers.

`MetaAwareModelList` adds:

- `move(from, to)`
- `swap(from, to)`
- `remove(...items)`
- `removeCascade(...items)`
- `delete()`
- `__item` and `__kind` type markers

Direct index assignment is marked deprecated because the proxy rejects it at runtime.

### `container/hide/list-proxy.ts`

Defines `createListProxy(container)`, which wraps a `ReListInterface` in an array-like `Proxy`.

Read behavior:

- Numeric property reads return items from `container.get()`.
- `length`, `in`, own keys, and iteration reflect the current container contents.
- Non-mutating array methods are delegated to `Array.prototype` on the current list.

Supported mutation behavior:

- `push(...items)`: adds through `container.add()` and returns the new length.
- `remove(...items)`: removes items in relaxed mode and returns whether any removal happened.
- `removeCascade(...items)`: removes items in cascade mode and returns whether any removal happened.
- `delete(mode?)`: calls `container.delete(mode)`.
- `pop(mode?)`: removes and returns the last item.
- `shift(mode?)`: removes and returns the first item.
- `unshift(...items)`: rebuilds the list with new items at the front.
- `splice(start, deleteCount, ...items)`: removes, adds, and reorders through container operations.
- `move(from, to)`: delegates to `container.move()`.
- `swap(from, to)`: bounds-checks and swaps via container moves.
- `sort(compareFn?)`: sorts a copy and reorders through `container.move()`.
- `reverse()`: reverses by reordering through `container.move()`.

Rejected operations:

- `at()`
- `fill()`
- `copyWithin()`
- Direct numeric index assignment
- Direct `length` assignment
- Deleting non-index properties

Deleting a numeric index destructs the object at that index when the index exists.
