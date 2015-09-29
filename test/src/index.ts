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
  Message, postMessage, sendMessage
} from 'phosphor-messaging';

import {
  Property
} from 'phosphor-properties';

import {
  attachWidget, detachWidget, ResizeMessage, Widget
} from 'phosphor-widget';

import {
  GRID_PANEL_CLASS, GridPanel, ISpecOptions, Spec
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


  describe('GRID_PANEL_CLASS', () => {

    it('should equal `p-GridPanel`', () => {
      expect(GRID_PANEL_CLASS).to.be('p-GridPanel');
    });

  });

  describe('GridPanel', () => {

    describe('.rowSpecsProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowSpecsProperty instanceof Property).to.be(true);
      });

      it('should default to a frozen empty list', () => {
        var panel = new GridPanel();
        var specs = GridPanel.rowSpecsProperty.get(panel);
        expect(specs).to.eql([]);
        expect(() => specs.push(new Spec())).to.throwError();
      });

      it('should post `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        GridPanel.rowSpecsProperty.set(panel, []);
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

      it('should default to a frozen empty list', () => {
        var panel = new GridPanel();
        var specs = GridPanel.columnSpecsProperty.get(panel);
        expect(specs).to.eql([]);
        expect(() => specs.push(new Spec())).to.throwError();
      });

      it('should post `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        GridPanel.columnSpecsProperty.set(panel, []);
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

      it('should post `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        GridPanel.rowSpacingProperty.set(panel, 4);
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

      it('should post `layout-request`', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        GridPanel.columnSpacingProperty.set(panel, 4);
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
        var panel = new GridPanel();
        expect(GridPanel.rowProperty.get(panel)).to.be(0);
      });

      it('should post `layout-request` to the parent', (done) => {
        var panel = new LogPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        GridPanel.rowProperty.set(child0, 1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.columnProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnProperty instanceof Property).to.be(true);
      });

      it('should default to `0`', () => {
        var panel = new GridPanel();
        expect(GridPanel.columnProperty.get(panel)).to.be(0);
      });

      it('should post `layout-request` to the parent', (done) => {
        var panel = new LogPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        GridPanel.columnProperty.set(child0, 1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.rowSpanProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.rowSpanProperty instanceof Property).to.be(true);
      });

      it('should default to `1`', () => {
        var panel = new GridPanel();
        expect(GridPanel.rowSpanProperty.get(panel)).to.be(1);
      });

      it('should post `layout-request` to the parent', (done) => {
        var panel = new LogPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        GridPanel.rowSpanProperty.set(child0, 2);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.columnSpanProperty', () => {

      it('should be a property descriptor', () => {
        expect(GridPanel.columnSpanProperty instanceof Property).to.be(true);
      });

      it('should default to `1`', () => {
        var panel = new GridPanel();
        expect(GridPanel.columnSpanProperty.get(panel)).to.be(1);
      });

      it('should post `layout-request` to the parent', (done) => {
        var panel = new LogPanel();
        var child0 = new Widget();
        var child1 = new Widget();
        panel.children = [child0, child1];
        attachWidget(panel, document.body);
        GridPanel.columnSpanProperty.set(child0, 2);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
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

      it('should add `GRID_PANEL_CLASS`', () => {
        var panel = new GridPanel();
        expect(panel.hasClass(GRID_PANEL_CLASS)).to.be(true);
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

    describe('#onChildAdded()', () => {

      it('should be invoked when a child is added', (done) => {
        var panel = new LogPanel();
        var widget = new LogWidget();
        attachWidget(panel, document.body);
        panel.children = [widget];
        expect(panel.messages.indexOf('child-added')).to.not.be(-1);
        expect(panel.messages.indexOf('after-attach')).to.not.be(-1);
        expect(widget.messages.indexOf('after-attach')).to.not.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('#onChildRemoved()', () => {

      it('should be invoked when a child is removed', (done) => {
        var panel = new LogPanel();
        var widget = new Widget();
        panel.children = [widget];
        attachWidget(panel, document.body);
        panel.messages = [];
        panel.children = [];
        expect(panel.messages.indexOf('child-removed')).to.not.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });
      
    });

    describe('#onChildMoved()', () => {

      it('should be invoked when a child is moved', (done) => {
        var panel = new LogPanel();
        var widget0 = new Widget();
        var widget1 = new Widget();
        panel.children = [widget0, widget1];
        attachWidget(panel, document.body);
        panel.messages = [];
        panel.moveChild(1, 0);
        expect(panel.messages.indexOf('child-moved')).to.not.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });
      
    });

    describe('#onAfterShow()', () => {

      it('should be invoked when the panel is shown', () => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        panel.hidden = true;
        panel.hidden = false;
        expect(panel.messages.indexOf('after-show')).to.not.be(-1);
      });
      
    });

    describe('#onAfterAttach()', () => {

      it('should be invoked when the panel is attached', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        expect(panel.messages.indexOf('after-attach')).to.not.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('#onBeforeDetach()', () => {

      it('should be invoked when the panel is detached', () => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        detachWidget(panel);
        expect(panel.messages.indexOf('before-detach')).to.not.be(-1);
      });
      
    });

    describe('#onChildShown()', () => {

      it('should be invoked when a child is shown', (done) => {
        var panel = new LogPanel();
        var widget = new Widget();
        widget.hidden = true;
        panel.children = [widget];
        attachWidget(panel, document.body);
        widget.hidden = false;
        expect(panel.messages.indexOf('child-shown')).to.not.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });
      
    });

    describe('#onChildHidden()', () => {

      it('should be invoked when a child is hidden', (done) => {
        var panel = new LogPanel();
        var widget = new Widget();
        panel.children = [widget];
        attachWidget(panel, document.body);
        widget.hidden = true;
        expect(panel.messages.indexOf('child-hidden')).to.not.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });
      
    });

    describe('#onResize()', () => {

      it('should be invoked on resize event', () => {
        var panel = new LogPanel();
        var widget = new Widget();
        panel.children = [widget];
        attachWidget(panel, document.body);
        var message = new ResizeMessage(100, 100);
        sendMessage(panel, message);
        expect(panel.messages.indexOf('resize')).to.not.be(-1);
      });
      
      it('should be handle an unknown size', () => {
        var panel = new LogPanel();
        var widget = new Widget();
        panel.children = [widget];
        attachWidget(panel, document.body);
        sendMessage(panel, ResizeMessage.UnknownSize);
        expect(panel.messages.indexOf('resize')).to.not.be(-1);
      });
    });

    describe('#onUpdateRequest()', () => {

      it('should be invoked on update', () => {
        var panel = new LogPanel();
        var widget = new Widget();
        panel.children = [widget];
        attachWidget(panel, document.body);
        panel.update(true);
        expect(panel.messages.indexOf('update-request')).to.not.be(-1);
      });

    });

    describe('#onLayoutRequest()', () => {

      it('should be invoked when a panel is attached', (done) => {
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

  });

  describe('Spec', () => {

    describe('.sizeBasisProperty', () => {

    });

  });

});
