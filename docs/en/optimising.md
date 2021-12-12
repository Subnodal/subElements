# Optimising Rendering
If you find that the time it takes to render elements is very long, then it
might be beneficial to try out some of this optimisation tips with regards to
your HTML structure.

Slow rendering times are particularly attributed to `s-for` and `s-each` loops
since the rendering time may become multiplied depending on the number of
iterations made. If there are _n_ iterations to render, then the time it takes
to render a loop will be _n_ times the time it takes to render what's inside the
loop (this means that the time complexity will always be at least O(n) in
big-O notation).

Typically, the symptom of inefficient code is that the browser has to take a
long time to recalculate styles and reflow elements on the page. This can cause
the browser to hang. Eliminating reflow and style calculations is one of the
best ways to speed up rendering.

## Tip 1: use `s-defer` to defer rendering
Using the `s-defer` attribute on an element will attempt to render the element
off-DOM and then reattach the element to the DOM, meaning that styling isn't
calculated. Here's an example of using `s-defer`:

```html
<div s-defer>
    <h1>Complex rendering task</h1>
    <p>Hello, {{ name }}!</p>
</div>
```

## Tip 2: take `s-*` elements out of loops
Since `s-*` elements (such as `s-if`) don't have defined dimensions, the browser
has to recalculate styles for each `s-*` element that's being rendered from a
loop. Here's an example of inefficient code:

```html
<s-for var="i" start="0" stop="10">
    <s-if condition="{{ renderLoop == true }}">
        <p>This is item {{ i }}!</p>
    </s-if>
</s-for>
```

Since `renderLoop` will remain constant throughout the iterations, the `s-if`
element can be made the parent of `s-for` instead to achieve the same effect,
but in a more efficient way:

```html
<s-if condition="{{ renderLoop == true }}">
    <s-for var="i" start="0" stop="10">
        <p>This is item {{ i }}!</p>
    </s-for>
</s-if>
```

## Tip 3: use JavaScript to help with `s-each`
If you're looking to skip iterations of `s-each` on a certain basis, then use
`.filter` instead of including an `s-if` element within the `s-each` loop. This
means that the `s-if` element doesn't even need to be rendered for certain
elements.

Here's what **not** to do:

```html
<h1>Search results</h1>
<ul>
    <s-each in="names" valuevar="name">
        <s-if condition="{{ name.startsWith(query) }}">
            <li>{{ name }}</li>
        </s-if>
    </s-each>
</ul>
```

Instead, filter out items with JavaScript first:

```html
<h1>Search results</h1>
<ul>
    <s-each in="names.filter((name) => name.startsWith(query))" valuevar="name">
        <li>{{ name }}</li>
    </s-each>
</ul>
```