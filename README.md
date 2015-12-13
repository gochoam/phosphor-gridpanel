phosphor-gridpanel
==================

[![Build Status](https://travis-ci.org/phosphorjs/phosphor-gridpanel.svg)](https://travis-ci.org/phosphorjs/phosphor-gridpanel?branch=master)
[![Coverage Status](https://coveralls.io/repos/phosphorjs/phosphor-gridpanel/badge.svg?branch=master&service=github)](https://coveralls.io/github/phosphorjs/phosphor-gridpanel?branch=master)

A Phosphor layout panel which arranges its children into a 2D grid.

[API Docs](http://phosphorjs.github.io/phosphor-gridpanel/api/)


Package Install
---------------

**Prerequisites**
- [node](http://nodejs.org/)

```bash
npm install --save phosphor-gridpanel
```


Source Build
------------

**Prerequisites**
- [git](http://git-scm.com/)
- [node](http://nodejs.org/)

```bash
git clone https://github.com/phosphorjs/phosphor-gridpanel.git
cd phosphor-gridpanel
npm install
```

**Rebuild**
```bash
npm run clean
npm run build
```


Run Tests
---------

Follow the source build instructions first.

```bash
# run tests in Firefox
npm test

# run tests in Chrome
npm run test:chrome

# run tests in IE
npm run test:ie
```


Build Docs
----------

Follow the source build instructions first.

```bash
npm run docs
```

Navigate to `docs/index.html`.


Build Example
-------------

Follow the source build instructions first.

```bash
npm run build:example
```

Navigate to `example/index.html`.


Supported Runtimes
------------------

The runtime versions which are currently *known to work* are listed below.
Earlier versions may also work, but come with no guarantees.

- IE 11+
- Firefox 32+
- Chrome 38+


Bundle for the Browser
----------------------

Follow the package install instructions first.

```bash
npm install --save-dev browserify browserify-css
browserify myapp.js -o mybundle.js
```


Usage Examples
--------------

**Note:** This module is fully compatible with Node/Babel/ES6/ES5. Simply
omit the type declarations when using a language other than TypeScript.

```typescript
import {
  GridPanel, Spec
} from 'phosphor-gridpanel';

import {
  Widget
} from 'phosphor-widget';


// Create some content for the panel.
let w1 = new Widget();
let w2 = new Widget();
let w3 = new Widget();

// Create the row and column specs for panel.
let rowSpecs = [
  new Spec({ minSize: 150, sizeBasis: 300, stretch: 2 }),
  new Spec({ minSize: 50, sizeBasis: 150, stretch: 1 })
];

let colSpecs = [
  new Spec({ minSize: 200 }),
  new Spec({ minSize: 300 }),
];

// Set the content cell indices and spans.
GridPanel.setRow(w1, 0);
GridPanel.setColumn(w1, 0);
GridPanel.setRowSpan(w1, 1);
GridPanel.setColumnSpan(w1, 1);

GridPanel.setRow(w2, 1);
GridPanel.setColumn(w2, 0);
GridPanel.setRowSpan(w2, 1);
GridPanel.setColumnSpan(w2, 1);

GridPanel.setRow(w3, 0);
GridPanel.setColumn(w3, 1);
GridPanel.setRowSpan(w3, 2);
GridPanel.setColumnSpan(w3, 1);

// Setup the grid panel.
let panel = new GridPanel();
panel.rowSpacing = 3;
panel.columnSpacing = 3;
panel.rowSpecs = rowSpecs;
panel.columnSpecs = colSpecs;
panel.addChild(w1);
panel.addChild(w2);
panel.addChild(w3);
```
