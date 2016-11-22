# Tree3 tag
A simple tree tag

## Initial ideas

_If you can express it in HTML then you can express it in JS_

By default, any HTML code defacto is a tree. The main key is the CSS set of rules we want to apply in order to represent a tree following the Material Design's principles.

Let's try a demo that shows how to construct a tree based on MD's list.

[Initial demo](http://tree-example.m3c.space/demo)

[Working demo basased on the current solution](http://tree-example.m3c.space/demo/demo2.html)

[Working demo with custom actions](http://tree-example.m3c.space/demo/demo3.html)

[Tests](http://tree-example.m3c.space/test)

## Tree's actions

Expand/Contract.

CRUD. Moreover, every leaf has a three-dots icon that holds two default actions:

1. Add

2. Remove

Other actions can be added by applying a template. For example

```html
<ul id="demo-tree" class="mdl-list mdl-tree"></ul>
<template for="demo-tree">
  <li class="mdl-menu__item
             mdl-tree__contextmenu--action1">
    Action 1
  </li>
  <li class="mdl-menu__item
             mdl-tree__contextmenu--action2">
    Action 2
  </li>
</template>
```

The actions ```action1``` and ```action2``` will be dispatched if click on them.


## How to use

If you're planning to use this tree then don't forget to add the following polyfills:

```
<script src="/bower_components/webcomponentsjs/MutationObserver.js" async></script>
<script src="/bower_components/customevent-polyfill/customevent-polyfill.min.js"></script>
```

In order to initiate the tree, add to any ```mdl-list``` component the class ```mdl-tree```


## Events

By default, the ```tree``` will dispatch the following events:

* onCollapse

* onExpand

* onAddleaf

* onRemoveleaf

* onChangetext
