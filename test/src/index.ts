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
  Property
} from 'phosphor-properties';

import {
  MSG_LAYOUT_REQUEST, ResizeMessage, Widget, attachWidget
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


describe('phosphor-gridpanel', () => {

  describe('GridPanel', () => {

    describe('.p_GridPanel', () => {

      it('should equal `p-GridPanel`', () => {
        expect(GridPanel.p_GridPanel).to.be('p-GridPanel');
      });

    });

    describe('.rowSpecsProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowSpecsProperty instanceof Property).to.be(true);
      });

      it('should default to a frozen empty array', () => {
        var panel = new GridPanel();
        var specs = GridPanel.rowSpecsProperty.get(panel);
        expect(specs).to.eql([]);
        expect(() => specs.push(new Spec())).to.throwError();
      });

      it('should shallow copy and freeze the array of specs', () => {
        var panel = new GridPanel();
        var specs1 = [new Spec()];
        GridPanel.rowSpecsProperty.set(panel, specs1);
        var specs2 = GridPanel.rowSpecsProperty.get(panel);
        expect(specs1).to.eql(specs2);
        expect(specs1).to.not.be(specs2);
        expect(() => specs1.push(new Spec())).to.not.throwError();
        expect(() => specs2.push(new Spec())).to.throwError();
      });

      it('should post a `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        clearMessageData(panel);
        GridPanel.rowSpecsProperty.set(panel, [new Spec()]);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.columnSpecsProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnSpecsProperty instanceof Property).to.be(true);
      });

      it('should default to a frozen empty array', () => {
        var panel = new GridPanel();
        var specs = GridPanel.columnSpecsProperty.get(panel);
        expect(specs).to.eql([]);
        expect(() => specs.push(new Spec())).to.throwError();
      });

      it('should shallow copy and freeze the array of specs', () => {
        var panel = new GridPanel();
        var specs1 = [new Spec()];
        GridPanel.columnSpecsProperty.set(panel, specs1);
        var specs2 = GridPanel.columnSpecsProperty.get(panel);
        expect(specs1).to.eql(specs2);
        expect(specs1).to.not.be(specs2);
        expect(() => specs1.push(new Spec())).to.not.throwError();
        expect(() => specs2.push(new Spec())).to.throwError();
      });

      it('should post a `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        clearMessageData(panel);
        GridPanel.columnSpecsProperty.set(panel, [new Spec()]);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.rowSpacingProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowSpacingProperty instanceof Property).to.be(true);
      });

      it('should default to `8`', () => {
        var panel = new GridPanel();
        expect(GridPanel.rowSpacingProperty.get(panel)).to.be(8);
      });

      it('should floor fractional values', () => {
        var panel = new GridPanel();
        GridPanel.rowSpacingProperty.set(panel, 4.5);
        expect(GridPanel.rowSpacingProperty.get(panel)).to.be(4);
      });

      it('should clamp values to a minimum of zero', () => {
        var panel = new GridPanel();
        GridPanel.rowSpacingProperty.set(panel, -4);
        expect(GridPanel.rowSpacingProperty.get(panel)).to.be(0);
      });

      it('should post a `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        clearMessageData(panel);
        GridPanel.rowSpacingProperty.set(panel, 4);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.columnSpacingProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnSpacingProperty instanceof Property).to.be(true);
      });

      it('should default to `8`', () => {
        var panel = new GridPanel();
        expect(GridPanel.columnSpacingProperty.get(panel)).to.be(8);
      });

      it('should floor fractional values', () => {
        var panel = new GridPanel();
        GridPanel.columnSpacingProperty.set(panel, 4.5);
        expect(GridPanel.columnSpacingProperty.get(panel)).to.be(4);
      });

      it('should clamp values to a minimum of zero', () => {
        var panel = new GridPanel();
        GridPanel.columnSpacingProperty.set(panel, -4);
        expect(GridPanel.columnSpacingProperty.get(panel)).to.be(0);
      });

      it('should post a `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        clearMessageData(panel);
        GridPanel.columnSpacingProperty.set(panel, 4);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.rowProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowProperty instanceof Property).to.be(true);
      });

      it('should default to `0`', () => {
        var widget = new Widget();
        expect(GridPanel.rowProperty.get(widget)).to.be(0);
      });

      it('should floor fractional values', () => {
        var widget = new Widget();
        GridPanel.rowProperty.set(widget, 4.5);
        expect(GridPanel.rowProperty.get(widget)).to.be(4);
      });

      it('should clamp values to a minimum of zero', () => {
        var widget = new Widget();
        GridPanel.rowProperty.set(widget, -4);
        expect(GridPanel.rowProperty.get(widget)).to.be(0);
      });

      it('should post an `update-request` to the parent', (done) => {
        var panel = new LogPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        clearMessageData(panel);
        GridPanel.rowProperty.set(child0, 1);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.columnProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnProperty instanceof Property).to.be(true);
      });

      it('should default to `0`', () => {
        var widget = new Widget();
        expect(GridPanel.columnProperty.get(widget)).to.be(0);
      });

      it('should floor fractional values', () => {
        var widget = new Widget();
        GridPanel.columnProperty.set(widget, 4.5);
        expect(GridPanel.columnProperty.get(widget)).to.be(4);
      });

      it('should clamp values to a minimum of zero', () => {
        var widget = new Widget();
        GridPanel.columnProperty.set(widget, -4);
        expect(GridPanel.columnProperty.get(widget)).to.be(0);
      });

      it('should post an `update-request` to the parent', (done) => {
        var panel = new LogPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        clearMessageData(panel);
        GridPanel.columnProperty.set(child0, 1);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.rowSpanProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowSpanProperty instanceof Property).to.be(true);
      });

      it('should default to `1`', () => {
        var widget = new Widget();
        expect(GridPanel.rowSpanProperty.get(widget)).to.be(1);
      });

      it('should floor fractional values', () => {
        var widget = new Widget();
        GridPanel.rowSpanProperty.set(widget, 4.5);
        expect(GridPanel.rowSpanProperty.get(widget)).to.be(4);
      });

      it('should clamp values to a minimum of `1`', () => {
        var widget = new Widget();
        GridPanel.rowSpanProperty.set(widget, -4);
        expect(GridPanel.rowSpanProperty.get(widget)).to.be(1);
      });

      it('should post an `update-request` to the parent', (done) => {
        var panel = new LogPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        clearMessageData(panel);
        GridPanel.rowSpanProperty.set(child0, 2);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.columnSpanProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnSpanProperty instanceof Property).to.be(true);
      });

      it('should default to `1`', () => {
        var widget = new Widget();
        expect(GridPanel.columnSpanProperty.get(widget)).to.be(1);
      });

      it('should floor fractional values', () => {
        var widget = new Widget();
        GridPanel.columnSpanProperty.set(widget, 4.5);
        expect(GridPanel.columnSpanProperty.get(widget)).to.be(4);
      });

      it('should clamp values to a minimum of `1`', () => {
        var widget = new Widget();
        GridPanel.columnSpanProperty.set(widget, -4);
        expect(GridPanel.columnSpanProperty.get(widget)).to.be(1);
      });

      it('should post an `update-request` to the parent', (done) => {
        var panel = new LogPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        clearMessageData(panel);
        GridPanel.columnSpanProperty.set(child0, 2);
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.getRow', () => {

      it('should return the origin row index for the given widget', () => {
        var widget = new Widget();
        expect(GridPanel.getRow(widget)).to.be(0);
      });

      it('should be a pure delegate to rowProperty', () => {
        var widget = new Widget();
        GridPanel.rowProperty.set(widget, 1);
        expect(GridPanel.getRow(widget)).to.be(1);
      });

    });

    describe('.setRow', () => {

      it('should set the origin row index for the given widget.', () => {
        var widget = new Widget();
        GridPanel.setRow(widget, 2);
        expect(GridPanel.getRow(widget)).to.be(2);
      });

      it('should be a pure delegate to rowProperty', () => {
        var widget = new Widget();
        GridPanel.setRow(widget, 2);
        expect(GridPanel.rowProperty.get(widget)).to.be(2);
      });

    });

    describe('.getColumn', () => {

      it('should return the origin column index for the given widget', () => {
        var widget = new Widget();
        expect(GridPanel.getColumn(widget)).to.be(0);
      });

      it('should be a pure delegate to columnProperty', () => {
        var widget = new Widget();
        GridPanel.columnProperty.set(widget, 2);
        expect(GridPanel.getColumn(widget)).to.be(2);
      });

    });

    describe('.setColumn', () => {

      it('should set the origin column index for the given widget.', () => {
        var widget = new Widget();
        GridPanel.setColumn(widget, 2);
        expect(GridPanel.getColumn(widget)).to.be(2);
      });

      it('should be a pure delegate to columnProperty', () => {
        var widget = new Widget();
        GridPanel.setColumn(widget, 1);
        expect(GridPanel.columnProperty.get(widget)).to.be(1);
      });

    });

    describe('.getRowSpan', () => {

      it('should return the row span for the given widget', () => {
        var widget = new Widget();
        expect(GridPanel.getRowSpan(widget)).to.be(1);
      });

      it('should be a pure delegate to rowSpanProperty', () => {
        var widget = new Widget();
        GridPanel.rowSpanProperty.set(widget, 2);
        expect(GridPanel.getRowSpan(widget)).to.be(2);
      });

    });

    describe('.setRowSpan', () => {

      it('should set the row span for the given widget', () => {
        var widget = new Widget();
        GridPanel.setRowSpan(widget, 2);
        expect(GridPanel.getRowSpan(widget)).to.be(2);
      });

      it('should be a pure delegate to rowSpanProperty', () => {
        var widget = new Widget();
        GridPanel.setRowSpan(widget, 1);
        expect(GridPanel.rowSpanProperty.get(widget)).to.be(1);
      });

    });

    describe('.getColumnSpan', () => {

      it('should return the column span for the given widget', () => {
        var widget = new Widget();
        expect(GridPanel.getColumnSpan(widget)).to.be(1);
      });

      it('should be a pure delegate to columnSpanProperty', () => {
        var widget = new Widget();
        GridPanel.columnSpanProperty.set(widget, 2);
        expect(GridPanel.getColumnSpan(widget)).to.be(2);
      });

    });

    describe('.setColumnSpan', () => {

      it('should set the column span for the given widget', () => {
        var widget = new Widget();
        GridPanel.setColumnSpan(widget, 2);
        expect(GridPanel.getColumnSpan(widget)).to.be(2);
      });

      it('should be a pure delegate to columnSpanProperty', () => {
        var widget = new Widget();
        GridPanel.setColumnSpan(widget, 1);
        expect(GridPanel.columnSpanProperty.get(widget)).to.be(1);
      });

    });

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        var panel = new GridPanel();
        expect(panel instanceof GridPanel).to.be(true);
      });

      it('should add `p-GridPanel`', () => {
        var panel = new GridPanel();
        expect(panel.hasClass(GridPanel.p_GridPanel)).to.be(true);
      });

    });

    describe('#dispose()', () => {

      it('should dispose of the resources held by the panel', () => {
        var panel = new GridPanel();
        panel.children = [new Widget(), new Widget()];
        panel.dispose();
        expect(panel.isDisposed).to.be(true);
        expect(panel.children.length).to.be(0);
      });

    });

    describe('#rowSpecs', () => {

      it('should get the row specs for the grid panel', () => {
        var panel = new GridPanel();
        expect(panel.rowSpecs).to.eql([]);
      });

      it('should set the row specs for the grid panel', () => {
        var panel = new GridPanel();
        panel.rowSpecs = [new Spec({ stretch: 4 })];
        expect(panel.rowSpecs[0].stretch).to.be(4);
      });

      it('should a pure delegate to the rowSpecsProperty', () => {
        var panel = new GridPanel();
        var spec = new Spec({ maxSize: 3 });
        GridPanel.rowSpecsProperty.set(panel, [spec]);
        expect(panel.rowSpecs[0].maxSize).to.be(3);
        panel.rowSpecs = [new Spec({ maxSize: 4 })];
        var rowSpecs = GridPanel.rowSpecsProperty.get(panel);
        expect(rowSpecs[0].maxSize).to.be(4);
      });

    });

    describe('#columnSpecs', () => {

      it('should get the column specs for the grid panel', () => {
        var panel = new GridPanel();
        expect(panel.columnSpecs).to.eql([]);
      });

      it('should set the column specs for the grid panel', () => {
        var panel = new GridPanel();
        panel.columnSpecs = [new Spec({ stretch: 4 })];
        expect(panel.columnSpecs[0].stretch).to.be(4);
      });

      it('should a pure delegate to the columnSpecsProperty', () => {
        var panel = new GridPanel();
        var spec = new Spec({ maxSize: 3 });
        GridPanel.columnSpecsProperty.set(panel, [spec]);
        expect(panel.columnSpecs[0].maxSize).to.be(3);
        panel.columnSpecs = [new Spec({ maxSize: 4 })];
        var columnSpecs = GridPanel.columnSpecsProperty.get(panel);
        expect(columnSpecs[0].maxSize).to.be(4);
      });

    });

    describe('#rowSpacing', () => {

      it('should get the row spacing for the grid panel', () => {
        var panel = new GridPanel();
        expect(panel.rowSpacing).to.be(8);
      });

      it('should set the row spacing for the grid panel', () => {
        var panel = new GridPanel();
        panel.rowSpacing = 4;
        expect(panel.rowSpacing).to.be(4);
      });

      it('should a pure delegate to the rowSpacingProperty', () => {
        var panel = new GridPanel();
        GridPanel.rowSpacingProperty.set(panel, 4);
        expect(panel.rowSpacing).to.be(4);
        panel.rowSpacing = 5;
        var rowSpacing = GridPanel.rowSpacingProperty.get(panel);
        expect(rowSpacing).to.be(5);
      });

    });

    describe('#columnSpacing', () => {

      it('should get the column spacing for the grid panel', () => {
        var panel = new GridPanel();
        expect(panel.columnSpacing).to.be(8);
      });

      it('should set the column spacing for the grid panel', () => {
        var panel = new GridPanel();
        panel.columnSpacing = 4;
        expect(panel.columnSpacing).to.be(4);
      });

      it('should a pure delegate to the columnSpacingProperty', () => {
        var panel = new GridPanel();
        GridPanel.columnSpacingProperty.set(panel, 4);
        expect(panel.columnSpacing).to.be(4);
        panel.columnSpacing = 5;
        var columnSpacing = GridPanel.columnSpacingProperty.get(panel);
        expect(columnSpacing).to.be(5);
      });

    });

    describe('#onChildAdded()', () => {

      it('should be invoked when a child is added', () => {
        var panel = new LogPanel();
        var widget = new Widget();
        attachWidget(panel, document.body);
        expect(panel.messages.indexOf('child-added')).to.be(-1);
        panel.children = [widget];
        expect(panel.messages.indexOf('child-added')).to.not.be(-1);
      });

      it('should send `after-attach` to the child', () => {
        var panel = new LogPanel();
        var widget = new LogWidget();
        attachWidget(panel, document.body);
        expect(widget.messages.indexOf('after-attach')).to.be(-1);
        panel.children = [widget];
        expect(widget.messages.indexOf('after-attach')).to.not.be(-1);
      });

      it('should post an `update-request`', (done) => {
        var panel = new LogPanel();
        var widget = new Widget();
        attachWidget(panel, document.body);
        clearMessageData(panel);
        panel.children = [widget];
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('#onChildRemoved()', () => {

      it('should be invoked when a child is removed', () => {
        var panel = new LogPanel();
        var widget = new Widget();
        panel.children = [widget];
        attachWidget(panel, document.body);
        expect(panel.messages.indexOf('child-removed')).to.be(-1);
        panel.children = [];
        expect(panel.messages.indexOf('child-removed')).to.not.be(-1);
      });

      it('should send `before-detach` to the child', () => {
        var panel = new LogPanel();
        var widget = new LogWidget();
        attachWidget(panel, document.body);
        panel.children = [widget];
        expect(widget.messages.indexOf('before-detach')).to.be(-1);
        panel.children = [];
        expect(widget.messages.indexOf('before-detach')).to.not.be(-1);
      });

      it('should clear the offset geometry of the child', () => {
        var panel = new LogPanel();
        var child = new Widget();
        panel.children = [child];
        child.setOffsetGeometry(5, 5, 5, 5);
        expect(child.offsetRect).to.eql({ left: 5, top: 5, width: 5, height: 5 });
        panel.children = [];
        expect(child.offsetRect).to.eql({ left: 0, top: 0, width: 0, height: 0 });
      });

    });

    describe('#onAfterShow()', () => {

      it('should be invoked when the panel is shown', () => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        panel.hidden = true;
        expect(panel.messages.indexOf('after-show')).to.be(-1);
        panel.hidden = false;
        expect(panel.messages.indexOf('after-show')).to.not.be(-1);
      });

      it('should send an `update-request`', () => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        clearMessageData(panel);
        panel.hidden = true;
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        panel.hidden = false;
        expect(panel.messages.indexOf('update-request')).to.not.be(-1);
      });

    });

    describe('#onAfterAttach()', () => {

      it('should be invoked when the panel is attached', () => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        expect(panel.messages.indexOf('after-attach')).to.not.be(-1);
      });

      it('post a `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        expect(panel.messages.indexOf('layout-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('#onChildShown()', () => {

      it('should be invoked when a child is shown', () => {
        var panel = new LogPanel();
        var widget = new Widget();
        widget.hidden = true;
        panel.children = [widget];
        attachWidget(panel, document.body);
        expect(panel.messages.indexOf('child-shown')).to.be(-1);
        widget.hidden = false;
        expect(panel.messages.indexOf('child-shown')).to.not.be(-1);
      });

      it('should post an `update-request`', (done) => {
        var panel = new LogPanel();
        var widget = new Widget();
        widget.hidden = true;
        panel.children = [widget];
        attachWidget(panel, document.body);
        clearMessageData(panel);
        widget.hidden = false;
        expect(panel.messages.indexOf('update-request')).to.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('update-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('#onResize()', () => {

      it('should be invoked on a `resize` message', () => {
        var panel = new LogPanel();
        var message = new ResizeMessage(100, 100);
        attachWidget(panel, document.body);
        sendMessage(panel, message);
        expect(panel.messages.indexOf('resize')).to.not.be(-1);
      });

      it('should handle an unknown size', () => {
        var panel = new LogPanel();
        var widget = new Widget();
        panel.children = [widget];
        attachWidget(panel, document.body);
        expect(panel.messages.indexOf('resize')).to.be(-1);
        sendMessage(panel, ResizeMessage.UnknownSize);
        expect(panel.messages.indexOf('resize')).to.not.be(-1);
      });

      it('should resize the children', () => {
        var panel = new GridPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.rowSpecs = [new Spec()];
        panel.columnSpecs = [new Spec()];
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        panel.node.style.position = 'absolute';
        sendMessage(panel, MSG_LAYOUT_REQUEST);
        panel.setOffsetGeometry(0, 0, 100, 100);
        var r1 = child0.offsetRect;
        var r2 = child1.offsetRect;
        expect(r1).to.eql({ left: 0, top: 0, width: 100, height: 100 });
        expect(r2).to.eql({ left: 0, top: 0, width: 100, height: 100 });
      });

    });

    describe('#onUpdateRequest()', () => {

      it('should be invoked on an `update-request` message', () => {
        var panel = new LogPanel();
        panel.update(true);
        expect(panel.messages.indexOf('update-request')).to.not.be(-1);
      });

      it('should resize the children', () => {
        var panel = new GridPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.rowSpecs = [new Spec()];
        panel.columnSpecs = [new Spec()];
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        panel.node.style.position = 'absolute';
        sendMessage(panel, MSG_LAYOUT_REQUEST);
        panel.node.style.top = '0px';
        panel.node.style.left = '0px';
        panel.node.style.width = '200px';
        panel.node.style.height = '200px';
        panel.update(true);
        var r1 = child0.offsetRect;
        var r2 = child1.offsetRect;
        expect(r1).to.eql({ left: 0, top: 0, width: 200, height: 200 });
        expect(r2).to.eql({ left: 0, top: 0, width: 200, height: 200 });
      });

    });

    describe('#onLayoutRequest()', () => {

      it('should be invoked on a `layout-request` message', () => {
        var panel = new LogPanel();
        sendMessage(panel, MSG_LAYOUT_REQUEST);
        expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
      });

      it('should send a `layout-request` to its parent', () => {
        var panel1 = new LogPanel();
        var panel2 = new LogPanel();
        panel2.parent = panel1;
        attachWidget(panel1, document.body);
        clearMessageData(panel1);
        clearMessageData(panel2);
        expect(panel1.messages.indexOf('layout-request')).to.be(-1);
        sendMessage(panel2, MSG_LAYOUT_REQUEST);
        expect(panel1.messages.indexOf('layout-request')).to.not.be(-1);
      });

      it('should setup the geometry of the panel', () => {
        var panel = new GridPanel();
        panel.rowSpecs = [new Spec({ minSize: 50 })];
        panel.columnSpecs = [new Spec({ minSize: 50 })];
        attachWidget(panel, document.body);
        expect(panel.node.style.minWidth).to.be('');
        expect(panel.node.style.minHeight).to.be('');
        sendMessage(panel, MSG_LAYOUT_REQUEST);
        expect(panel.node.style.minWidth).to.be('50px');
        expect(panel.node.style.minHeight).to.be('50px');
      });

    });

    context('spec property change', () => {

      it('should post a `layout-request` on spec change', () => {
        var panel = new LogPanel();
        var rspec = new Spec({ minSize: 50 });
        var cspec = new Spec({ minSize: 50 });
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
        var r1 = new Widget();
        var g1 = new Widget();
        var b1 = new Widget();
        var y1 = new Widget();

        var r2 = new Widget();
        var g2 = new Widget();
        var b2 = new Widget();
        var y2 = new Widget();

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

        var panel = new LogPanel();

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

        panel.children = [r1, g1, b1, y1, r2, g2, b2, y2];
        panel.node.style.position = 'absolue';

        attachWidget(panel, document.body);
        sendMessage(panel, MSG_LAYOUT_REQUEST);
        panel.setOffsetGeometry(0, 0, 500, 500);

        expect(r1.offsetRect).to.eql({ left: 0, top: 0, width: 200, height: 217 });
        expect(g1.offsetRect).to.eql({ left: 0, top: 225, width: 200, height: 67 });
        expect(b1.offsetRect).to.eql({ left: 0, top: 300, width: 200, height: 200 });

        expect(y1.offsetRect).to.eql({ left: 208, top: 0, width: 217, height: 292 });
        expect(r2.offsetRect).to.eql({ left: 208, top: 300, width: 67, height: 200 });
        expect(g2.offsetRect).to.eql({ left: 283, top: 300, width: 67, height: 200 });
        expect(y2.offsetRect).to.eql({ left: 358, top: 300, width: 67, height: 200 });

        expect(b2.offsetRect).to.eql({ left: 433, top: 0, width: 67, height: 500 });
      });

    });

  });

  describe('Spec', () => {

    describe('.sizeBasisProperty', () => {

      it('should be a property descriptor', () => {
        expect(Spec.sizeBasisProperty instanceof Property).to.be(true);
      });

      it('should default to `0`', () => {
        var spec = new Spec({});
        expect(Spec.sizeBasisProperty.get(spec)).to.be(0);
      });

    });

    describe('.minSizeProperty', () => {

      it('should be a property descriptor', () => {
        expect(Spec.minSizeProperty instanceof Property).to.be(true);
      });

      it('should default to `0`', () => {
        var spec = new Spec({});
        expect(Spec.minSizeProperty.get(spec)).to.be(0);
      });

      it('should be clamped to a lower bound of `0`', () => {
        var spec = new Spec({ minSize: -1 });
        expect(Spec.minSizeProperty.get(spec)).to.be(0);
      });

    });

    describe('.maxSizeProperty', () => {

      it('should be a property descriptor', () => {
        expect(Spec.maxSizeProperty instanceof Property).to.be(true);
      });

      it('should default to `Infinity`', () => {
        var spec = new Spec({});
        expect(Spec.maxSizeProperty.get(spec)).to.be(Infinity);
      });

      it('should be clamped to a lower bound of `0`', () => {
        var spec = new Spec({ maxSize: -1 });
        expect(Spec.maxSizeProperty.get(spec)).to.be(0);
      });

    });

    describe('.stretchProperty', () => {

      it('should be a property descriptor', () => {
        expect(Spec.stretchProperty instanceof Property).to.be(true);
      });

      it('should default to `1`', () => {
        var spec = new Spec();
        expect(Spec.stretchProperty.get(spec)).to.be(1);
      });

      it('should floor fractional values', () => {
        var spec = new Spec({ stretch: 4.5 });
        expect(Spec.stretchProperty.get(spec)).to.be(4);
      });

      it('should be clamped to a lower bound of `0`', () => {
        var spec = new Spec({ stretch: -1 });
        expect(Spec.stretchProperty.get(spec)).to.be(0);
      });

    });

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        var spec = new Spec();
        expect(spec instanceof Spec).to.be(true);
      });

      it('should accept ISpecOptions', () => {
        var spec = new Spec({ sizeBasis: 1, minSize: 1, maxSize: 1, stretch: 2 });
        expect(spec instanceof Spec).to.be(true);
      });

    });

    describe('#sizeBasis', () => {

      it('should get the size basis for the spec', () => {
        var spec = new Spec();
        expect(spec.sizeBasis).to.be(0);
      });

      it('should set the size basis for the spec', () => {
        var spec = new Spec();
        spec.sizeBasis = 4;
        expect(spec.sizeBasis).to.be(4);
      });

      it('should a pure delegate to the sizeBasisProperty', () => {
        var spec = new Spec();
        Spec.sizeBasisProperty.set(spec, 4);
        expect(spec.sizeBasis).to.be(4);
        spec.sizeBasis = 5;
        var sizeBasis = Spec.sizeBasisProperty.get(spec);
        expect(sizeBasis).to.be(5);
      });

    });

    describe('#minSize', () => {

      it('should get the min size for the spec', () => {
        var spec = new Spec();
        expect(spec.minSize).to.be(0);
      });

      it('should set the min size for the spec', () => {
        var spec = new Spec();
        spec.minSize = 4;
        expect(spec.minSize).to.be(4);
      });

      it('should a pure delegate to the minSizeProperty', () => {
        var spec = new Spec();
        Spec.minSizeProperty.set(spec, 4);
        expect(spec.minSize).to.be(4);
        spec.minSize = 5;
        var minSize = Spec.minSizeProperty.get(spec);
        expect(minSize).to.be(5);
      });

    });

    describe('#maxSize', () => {

      it('should get the max size for the spec', () => {
        var spec = new Spec();
        expect(spec.maxSize).to.be(Infinity);
      });

      it('should set the max size for the spec', () => {
        var spec = new Spec();
        spec.maxSize = 4;
        expect(spec.maxSize).to.be(4);
      });

      it('should a pure delegate to the maxSizeProperty', () => {
        var spec = new Spec();
        Spec.maxSizeProperty.set(spec, 4);
        expect(spec.maxSize).to.be(4);
        spec.maxSize = 5;
        var maxSize = Spec.maxSizeProperty.get(spec);
        expect(maxSize).to.be(5);
      });

    });

    describe('#stretch', () => {

      it('should get the stretch factor for the spec', () => {
        var spec = new Spec();
        expect(spec.stretch).to.be(1);
      });

      it('should set the stretch factor for the spec', () => {
        var spec = new Spec();
        spec.stretch = 4;
        expect(spec.stretch).to.be(4);
      });

      it('should a pure delegate to the stretchProperty', () => {
        var spec = new Spec();
        Spec.stretchProperty.set(spec, 4);
        expect(spec.stretch).to.be(4);
        spec.stretch = 5;
        var stretch = Spec.stretchProperty.get(spec);
        expect(stretch).to.be(5);
      });

    });

  });

});
