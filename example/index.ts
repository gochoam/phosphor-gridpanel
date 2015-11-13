/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use-strict';

import {
  Widget
} from 'phosphor-widget';

import {
  GridPanel, Spec
} from '../lib/index';

import './index.css';


function createContent(name: string): Widget {
  let widget = new Widget();
  widget.addClass(name);
  return widget;
}


function main(): void {
  let r1 = createContent('red');
  let g1 = createContent('green');
  let b1 = createContent('blue');
  let y1 = createContent('yellow');

  let r2 = createContent('red');
  let g2 = createContent('green');
  let b2 = createContent('blue');
  let y2 = createContent('yellow');

  GridPanel.setRow(r1, 0);
  GridPanel.setColumn(r1, 0);

  GridPanel.setRow(g1, 1);
  GridPanel.setColumn(g1, 0);

  GridPanel.setRow(b1, 2);
  GridPanel.setColumn(b1, 0);

  GridPanel.setRow(y1, 0);
  GridPanel.setColumn(y1, 1);
  GridPanel.setRowSpan(y1, 2);
  GridPanel.setColumnSpan(y1, 3);

  GridPanel.setRow(r2, 2);
  GridPanel.setColumn(r2, 1);

  GridPanel.setRow(g2, 2);
  GridPanel.setColumn(g2, 2);

  GridPanel.setRow(b2, 0);
  GridPanel.setColumn(b2, 4);
  GridPanel.setRowSpan(b2, 3);

  GridPanel.setRow(y2, 2);
  GridPanel.setColumn(y2, 3);

  let panel = new GridPanel();
  panel.id = 'main';

  panel.rowSpecs = [
    new Spec({ minSize: 50, sizeBasis: 300 }),
    new Spec({ minSize: 50, sizeBasis: 150 }),
    new Spec({ stretch: 0, sizeBasis: 200, minSize: 50 })
  ];

  panel.columnSpecs = [
    new Spec({ stretch: 0, sizeBasis: 200, minSize: 50 }),
    new Spec({ minSize: 50 }),
    new Spec({ minSize: 50 }),
    new Spec({ minSize: 50 }),
    new Spec({ minSize: 50 })
  ];

  panel.children.assign([r1, g1, b1, y1, r2, g2, b2, y2]);

  Widget.attach(panel, document.body);

  window.onresize = () => panel.update();
}


window.onload = main;
