/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import expect = require('expect.js');

import {
  Message, clearMessageData, sendMessage, sendPendingMessage
} from 'phosphor-messaging';

import {
  IChangedArgs, Property
} from 'phosphor-properties';

import {
  Signal
} from 'phosphor-signaling';

import {
  ResizeMessage, Widget
} from 'phosphor-widget';

import {
  GridPanel, Spec
} from '../../lib/index';


class LogPanel extends GridPanel {

  messages: string[] = [];

  processMessage(msg: Message): void {
    super.processMessage(msg);
    this.messages.push(msg.type);
  }
}


class LogWidget extends Widget {

  messages: string[] = [];

  processMessage(msg: Message): void {
    super.processMessage(msg);
    this.messages.push(msg.type);
  }
}


function expectArraysEqv<T>(a: T[], b: T[]): void {
  expect(a.length).to.be(b.length);
  for (let i = 0, n = a.length; i < n; ++i) {
    expect(a[i]).to.be(b[i]);
  }
}


describe('phosphor-gridpanel', () => {

  describe('GridPanel', () => {

    describe('.rowSpecsProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowSpecsProperty instanceof Property).to.be(true);
      });

      it('should have the name `rowSpecs`', () => {
        expect(GridPanel.rowSpecsProperty.name).to.be('rowSpecs');
      });

      it('should default to a frozen empty array', () => {
        let panel = new GridPanel();
        let specs = GridPanel.rowSpecsProperty.get(panel);
        expectArraysEqv(specs, []);
        expect(() => specs.push(new Spec())).to.throwError();
      });

      it('should shallow copy and freeze the array of specs', () => {
        let panel = new GridPanel();
        let specs1 = [new Spec()];
        GridPanel.rowSpecsProperty.set(panel, specs1);
        let specs2 = GridPanel.rowSpecsProperty.get(panel);
        expectArraysEqv(specs1, specs2);
        expect(specs1).to.not.be(specs2);
        expect(() => specs1.push(new Spec())).to.not.throwError();
        expect(() => specs2.push(new Spec())).to.throwError();
      });

      it('should post a `layout-request`', (done) => {
        let panel = new LogPanel();
        panel.attach(document.body);
        clearMessageData(panel);
        GridPanel.rowSpecsProperty.set(panel, [new Spec()]);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('.columnSpecsProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnSpecsProperty instanceof Property).to.be(true);
      });

      it('should have the name `columnSpecs`', () => {
        expect(GridPanel.columnSpecsProperty.name).to.be('columnSpecs');
      });

      it('should default to a frozen empty array', () => {
        let panel = new GridPanel();
        let specs = GridPanel.columnSpecsProperty.get(panel);
        expectArraysEqv(specs, []);
        expect(() => specs.push(new Spec())).to.throwError();
      });

      it('should shallow copy and freeze the array of specs', () => {
        let panel = new GridPanel();
        let specs1 = [new Spec()];
        GridPanel.columnSpecsProperty.set(panel, specs1);
        let specs2 = GridPanel.columnSpecsProperty.get(panel);
        expectArraysEqv(specs1, specs2);
        expect(specs1).to.not.be(specs2);
        expect(() => specs1.push(new Spec())).to.not.throwError();
        expect(() => specs2.push(new Spec())).to.throwError();
      });

      it('should post a `layout-request`', (done) => {
        let panel = new LogPanel();
        panel.attach(document.body);
        clearMessageData(panel);
        GridPanel.columnSpecsProperty.set(panel, [new Spec()]);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('.rowSpacingProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowSpacingProperty instanceof Property).to.be(true);
      });

      it('should have the name `rowSpacing`', () => {
        expect(GridPanel.rowSpacingProperty.name).to.be('rowSpacing');
      });

      it('should default to `8`', () => {
        let panel = new GridPanel();
        expect(GridPanel.rowSpacingProperty.get(panel)).to.be(8);
      });

      it('should floor fractional values', () => {
        let panel = new GridPanel();
        GridPanel.rowSpacingProperty.set(panel, 4.5);
        expect(GridPanel.rowSpacingProperty.get(panel)).to.be(4);
      });

      it('should clamp values to a minimum of zero', () => {
        let panel = new GridPanel();
        GridPanel.rowSpacingProperty.set(panel, -4);
        expect(GridPanel.rowSpacingProperty.get(panel)).to.be(0);
      });

      it('should post a `layout-request`', (done) => {
        let panel = new LogPanel();
        panel.attach(document.body);
        clearMessageData(panel);
        GridPanel.rowSpacingProperty.set(panel, 4);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('.columnSpacingProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnSpacingProperty instanceof Property).to.be(true);
      });

      it('should have the name `columnSpacing`', () => {
        expect(GridPanel.columnSpacingProperty.name).to.be('columnSpacing');
      });

      it('should default to `8`', () => {
        let panel = new GridPanel();
        expect(GridPanel.columnSpacingProperty.get(panel)).to.be(8);
      });

      it('should floor fractional values', () => {
        let panel = new GridPanel();
        GridPanel.columnSpacingProperty.set(panel, 4.5);
        expect(GridPanel.columnSpacingProperty.get(panel)).to.be(4);
      });

      it('should clamp values to a minimum of zero', () => {
        let panel = new GridPanel();
        GridPanel.columnSpacingProperty.set(panel, -4);
        expect(GridPanel.columnSpacingProperty.get(panel)).to.be(0);
      });

      it('should post a `layout-request`', (done) => {
        let panel = new LogPanel();
        panel.attach(document.body);
        clearMessageData(panel);
        GridPanel.columnSpacingProperty.set(panel, 4);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('.rowProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowProperty instanceof Property).to.be(true);
      });

      it('should have the name `row`', () => {
        expect(GridPanel.rowProperty.name).to.be('row');
      });

      it('should default to `0`', () => {
        let widget = new Widget();
        expect(GridPanel.rowProperty.get(widget)).to.be(0);
      });

      it('should floor fractional values', () => {
        let widget = new Widget();
        GridPanel.rowProperty.set(widget, 4.5);
        expect(GridPanel.rowProperty.get(widget)).to.be(4);
      });

      it('should clamp values to a minimum of zero', () => {
        let widget = new Widget();
        GridPanel.rowProperty.set(widget, -4);
        expect(GridPanel.rowProperty.get(widget)).to.be(0);
      });

      it('should post an `update-request` to the parent', (done) => {
        let panel = new LogPanel();
        let child0 = new Widget();
        let child1 = new Widget();
        panel.addChild(child0);
        panel.addChild(child1);
        panel.attach(document.body);
        clearMessageData(panel);
        GridPanel.rowProperty.set(child0, 1);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('.columnProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnProperty instanceof Property).to.be(true);
      });

      it('should have the name `column`', () => {
        expect(GridPanel.columnProperty.name).to.be('column');
      });

      it('should default to `0`', () => {
        let widget = new Widget();
        expect(GridPanel.columnProperty.get(widget)).to.be(0);
      });

      it('should floor fractional values', () => {
        let widget = new Widget();
        GridPanel.columnProperty.set(widget, 4.5);
        expect(GridPanel.columnProperty.get(widget)).to.be(4);
      });

      it('should clamp values to a minimum of zero', () => {
        let widget = new Widget();
        GridPanel.columnProperty.set(widget, -4);
        expect(GridPanel.columnProperty.get(widget)).to.be(0);
      });

      it('should post an `update-request` to the parent', (done) => {
        let panel = new LogPanel();
        let child0 = new Widget();
        let child1 = new Widget();
        panel.addChild(child0);
        panel.addChild(child1);
        panel.attach(document.body);
        clearMessageData(panel);
        GridPanel.columnProperty.set(child0, 1);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('.rowSpanProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowSpanProperty instanceof Property).to.be(true);
      });

      it('should have the name `rowSpan`', () => {
        expect(GridPanel.rowSpanProperty.name).to.be('rowSpan');
      });

      it('should default to `1`', () => {
        let widget = new Widget();
        expect(GridPanel.rowSpanProperty.get(widget)).to.be(1);
      });

      it('should floor fractional values', () => {
        let widget = new Widget();
        GridPanel.rowSpanProperty.set(widget, 4.5);
        expect(GridPanel.rowSpanProperty.get(widget)).to.be(4);
      });

      it('should clamp values to a minimum of `1`', () => {
        let widget = new Widget();
        GridPanel.rowSpanProperty.set(widget, -4);
        expect(GridPanel.rowSpanProperty.get(widget)).to.be(1);
      });

      it('should post an `update-request` to the parent', (done) => {
        let panel = new LogPanel();
        let child0 = new Widget();
        let child1 = new Widget();
        panel.addChild(child0);
        panel.addChild(child1);
        panel.attach(document.body);
        clearMessageData(panel);
        GridPanel.rowSpanProperty.set(child0, 2);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('.columnSpanProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnSpanProperty instanceof Property).to.be(true);
      });

      it('should have the name `columnSpan`', () => {
        expect(GridPanel.columnSpanProperty.name).to.be('columnSpan');
      });

      it('should default to `1`', () => {
        let widget = new Widget();
        expect(GridPanel.columnSpanProperty.get(widget)).to.be(1);
      });

      it('should floor fractional values', () => {
        let widget = new Widget();
        GridPanel.columnSpanProperty.set(widget, 4.5);
        expect(GridPanel.columnSpanProperty.get(widget)).to.be(4);
      });

      it('should clamp values to a minimum of `1`', () => {
        let widget = new Widget();
        GridPanel.columnSpanProperty.set(widget, -4);
        expect(GridPanel.columnSpanProperty.get(widget)).to.be(1);
      });

      it('should post an `update-request` to the parent', (done) => {
        let panel = new LogPanel();
        let child0 = new Widget();
        let child1 = new Widget();
        panel.addChild(child0);
        panel.addChild(child1);
        panel.attach(document.body);
        clearMessageData(panel);
        GridPanel.columnSpanProperty.set(child0, 2);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('.getRow', () => {

      it('should return the origin row index for the given widget', () => {
        let widget = new Widget();
        expect(GridPanel.getRow(widget)).to.be(0);
      });

      it('should be a pure delegate to rowProperty', () => {
        let widget = new Widget();
        GridPanel.rowProperty.set(widget, 1);
        expect(GridPanel.getRow(widget)).to.be(1);
      });

    });

    describe('.setRow', () => {

      it('should set the origin row index for the given widget.', () => {
        let widget = new Widget();
        GridPanel.setRow(widget, 2);
        expect(GridPanel.getRow(widget)).to.be(2);
      });

      it('should be a pure delegate to rowProperty', () => {
        let widget = new Widget();
        GridPanel.setRow(widget, 2);
        expect(GridPanel.rowProperty.get(widget)).to.be(2);
      });

    });

    describe('.getColumn', () => {

      it('should return the origin column index for the given widget', () => {
        let widget = new Widget();
        expect(GridPanel.getColumn(widget)).to.be(0);
      });

      it('should be a pure delegate to columnProperty', () => {
        let widget = new Widget();
        GridPanel.columnProperty.set(widget, 2);
        expect(GridPanel.getColumn(widget)).to.be(2);
      });

    });

    describe('.setColumn', () => {

      it('should set the origin column index for the given widget.', () => {
        let widget = new Widget();
        GridPanel.setColumn(widget, 2);
        expect(GridPanel.getColumn(widget)).to.be(2);
      });

      it('should be a pure delegate to columnProperty', () => {
        let widget = new Widget();
        GridPanel.setColumn(widget, 1);
        expect(GridPanel.columnProperty.get(widget)).to.be(1);
      });

    });

    describe('.getRowSpan', () => {

      it('should return the row span for the given widget', () => {
        let widget = new Widget();
        expect(GridPanel.getRowSpan(widget)).to.be(1);
      });

      it('should be a pure delegate to rowSpanProperty', () => {
        let widget = new Widget();
        GridPanel.rowSpanProperty.set(widget, 2);
        expect(GridPanel.getRowSpan(widget)).to.be(2);
      });

    });

    describe('.setRowSpan', () => {

      it('should set the row span for the given widget', () => {
        let widget = new Widget();
        GridPanel.setRowSpan(widget, 2);
        expect(GridPanel.getRowSpan(widget)).to.be(2);
      });

      it('should be a pure delegate to rowSpanProperty', () => {
        let widget = new Widget();
        GridPanel.setRowSpan(widget, 1);
        expect(GridPanel.rowSpanProperty.get(widget)).to.be(1);
      });

    });

    describe('.getColumnSpan', () => {

      it('should return the column span for the given widget', () => {
        let widget = new Widget();
        expect(GridPanel.getColumnSpan(widget)).to.be(1);
      });

      it('should be a pure delegate to columnSpanProperty', () => {
        let widget = new Widget();
        GridPanel.columnSpanProperty.set(widget, 2);
        expect(GridPanel.getColumnSpan(widget)).to.be(2);
      });

    });

    describe('.setColumnSpan', () => {

      it('should set the column span for the given widget', () => {
        let widget = new Widget();
        GridPanel.setColumnSpan(widget, 2);
        expect(GridPanel.getColumnSpan(widget)).to.be(2);
      });

      it('should be a pure delegate to columnSpanProperty', () => {
        let widget = new Widget();
        GridPanel.setColumnSpan(widget, 1);
        expect(GridPanel.columnSpanProperty.get(widget)).to.be(1);
      });

    });

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        let panel = new GridPanel();
        expect(panel instanceof GridPanel).to.be(true);
      });

      it('should add `p-GridPanel`', () => {
        let panel = new GridPanel();
        expect(panel.hasClass('p-GridPanel')).to.be(true);
      });

    });

    describe('#dispose()', () => {

      it('should dispose of the resources held by the panel', () => {
        let panel = new GridPanel();
        panel.addChild(new Widget());
        panel.addChild(new Widget());
        panel.dispose();
        expect(panel.isDisposed).to.be(true);
        expect(panel.childCount()).to.be(0);
      });

    });

    describe('#rowSpecs', () => {

      it('should get the row specs for the grid panel', () => {
        let panel = new GridPanel();
        expectArraysEqv(panel.rowSpecs, []);
      });

      it('should set the row specs for the grid panel', () => {
        let panel = new GridPanel();
        panel.rowSpecs = [new Spec({ stretch: 4 })];
        expect(panel.rowSpecs[0].stretch).to.be(4);
      });

      it('should a pure delegate to the rowSpecsProperty', () => {
        let panel = new GridPanel();
        let spec = new Spec({ maxSize: 3 });
        GridPanel.rowSpecsProperty.set(panel, [spec]);
        expect(panel.rowSpecs[0].maxSize).to.be(3);
        panel.rowSpecs = [new Spec({ maxSize: 4 })];
        let rowSpecs = GridPanel.rowSpecsProperty.get(panel);
        expect(rowSpecs[0].maxSize).to.be(4);
      });

    });

    describe('#columnSpecs', () => {

      it('should get the column specs for the grid panel', () => {
        let panel = new GridPanel();
        expectArraysEqv(panel.columnSpecs, []);
      });

      it('should set the column specs for the grid panel', () => {
        let panel = new GridPanel();
        panel.columnSpecs = [new Spec({ stretch: 4 })];
        expect(panel.columnSpecs[0].stretch).to.be(4);
      });

      it('should a pure delegate to the columnSpecsProperty', () => {
        let panel = new GridPanel();
        let spec = new Spec({ maxSize: 3 });
        GridPanel.columnSpecsProperty.set(panel, [spec]);
        expect(panel.columnSpecs[0].maxSize).to.be(3);
        panel.columnSpecs = [new Spec({ maxSize: 4 })];
        let columnSpecs = GridPanel.columnSpecsProperty.get(panel);
        expect(columnSpecs[0].maxSize).to.be(4);
      });

    });

    describe('#rowSpacing', () => {

      it('should get the row spacing for the grid panel', () => {
        let panel = new GridPanel();
        expect(panel.rowSpacing).to.be(8);
      });

      it('should set the row spacing for the grid panel', () => {
        let panel = new GridPanel();
        panel.rowSpacing = 4;
        expect(panel.rowSpacing).to.be(4);
      });

      it('should a pure delegate to the rowSpacingProperty', () => {
        let panel = new GridPanel();
        GridPanel.rowSpacingProperty.set(panel, 4);
        expect(panel.rowSpacing).to.be(4);
        panel.rowSpacing = 5;
        let rowSpacing = GridPanel.rowSpacingProperty.get(panel);
        expect(rowSpacing).to.be(5);
      });

    });

    describe('#columnSpacing', () => {

      it('should get the column spacing for the grid panel', () => {
        let panel = new GridPanel();
        expect(panel.columnSpacing).to.be(8);
      });

      it('should set the column spacing for the grid panel', () => {
        let panel = new GridPanel();
        panel.columnSpacing = 4;
        expect(panel.columnSpacing).to.be(4);
      });

      it('should a pure delegate to the columnSpacingProperty', () => {
        let panel = new GridPanel();
        GridPanel.columnSpacingProperty.set(panel, 4);
        expect(panel.columnSpacing).to.be(4);
        panel.columnSpacing = 5;
        let columnSpacing = GridPanel.columnSpacingProperty.get(panel);
        expect(columnSpacing).to.be(5);
      });

    });

    describe('#onChildAdded()', () => {

      it('should be invoked when a child is added', () => {
        let panel = new LogPanel();
        let widget = new Widget();
        panel.attach(document.body);
        expect(panel.messages.indexOf('child-added')).to.be(-1);
        panel.addChild(widget);
        expect(panel.messages.indexOf('child-added')).to.not.be(-1);
        panel.dispose();
      });

      it('should send `after-attach` to the child', () => {
        let panel = new LogPanel();
        let widget = new LogWidget();
        panel.attach(document.body);
        expect(widget.messages.indexOf('after-attach')).to.be(-1);
        panel.addChild(widget);
        expect(widget.messages.indexOf('after-attach')).to.not.be(-1);
        panel.dispose();
      });

      it('should post an `update-request`', (done) => {
        let panel = new LogPanel();
        let widget = new Widget();
        panel.attach(document.body);
        clearMessageData(panel);
        panel.addChild(widget);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('#onChildRemoved()', () => {

      it('should be invoked when a child is removed', () => {
        let panel = new LogPanel();
        let widget = new Widget();
        panel.addChild(widget);
        panel.attach(document.body);
        expect(panel.messages.indexOf('child-removed')).to.be(-1);
        widget.remove();
        expect(panel.messages.indexOf('child-removed')).to.not.be(-1);
        panel.dispose();
      });

      it('should send `before-detach` to the child', () => {
        let panel = new LogPanel();
        let widget = new LogWidget();
        panel.attach(document.body);
        panel.addChild(widget);
        expect(widget.messages.indexOf('before-detach')).to.be(-1);
        widget.remove();
        expect(widget.messages.indexOf('before-detach')).to.not.be(-1);
        panel.dispose();
      });

    });

    describe('#onAfterShow()', () => {

      it('should be invoked when the panel is shown', () => {
        let panel = new LogPanel();
        panel.attach(document.body);
        panel.hidden = true;
        expect(panel.messages.indexOf('after-show')).to.be(-1);
        panel.hidden = false;
        expect(panel.messages.indexOf('after-show')).to.not.be(-1);
        panel.dispose();
      });

      it('should send an `update-request`', () => {
        let panel = new LogPanel();
        panel.attach(document.body);
        clearMessageData(panel);
        panel.hidden = true;
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        panel.hidden = false;
        expect(panel.messages.indexOf('update-request')).to.not.be(-1);
        panel.dispose();
      });

    });

    describe('#onAfterAttach()', () => {

      it('should be invoked when the panel is attached', () => {
        let panel = new LogPanel();
        panel.attach(document.body);
        expect(panel.messages.indexOf('after-attach')).to.not.be(-1);
        panel.dispose();
      });

      it('post a `layout-request`', (done) => {
        let panel = new LogPanel();
        panel.attach(document.body);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('#onChildShown()', () => {

      it('should be invoked when a child is shown', () => {
        let panel = new LogPanel();
        let widget = new Widget();
        widget.hidden = true;
        panel.addChild(widget);
        panel.attach(document.body);
        expect(panel.messages.indexOf('child-shown')).to.be(-1);
        widget.hidden = false;
        expect(panel.messages.indexOf('child-shown')).to.not.be(-1);
        panel.dispose();
      });

      it('should post an `update-request`', (done) => {
        let panel = new LogPanel();
        let widget = new Widget();
        widget.hidden = true;
        panel.addChild(widget);
        panel.attach(document.body);
        clearMessageData(panel);
        widget.hidden = false;
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          panel.dispose();
          done();
        });
      });

    });

    describe('#onResize()', () => {

      it('should be invoked on a `resize` message', () => {
        let panel = new LogPanel();
        let message = new ResizeMessage(100, 100);
        panel.attach(document.body);
        sendMessage(panel, message);
        expect(panel.messages.indexOf('resize')).to.not.be(-1);
        panel.dispose();
      });

      it('should handle an unknown size', () => {
        let panel = new LogPanel();
        let widget = new Widget();
        panel.addChild(widget);
        panel.attach(document.body);
        expect(panel.messages.indexOf('resize')).to.be(-1);
        sendMessage(panel, ResizeMessage.UnknownSize);
        expect(panel.messages.indexOf('resize')).to.not.be(-1);
        panel.dispose();
      });

      it('should resize the children', () => {
        let panel = new GridPanel();
        let child0 = new Widget();
        let child1 = new Widget();
        panel.rowSpecs = [new Spec()];
        panel.columnSpecs = [new Spec()];
        panel.addChild(child0);
        panel.addChild(child1);
        panel.attach(document.body);
        panel.node.style.position = 'absolute';
        panel.node.style.top = '0px';
        panel.node.style.left = '0px';
        panel.node.style.width = '0px';
        panel.node.style.height = '0px';
        sendMessage(panel, Widget.MsgLayoutRequest);
        panel.node.style.width = '100px';
        panel.node.style.height = '100px';
        sendMessage(panel, new ResizeMessage(100, 100));
        expect(child0.node.offsetTop).to.be(0);
        expect(child0.node.offsetLeft).to.be(0);
        expect(child0.node.offsetWidth).to.be(100);
        expect(child0.node.offsetHeight).to.be(100);
        expect(child1.node.offsetTop).to.be(0);
        expect(child1.node.offsetLeft).to.be(0);
        expect(child1.node.offsetWidth).to.be(100);
        expect(child1.node.offsetHeight).to.be(100);
        panel.dispose();
      });

    });

    describe('#onUpdateRequest()', () => {

      it('should be invoked on an `update-request` message', () => {
        let panel = new LogPanel();
        sendMessage(panel, Widget.MsgUpdateRequest);
        expect(panel.messages.indexOf('update-request')).to.not.be(-1);
      });

      it('should resize the children', () => {
        let panel = new GridPanel();
        let child0 = new Widget();
        let child1 = new Widget();
        panel.rowSpecs = [new Spec()];
        panel.columnSpecs = [new Spec()];
        panel.addChild(child0);
        panel.addChild(child1);
        panel.attach(document.body);
        panel.node.style.position = 'absolute';
        panel.node.style.top = '0px';
        panel.node.style.left = '0px';
        panel.node.style.width = '0px';
        panel.node.style.height = '0px';
        sendMessage(panel, Widget.MsgLayoutRequest);
        panel.node.style.width = '200px';
        panel.node.style.height = '200px';
        sendMessage(panel, Widget.MsgUpdateRequest);
        expect(child0.node.offsetTop).to.be(0);
        expect(child0.node.offsetLeft).to.be(0);
        expect(child0.node.offsetWidth).to.be(200);
        expect(child0.node.offsetHeight).to.be(200);
        expect(child1.node.offsetTop).to.be(0);
        expect(child1.node.offsetLeft).to.be(0);
        expect(child1.node.offsetWidth).to.be(200);
        expect(child1.node.offsetHeight).to.be(200);
        panel.dispose();
      });

    });

    describe('#onLayoutRequest()', () => {

      it('should be invoked on a `layout-request` message', () => {
        let panel = new LogPanel();
        sendMessage(panel, Widget.MsgLayoutRequest);
        expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
      });

      it('should send a `layout-request` to its parent', () => {
        let panel1 = new LogPanel();
        let panel2 = new LogPanel();
        panel1.addChild(panel2);
        panel1.attach(document.body);
        clearMessageData(panel1);
        clearMessageData(panel2);
        expect(panel1.messages.indexOf('layout-request')).to.be(-1);
        sendMessage(panel2, Widget.MsgLayoutRequest);
        expect(panel1.messages.indexOf('layout-request')).to.not.be(-1);
        panel1.dispose();
      });

      it('should setup the geometry of the panel', () => {
        let panel = new GridPanel();
        panel.rowSpecs = [new Spec({ minSize: 50 })];
        panel.columnSpecs = [new Spec({ minSize: 50 })];
        panel.attach(document.body);
        expect(panel.node.style.minWidth).to.be('');
        expect(panel.node.style.minHeight).to.be('');
        sendMessage(panel, Widget.MsgLayoutRequest);
        expect(panel.node.style.minWidth).to.be('50px');
        expect(panel.node.style.minHeight).to.be('50px');
        panel.dispose();
      });

    });

    context('spec property change', () => {

      it('should post a `layout-request` on spec change', () => {
        let panel = new LogPanel();
        let rspec = new Spec({ minSize: 50 });
        let cspec = new Spec({ minSize: 50 });
        panel.rowSpecs = [rspec];
        panel.columnSpecs = [cspec];
        clearMessageData(panel);

        rspec.minSize = 40;
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        sendPendingMessage(panel);
        expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
        panel.messages = [];

        cspec.maxSize = 150;
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        sendPendingMessage(panel);
        expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
        panel.messages = [];

        rspec.stretch = 4;
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        sendPendingMessage(panel);
        expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
        panel.messages = [];

        cspec.sizeBasis = 74;
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        sendPendingMessage(panel);
        expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
        panel.messages = [];
      });

    });

    context('resize behavior', () => {

      it('should arrange the children in a grid', () => {
        let r1 = new Widget();
        let g1 = new Widget();
        let b1 = new Widget();
        let y1 = new Widget();

        let r2 = new Widget();
        let g2 = new Widget();
        let b2 = new Widget();
        let y2 = new Widget();

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

        let panel = new LogPanel();

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

        panel.addChild(r1);
        panel.addChild(g1);
        panel.addChild(b1);
        panel.addChild(y1);
        panel.addChild(r2);
        panel.addChild(g2);
        panel.addChild(b2);
        panel.addChild(y2);

        panel.node.style.position = 'absolue';
        panel.node.style.position = 'absolute';
        panel.node.style.top = '0px';
        panel.node.style.left = '0px';
        panel.node.style.width = '0px';
        panel.node.style.height = '0px';

        panel.attach(document.body);
        sendMessage(panel, Widget.MsgLayoutRequest);

        panel.node.style.width = '500px';
        panel.node.style.height = '500px';
        sendMessage(panel, new ResizeMessage(500, 500));

        expect(r1.node.offsetTop).to.be(0);
        expect(r1.node.offsetLeft).to.be(0);
        expect(r1.node.offsetWidth).to.be(200);
        expect(r1.node.offsetHeight).to.be(217);

        expect(g1.node.offsetTop).to.be(225);
        expect(g1.node.offsetLeft).to.be(0);
        expect(g1.node.offsetWidth).to.be(200);
        expect(g1.node.offsetHeight).to.be(67);

        expect(b1.node.offsetTop).to.be(300);
        expect(b1.node.offsetLeft).to.be(0);
        expect(b1.node.offsetWidth).to.be(200);
        expect(b1.node.offsetHeight).to.be(200);

        expect(y1.node.offsetTop).to.be(0);
        expect(y1.node.offsetLeft).to.be(208);
        expect(y1.node.offsetWidth).to.be(217);
        expect(y1.node.offsetHeight).to.be(292);

        expect(r2.node.offsetTop).to.be(300);
        expect(r2.node.offsetLeft).to.be(208);
        expect(r2.node.offsetWidth).to.be(67);
        expect(r2.node.offsetHeight).to.be(200);

        expect(g2.node.offsetTop).to.be(300);
        expect(g2.node.offsetLeft).to.be(283);
        expect(g2.node.offsetWidth).to.be(67);
        expect(g2.node.offsetHeight).to.be(200);

        expect(b2.node.offsetTop).to.be(0);
        expect(b2.node.offsetLeft).to.be(433);
        expect(b2.node.offsetWidth).to.be(67);
        expect(b2.node.offsetHeight).to.be(500);

        expect(y2.node.offsetTop).to.be(300);
        expect(y2.node.offsetLeft).to.be(358);
        expect(y2.node.offsetWidth).to.be(67);
        expect(y2.node.offsetHeight).to.be(200);

        panel.dispose();
      });

    });

  });

  describe('Spec', () => {

    describe('.changedSignal', () => {

      it('should be a signal instance', () => {
        expect(Spec.changedSignal instanceof Signal).to.be(true);
      });

    });

    describe('.sizeBasisProperty', () => {

      it('should be a property descriptor', () => {
        expect(Spec.sizeBasisProperty instanceof Property).to.be(true);
      });

      it('should have the name `sizeBasis`', () => {
        expect(Spec.sizeBasisProperty.name).to.be('sizeBasis');
      });

      it('should notify using the `changedSignal`', () => {
        expect(Spec.sizeBasisProperty.notify).to.be(Spec.changedSignal);
      });

      it('should default to `0`', () => {
        let spec = new Spec({});
        expect(Spec.sizeBasisProperty.get(spec)).to.be(0);
      });

    });

    describe('.minSizeProperty', () => {

      it('should be a property descriptor', () => {
        expect(Spec.minSizeProperty instanceof Property).to.be(true);
      });

      it('should have the name `minSize`', () => {
        expect(Spec.minSizeProperty.name).to.be('minSize');
      });

      it('should notify using the `changedSignal`', () => {
        expect(Spec.minSizeProperty.notify).to.be(Spec.changedSignal);
      });

      it('should default to `0`', () => {
        let spec = new Spec({});
        expect(Spec.minSizeProperty.get(spec)).to.be(0);
      });

      it('should be clamped to a lower bound of `0`', () => {
        let spec = new Spec({ minSize: -1 });
        expect(Spec.minSizeProperty.get(spec)).to.be(0);
      });

    });

    describe('.maxSizeProperty', () => {

      it('should be a property descriptor', () => {
        expect(Spec.maxSizeProperty instanceof Property).to.be(true);
      });

      it('should have the name `maxSize`', () => {
        expect(Spec.maxSizeProperty.name).to.be('maxSize');
      });

      it('should notify using the `changedSignal`', () => {
        expect(Spec.maxSizeProperty.notify).to.be(Spec.changedSignal);
      });

      it('should default to `Infinity`', () => {
        let spec = new Spec({});
        expect(Spec.maxSizeProperty.get(spec)).to.be(Infinity);
      });

      it('should be clamped to a lower bound of `0`', () => {
        let spec = new Spec({ maxSize: -1 });
        expect(Spec.maxSizeProperty.get(spec)).to.be(0);
      });

    });

    describe('.stretchProperty', () => {

      it('should be a property descriptor', () => {
        expect(Spec.stretchProperty instanceof Property).to.be(true);
      });

      it('should have the name `stretch`', () => {
        expect(Spec.stretchProperty.name).to.be('stretch');
      });

      it('should notify using the `changedSignal`', () => {
        expect(Spec.stretchProperty.notify).to.be(Spec.changedSignal);
      });

      it('should default to `1`', () => {
        let spec = new Spec();
        expect(Spec.stretchProperty.get(spec)).to.be(1);
      });

      it('should floor fractional values', () => {
        let spec = new Spec({ stretch: 4.5 });
        expect(Spec.stretchProperty.get(spec)).to.be(4);
      });

      it('should be clamped to a lower bound of `0`', () => {
        let spec = new Spec({ stretch: -1 });
        expect(Spec.stretchProperty.get(spec)).to.be(0);
      });

    });

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        let spec = new Spec();
        expect(spec instanceof Spec).to.be(true);
      });

      it('should accept ISpecOptions', () => {
        let spec = new Spec({ sizeBasis: 1, minSize: 1, maxSize: 1, stretch: 2 });
        expect(spec instanceof Spec).to.be(true);
      });

    });

    describe('#changed', () => {

      it('should be a pure delegate to the `changedSignal`', () => {
        let spec = new Spec();
        expect(spec.changed).to.eql(Spec.changedSignal.bind(spec));
      });

    });

    describe('#sizeBasis', () => {

      it('should get the size basis for the spec', () => {
        let spec = new Spec();
        expect(spec.sizeBasis).to.be(0);
      });

      it('should set the size basis for the spec', () => {
        let spec = new Spec();
        spec.sizeBasis = 4;
        expect(spec.sizeBasis).to.be(4);
      });

      it('should a pure delegate to the sizeBasisProperty', () => {
        let spec = new Spec();
        Spec.sizeBasisProperty.set(spec, 4);
        expect(spec.sizeBasis).to.be(4);
        spec.sizeBasis = 5;
        let sizeBasis = Spec.sizeBasisProperty.get(spec);
        expect(sizeBasis).to.be(5);
      });

      it('should emit the changed signal', () => {
        let spec = new Spec();
        let args: IChangedArgs<any> = null;
        spec.changed.connect((s, a) => { args = a; });
        spec.sizeBasis = 42;
        expect(args).to.eql({
          name: 'sizeBasis',
          oldValue: 0,
          newValue: 42,
        });
      });

    });

    describe('#minSize', () => {

      it('should get the min size for the spec', () => {
        let spec = new Spec();
        expect(spec.minSize).to.be(0);
      });

      it('should set the min size for the spec', () => {
        let spec = new Spec();
        spec.minSize = 4;
        expect(spec.minSize).to.be(4);
      });

      it('should a pure delegate to the minSizeProperty', () => {
        let spec = new Spec();
        Spec.minSizeProperty.set(spec, 4);
        expect(spec.minSize).to.be(4);
        spec.minSize = 5;
        let minSize = Spec.minSizeProperty.get(spec);
        expect(minSize).to.be(5);
      });

      it('should emit the changed signal', () => {
        let spec = new Spec();
        let args: IChangedArgs<any> = null;
        spec.changed.connect((s, a) => { args = a; });
        spec.minSize = 7;
        expect(args).to.eql({
          name: 'minSize',
          oldValue: 0,
          newValue: 7,
        });
      });

    });

    describe('#maxSize', () => {

      it('should get the max size for the spec', () => {
        let spec = new Spec();
        expect(spec.maxSize).to.be(Infinity);
      });

      it('should set the max size for the spec', () => {
        let spec = new Spec();
        spec.maxSize = 4;
        expect(spec.maxSize).to.be(4);
      });

      it('should a pure delegate to the maxSizeProperty', () => {
        let spec = new Spec();
        Spec.maxSizeProperty.set(spec, 4);
        expect(spec.maxSize).to.be(4);
        spec.maxSize = 5;
        let maxSize = Spec.maxSizeProperty.get(spec);
        expect(maxSize).to.be(5);
      });

      it('should emit the changed signal', () => {
        let spec = new Spec();
        let args: IChangedArgs<any> = null;
        spec.changed.connect((s, a) => { args = a; });
        spec.maxSize = 63;
        expect(args).to.eql({
          name: 'maxSize',
          oldValue: Infinity,
          newValue: 63,
        });
      });

    });

    describe('#stretch', () => {

      it('should get the stretch factor for the spec', () => {
        let spec = new Spec();
        expect(spec.stretch).to.be(1);
      });

      it('should set the stretch factor for the spec', () => {
        let spec = new Spec();
        spec.stretch = 4;
        expect(spec.stretch).to.be(4);
      });

      it('should a pure delegate to the stretchProperty', () => {
        let spec = new Spec();
        Spec.stretchProperty.set(spec, 4);
        expect(spec.stretch).to.be(4);
        spec.stretch = 5;
        let stretch = Spec.stretchProperty.get(spec);
        expect(stretch).to.be(5);
      });

      it('should emit the changed signal', () => {
        let spec = new Spec();
        let args: IChangedArgs<any> = null;
        spec.changed.connect((s, a) => { args = a; });
        spec.stretch = 17;
        expect(args).to.eql({
          name: 'stretch',
          oldValue: 1,
          newValue: 17,
        });
      });

    });

  });

});
