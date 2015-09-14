/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  BoxSizer
} from 'phosphor-boxengine';

import {
  Message, postMessage, sendMessage
} from 'phosphor-messaging';

import {
  IChangedArgs, Property
} from 'phosphor-properties';

import {
  ChildMessage, MSG_AFTER_ATTACH, MSG_BEFORE_DETACH, MSG_LAYOUT_REQUEST,
  ResizeMessage, Widget
} from 'phosphor-widget';


/**
 * `p-GridPanel`: the class name added to GridPanel instances.
 */
export
const GRID_PANEL_CLASS = 'p-GridPanel';


/**
 * A Phosphor layout widget which arranges its children into a 2D grid.
 */
class GridPanel extends Widget {

  /**
   *
   */
  static rowProperty = new Property<Widget, number>({
    value: 0,
    coerce: (owner, value) => Math.max(0, value | 0),
  });

  /**
   *
   */
  static columnProperty = new Property<Widget, number>({
    value: 0,
    coerce: (owner, value) => Math.max(0, value | 0),
  });

  /**
   *
   */
  static rowSpanProperty = new Property<Widget, number>({
    value: 1,
    coerce: (owner, value) => Math.max(1, value | 0),
  });

  /**
   *
   */
  static columnSpanProperty = new Property<Widget, number>({
    value: 1,
    coerce: (owner, value) => Math.max(1, value | 0),
  });

  /**
   *
   */
  static rowStretchProperty = new Property<Widget, number>({
    value: 1,
    coerce: (owner, value) => Math.max(0, value | 0),
  });

  /**
   *
   */
  static columnStretchProperty = new Property<Widget, number>({
    value: 1,
    coerce: (owner, value) => Math.max(0, value | 0),
  });

  /**
   *
   */
  static getRow(widget: Widget): number {
    return GridPanel.rowProperty.get(widget);
  }

  /**
   *
   */
  static setRow(widget: Widget, value: number): void {
    GridPanel.rowProperty.set(widget, value);
  }

  /**
   *
   */
  static getColumn(widget: Widget): number {
    return GridPanel.columnProperty.get(widget);
  }

  /**
   *
   */
  static setColumn(widget: Widget, value: number): void {
    GridPanel.columnProperty.set(widget, value);
  }

  /**
   *
   */
  static getRowSpan(widget: Widget): number {
    return GridPanel.rowSpanProperty.get(widget);
  }

  /**
   *
   */
  static setRowSpan(widget: Widget, value: number): void {
    GridPanel.rowSpanProperty.set(widget, value);
  }

  /**
   *
   */
  static getColumnSpan(widget: Widget): number {
    return GridPanel.columnSpanProperty.get(widget);
  }

  /**
   *
   */
  static setColumnSpan(widget: Widget, value: number): void {
    GridPanel.columnSpanProperty.set(widget, value);
  }

  /**
   *
   */
  static getRowStretch(widget: Widget): number {
    return GridPanel.rowStretchProperty.get(widget);
  }

  /**
   *
   */
  static setRowStretch(widget: Widget, value: number): void {
    GridPanel.rowStretchProperty.set(widget, value);
  }

  /**
   *
   */
  static getColumnStretch(widget: Widget): number {
    return GridPanel.columnStretchProperty.get(widget);
  }

  /**
   *
   */
  static setColumnStretch(widget: Widget, value: number): void {
    GridPanel.columnStretchProperty.set(widget, value);
  }

  /**
   * Construct a new grid panel.
   */
  constructor() {
    super();
    this.addClass(GRID_PANEL_CLASS);
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    this._rowSizers.length = 0;
    this._colSizers.length = 0;
    super.dispose();
  }

  /**
   * A message handler invoked on a `'child-added'` message.
   */
  protected onChildAdded(msg: ChildMessage): void {
    Property.getChanged(msg.child).connect(this._onPropertyChanged, this);
    this.node.appendChild(msg.child.node);
    if (this.isAttached) sendMessage(msg.child, MSG_AFTER_ATTACH);
    postMessage(this, MSG_LAYOUT_REQUEST);
  }

  /**
   * A message handler invoked on a `'child-removed'` message.
   */
  protected onChildRemoved(msg: ChildMessage): void {
    Property.getChanged(msg.child).disconnect(this._onPropertyChanged, this);
    if (this.isAttached) sendMessage(msg.child, MSG_BEFORE_DETACH);
    this.node.removeChild(msg.child.node);
    postMessage(this, MSG_LAYOUT_REQUEST);
    msg.child.clearOffsetGeometry();
  }

  /**
   * A message handler invoked on a `'child-moved'` message.
   */
  protected onChildMoved(msg: ChildMessage): void { /* no-op */ }

  /**
   * A message handler invoked on an `'after-show'` message.
   */
  protected onAfterShow(msg: Message): void {
    this.update(true);
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    postMessage(this, MSG_LAYOUT_REQUEST);
  }

  /**
   * A message handler invoked on a `'child-shown'` message.
   */
  protected onChildShown(msg: ChildMessage): void {
    postMessage(this, MSG_LAYOUT_REQUEST);
  }

  /**
   * A message handler invoked on a `'child-hidden'` message.
   */
  protected onChildHidden(msg: ChildMessage): void {
    postMessage(this, MSG_LAYOUT_REQUEST);
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: ResizeMessage): void {
    if (this.isVisible) {
      if (msg.width < 0 || msg.height < 0) {
        var rect = this.offsetRect;
        this._layoutChildren(rect.width, rect.height);
      } else {
        this._layoutChildren(msg.width, msg.height);
      }
    }
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    if (this.isVisible) {
      var rect = this.offsetRect;
      this._layoutChildren(rect.width, rect.height);
    }
  }

  /**
   * A message handler invoked on a `'layout-request'` message.
   */
  protected onLayoutRequest(msg: Message): void {
    if (this.isAttached) {
      this._setupGeometry();
    }
  }

  /**
   * Setup the size limits and internal grid panel state.
   */
  private _setupGeometry(): void {

  }

  /**
   * Layout the children using the given offset width and height.
   */
  private _layoutChildren(offsetWidth: number, offsetHeight: number): void {

  }

  /**
   * The handler for the child property changed signal.
   */
  private _onPropertyChanged(sender: Widget, args: IChangedArgs): void {
    switch (args.property) {
    case GridPanel.rowProperty:
    case GridPanel.columnProperty:
    case GridPanel.rowSpanProperty:
    case GridPanel.columnSpanProperty:
    case GridPanel.rowStretchProperty:
    case GridPanel.columnStretchProperty:
      postMessage(this, MSG_LAYOUT_REQUEST);
    }
  }

  private _rowSizers: BoxSizer[] = [];
  private _colSizers: BoxSizer[] = [];
}
