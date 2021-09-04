# com.subnodal.subelements.elements
## ▶️ `attachSelectorEvent`
`function` · Attach an event which is specific to a given selector, and applies to all current and future events.

**Parameters:**
* **`type`** (`String`): The event type to capture
* **`selector`** (`String`): The query selector to match the event to
* **`callback`** (`Function`): The callback function to call when the event is triggered, where the first given argument is the matching element, and the second is the event

## ▶️ `findAncestor`
`function` · Find an ancestor of self element that matches the given selector.

**Parameters:**
* **`element`** (`Node`): The element node to find using
* **`selector`** (`String`): The query selector to match the ancestor of

## ▶️ `findNextOfType`
`function` · Find the next instance of an element before the given element which matches the given selector.

**Parameters:**
* **`element`** (`Node`): The element node to find using
* **`selector`** (`String`): The query selector to match the next type of
* **`mustBeVisible`** (`Boolean` = `false`): Whether the instance must be visible and interactable

## ▶️ `findNextOfTypeFromParent`
`function` · Find the mext instance of an element before the given element which matches the given selector, using a parent to select the next element.


This can be useful for finding the next element matching the same
selector, but might not necessarily be a sibling of the given
element.

**Parameters:**
* **`element`** (`Node`): The element node to find using
* **`selector`** (`String`): The query selector to match the next type of
* **`parent`** (`Node`): The parent to find the element with
* **`mustBeVisible`** (`Boolean` = `false`): Whether the instance must be visible and interactable

## ▶️ `findPreviousOfType`
`function` · Find the previous instance of an element before the given element which matches the given selector.

**Parameters:**
* **`element`** (`Node`): The element node to find using
* **`selector`** (`String`): The query selector to match the previous type of
* **`mustBeVisible`** (`Boolean` = `false`): Whether the instance must be visible and interactable

## ▶️ `findPreviousOfTypeFromParent`
`function` · Find the previous instance of an element before the given element which matches the given selector, using a parent to select the previous element.


This can be useful for finding the previous element matching the
same selector, but might not necessarily be a sibling of the given
element.

**Parameters:**
* **`element`** (`Node`): The element node to find using
* **`selector`** (`String`): The query selector to match the previous type of
* **`parent`** (`Node`): The parent to find the element with
* **`mustBeVisible`** (`Boolean` = `false`): Whether the instance must be visible and interactable

## ▶️ `isVisible`
`function` · hether the given element is visible and interactable, based on its size information.

**Parameters:**
* **`element`** (`Node`): The element node to find using
* **`selector`** (`String`): The query selector to match the ancestor of