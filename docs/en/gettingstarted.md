# Getting Started
Welcome to subElements! subElements is a framework which enables you to quickly
write your own web platforms with ease. We'll guide you through the steps to
make your first app below!

## Getting the HTML ready
First things first, we'll need to create a new HTML file. Create a file named
`index.html` and add the following into it:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>My First App</title>
        <meta charset="utf-8">
        <script src="https://cdn.subnodal.com/lib/subelements.min.js"></script>
        <script src="script.js"></script>
    </head>
    <body hidden>
        Hello, world!
    </body>
</html>
```

This is the "Hello, world!" example that _everybody_ starts with! We'll also
create a new JavaScript file called `script.js` (which sits in the same
directory/folder as `index.html`):

```javascript
var subElements = require("com.subnodal.subelements");

subElements.init();
```

Luckily, the JavaScript file doesn't need as much 'boilerplate' code as the HTML
code does. Basically, what's going here is we're setting a variable to reference
the subElements library, so that every time we want to use the library for
something, we just have to call `subElements.doSomething();` instead of
`require("com.subnodal.subelements").doSomething();` every time. I mean you're
not _required_ to store this in a variable, but it makes it easier to type. Not
that we're trying to tell you how to live your life or anything.

## Checking to see if it works
To see if your basic app works, you'll need a web server to host your files.
There are many web server programs available depending on your platform.

* If you're a Chrome user, you may want to check out
  [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en).
  It is cross-platform, and is easy to install.
* If you've got Python 3 installed, you can use its built-in HTTP server
  functionality (so long as you execute the command in your project's
  directory):

  ```bash
  python3 -m "http.server"
  ```

Ensure that your web server is configured to serve the content from your
project's directory. Depending on what web server you're using, you can then
visit the appropriate URL to see your app in action! For example, with Web
Server for Chrome, http://127.0.0.1:8887 is the URL.

## Making your app do something
As a test, we'll make our basic app count from 0 to infinity, incrementing every
second. Let's start by editing our HTML and replacing the contents of
`<body hidden>` to say:

```html
<p>Hello, world!</p>
<p>You've been on this webpage for {{ count }} seconds.
```

The clever bit: `{{ count }}` will get replaced with the value of our `count`
variable every time we update the page!

We'll also need to write some JavaScript to actually make the counting happen.
At the top of your `script.js` file, type in the following:

```javascript
var count = 0;
```

This will initialise our counter, `count`, and set it to 0.

So we've made our counter start at 0, now what?! Well, it's time to make our
counter _count_, duh! We can do this every second using the `setInterval`
command. At the bottom of `script.js`, write:

```javascript
setInterval(function() {
    count++;

    subElements.render();
}, 1000);
```

This ensures that every 1,000 milliseconds (1 second), the function which
increments the counter by 1 is called. We also need to call `subElements.render`
to ensure that our HTML page updates to reflect the new value of `count`.

Now that that's done, try it out! You should see your page start counting before
your very eyes. Not even a minute old, yet it's learnt how to count from 0 to
infinity already. Believe me, there's 4-year-olds who can't even count!
