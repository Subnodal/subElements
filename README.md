# subElements
A website templating framework to quickly and easily build platforms.

Licenced by the [Subnodal Open-Source Licence](LICENCE.md).

## Getting subElements
Importing subElements into your project is simple! Just add this line to the
`<head>` of your HTML code (you can also host the `subelements.min.js` file
yourself):

```html
<script src="https://cdn.subnodal.com/lib/subelements.min.js"></script>
```

Check out our tutorial on using subElements with our
[Getting Started](docs/en/gettingstarted.md) guide!

If you're looking for tips on how to optimise your code, we've got [a guide for
that](docs/en/optimising.md) too!

## Building
To build subElements, you must have
[subPack](https://github.com/Subnodal/subPack). If you have it, run in the main
directory:

```bash
$ subpack
```

You should then have the bundled and minified version of subElements in
`build/subelements.min.js`.