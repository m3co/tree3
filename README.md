# Tree3 tag
A simple tree tag

## Initial ideas

_If you can express it in HTML then you can express it in JS_

By default, any HTML code defacto is a tree. The main key is the CSS set of rules we want to apply in order to represent a tree following the Material Design's principles.

[Docs](http://tree-example.m3c.space/docs)

[Tests](http://tree-example.m3c.space/test)

## How to use

If you're planning to use this tree then don't forget to add the following polyfills:

```
<script src="/bower_components/array-includes/array-includes.js"></script>
<script src="/bower_components/element-matches/closest.js"></script>
<script src="/bower_components/customevent-polyfill/customevent-polyfill.min.js"></script>
```

In order to initiate the tree, add to any ```mdl-list``` component the class ```mdl-tree3```

