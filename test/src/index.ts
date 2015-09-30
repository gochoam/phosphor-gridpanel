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
  Message, sendMessage
} from 'phosphor-messaging';

import {
  Property
} from 'phosphor-properties';

import {
  attachWidget, detachWidget, ResizeMessage, Widget
} from 'phosphor-widget';

import {
  GRID_PANEL_CLASS, GridPanel, Spec
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
        panel.rowSpecs[0].maxSize = 5;
        expect(panel.rowSpecs[0].maxSize).to.be(5);
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

    describe('example', () => {

      it('should excercise the full API', (done) => {
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

        var parent = new Widget();
        parent.children = [panel];

        attachWidget(parent, document.body);

        expect(panel.messages.indexOf('child-added')).to.not.be(-1);
        expect(panel.messages.indexOf('after-attach')).to.not.be(-1);
        requestAnimationFrame(() => {
          expect(panel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
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
        var spec = new Spec({});
        expect(Spec.stretchProperty.get(spec)).to.be(1);
      });

      it('should be clamped to a lower bound of `0`', () => {
        var spec = new Spec({ stretch: -1 });
        expect(Spec.stretchProperty.get(spec)).to.be(0);
      });

    });

    describe('#constructor()', () => {

      it('should accept ISpecOptions', () => {
        var spec = new Spec({ sizeBasis: 1, minSize: 1, maxSize: 1,
                              stretch: 2 });
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
