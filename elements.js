/*
    subUI
 
    Copyright (C) Subnodal Technologies. All Rights Reserved.
 
    https://subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/
 
// @namespace com.subnodal.subelements.elements
namespace("com.subnodal.subelements.elements", function(exports) {
    /*
        @name isVisible
        hether the given element is visible and interactable, based on its size
        information.
        @param element <Node> The element node to find using
        @param selector <String> The query selector to match the ancestor of
    */
    exports.isVisible = function(element) {
        return element.getClientRects().length > 0;
    };
 
    /*
        @name findAncestor
        Find an ancestor of self element that matches the given selector.
        @param element <Node> The element node to find using
        @param selector <String> The query selector to match the ancestor of
    */
    exports.findAncestor = function(element, selector) {
        while (element != document.body) {
            if (element.matches(selector)) {
                return element;
            }
 
            element = element.parentNode;

            if (!(element instanceof Element)) {
                return null;
            }
        }
 
        return null;
    };
 
    /*
        @name findPreviousOfType
        Find the previous instance of an element before the given element which
        matches the given selector.
        @param element <Node> The element node to find using
        @param selector <String> The query selector to match the previous type of
        @param mustBeVisible <Boolean = false> Whether the instance must be visible and interactable
    */
    exports.findPreviousOfType = function(element, selector, mustBeVisible = false) {
        while (true) {
            element = element.previousSibling;
 
            if (!element) {
                return null;
            }
 
            if (element.nodeType != Node.ELEMENT_NODE) {
                continue;
            }
 
            if (mustBeVisible && !exports.isVisible(element)) {
                continue;
            }
 
            if (element.matches(selector)) {
                return element;
            }
        }
    };
 
    /*
        @name findNextOfType
        Find the next instance of an element before the given element which
        matches the given selector.
        @param element <Node> The element node to find using
        @param selector <String> The query selector to match the next type of
        @param mustBeVisible <Boolean = false> Whether the instance must be visible and interactable
    */
    exports.findNextOfType = function(element, selector, mustBeVisible = false) {
        while (true) {
            element = element.nextSibling;
 
            if (!element) {
                return null;
            }
 
            if (element.nodeType != Node.ELEMENT_NODE) {
                continue;
            }
 
            if (mustBeVisible && !exports.isVisible(element)) {
                continue;
            }
 
            if (element.matches(selector)) {
                return element;
            }
        }
    };

    /*
        @name findPreviousOfTypeFromParent
        Find the previous instance of an element before the given element which
        matches the given selector, using a parent to select the previous
        element.
            ~~~~
            This can be useful for finding the previous element matching the
            same selector, but might not necessarily be a sibling of the given
            element.
        @param element <Node> The element node to find using
        @param selector <String> The query selector to match the previous type of
        @param parent <Node> The parent to find the element with
        @param mustBeVisible <Boolean = false> Whether the instance must be visible and interactable
    */
        exports.findPreviousOfTypeFromParent = function(element, selector, parent, mustBeVisible = false) {
            var children = parent.querySelectorAll(selector);
     
            if (mustBeVisible) {
                children = [...children].filter(exports.isVisible);
            }
     
            for (var i = 0; i < children.length; i++) {
                if (children[i].isEqualNode(element)) {
                    return children[i - 1] || null;
                }
            }
     
            return null;
        };
     
        /*
            @name findNextOfTypeFromParent
            Find the mext instance of an element before the given element which
            matches the given selector, using a parent to select the next element.
                ~~~~
                This can be useful for finding the next element matching the same
                selector, but might not necessarily be a sibling of the given
                element.
            @param element <Node> The element node to find using
            @param selector <String> The query selector to match the next type of
            @param parent <Node> The parent to find the element with
            @param mustBeVisible <Boolean = false> Whether the instance must be visible and interactable
        */
        exports.findNextOfTypeFromParent = function(element, selector, parent, mustBeVisible = false) {
            var children = parent.querySelectorAll(selector);
     
            if (mustBeVisible) {
                children = [...children].filter(exports.isVisible);
            }
     
            for (var i = 0; i < children.length; i++) {
                if (children[i].isEqualNode(element)) {
                    return children[i + 1] || null;
                }
            }
     
            return null;
        };
 
    /*
        @name attachSelectorEvent
        Attach an event which is specific to a given selector, and applies to
        all current and future events.
        @param type <String> The event type to capture
        @param selector <String> The query selector to match the event to
        @param callback <Function> The callback function to call when the event is triggered, where the first given argument is the matching element, and the second is the event
    */
    exports.attachSelectorEvent = function(type, selector, callback) {
        window.addEventListener(type, function(event) {
            var ancestor = exports.findAncestor(event.target, selector);
 
            if (ancestor != null) {
                callback(ancestor, event);
            }
        });
    };
});
// @endnamespace