/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  BoxSizer, boxCalc
} from 'phosphor-boxengine';

import {
  IBoxSizing, ISizeLimits, boxSizing, sizeLimits
} from 'phosphor-domutil';

import {
  Message, postMessage, sendMessage
} from 'phosphor-messaging';

import {
  IChangedArgs, Property
} from 'phosphor-properties';

import {
  ISignal, Signal
} from 'phosphor-signaling';

import {
  ChildMessage, Panel, ResizeMessage, Widget
} from 'phosphor-widget';

import './index.css';


/**
 * The class name added to GridPanel instances.
 */
const GRID_PANEL_CLASS = 'p-GridPanel';


/**
 * A panel which arranges its children into a 2D grid.
 */
export
class GridPanel extends Panel {
  /**
   * The property descriptor for the row specifications.
   *
   * This controls the layout of the rows in the grid panel.
   *
   * #### Notes
   * This property creates a frozen shallow copy of the assigned specs
   * array. This means that the specs can only be changed in bulk and
   * that in-place modifications to the array are not allowed.
   *
   * **See also:** [[rowSpecs]]
   */
  static rowSpecsProperty = new Property<GridPanel, Spec[]>({
    name: 'rowSpecs',
    value: Object.freeze([]),
    coerce: (owner, value) => Object.freeze(value ? value.slice() : []),
    changed: (owner, old, value) => { owner._onRowSpecsChanged(old, value); },
  });

  /**
   * The property descriptor for the column specifications.
   *
   * This controls the layout of the columns in the grid panel.
   *
   * #### Notes
   * This property creates a frozen shallow copy of the assigned specs
   * array. This means that the specs can only be changed in bulk and
   * that in-place modifications to the array are not allowed.
   *
   * **See also:** [[columnSpecs]]
   */
  static columnSpecsProperty = new Property<GridPanel, Spec[]>({
    name: 'columnSpecs',
    value: Object.freeze([]),
    coerce: (owner, value) => Object.freeze(value ? value.slice() : []),
    changed: (owner, old, value) => { owner._onColSpecsChanged(old, value); },
  });

  /**
   * The property descriptor for the grid panel row spacing.
   *
   * The controls the fixed row spacing between the child widgets.
   *
   * #### Notes
   * The default value is `8`.
   *
   * **See also:** [[rowSpacing]]
   */
  static rowSpacingProperty = new Property<GridPanel, number>({
    name: 'rowSpacing',
    value: 8,
    coerce: (owner, value) => Math.max(0, value | 0),
    changed: owner => { postMessage(owner, Panel.MsgLayoutRequest); },
  });

  /**
   * The property descriptor for the grid panel column spacing.
   *
   * The controls the fixed column spacing between the child widgets.
   *
   * #### Notes
   * The default value is `8`.
   *
   * **See also:** [[columnSpacing]]
   */
  static columnSpacingProperty = new Property<GridPanel, number>({
    name: 'columnSpacing',
    value: 8,
    coerce: (owner, value) => Math.max(0, value | 0),
    changed: owner => { postMessage(owner, Panel.MsgLayoutRequest); },
  });

  /**
   * The property descriptor for a widget's grid row index.
   *
   * #### Notes
   * This value is an integer clamped to a lower bound of `0`.
   *
   * The default value is `0`.
   *
   * **See also:** [[getRow]], [[setRow]]
   */
  static rowProperty = new Property<Widget, number>({
    name: 'row',
    value: 0,
    coerce: (owner, value) => Math.max(0, value | 0),
    changed: onChildPropertyChanged,
  });

  /**
   * The property descriptor for a widget's grid column index.
   *
   * #### Notes
   * This value is an integer clamped to a lower bound of `0`.
   *
   * The default value is `0`.
   *
   * **See also:** [[getColumn]], [[setColumn]]
   */
  static columnProperty = new Property<Widget, number>({
    name: 'column',
    value: 0,
    coerce: (owner, value) => Math.max(0, value | 0),
    changed: onChildPropertyChanged,
  });

  /**
   * The property descriptor for a widget's grid row span.
   *
   * #### Notes
   * This value is an integer clamped to a lower bound of `1`.
   *
   * The default value is `1`.
   *
   * **See also:** [[getRowSpan]], [[setRowSpan]]
   */
  static rowSpanProperty = new Property<Widget, number>({
    name: 'rowSpan',
    value: 1,
    coerce: (owner, value) => Math.max(1, value | 0),
    changed: onChildPropertyChanged,
  });

  /**
   * The property descriptor for a widget's grid column span.
   *
   * #### Notes
   * This value is an integer clamped to a lower bound of `1`.
   *
   * The default value is `1`.
   *
   * **See also:** [[getColumnSpan]], [[setColumnSpan]]
   */
  static columnSpanProperty = new Property<Widget, number>({
    name: 'columnSpan',
    value: 1,
    coerce: (owner, value) => Math.max(1, value | 0),
    changed: onChildPropertyChanged,
  });

  /**
   * Get the grid row index for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @returns The grid row index of the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[rowProperty]].
   */
  static getRow(widget: Widget): number {
    return GridPanel.rowProperty.get(widget);
  }

  /**
   * Set the grid row index for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @param value - The value for the grid row index.
   *
   * #### Notes
   * This is a pure delegate to the [[rowProperty]].
   */
  static setRow(widget: Widget, value: number): void {
    GridPanel.rowProperty.set(widget, value);
  }

  /**
   * Get the grid column index for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @returns The grid column index of the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[columnProperty]].
   */
  static getColumn(widget: Widget): number {
    return GridPanel.columnProperty.get(widget);
  }

  /**
   * Set the grid column index for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @param value - The value for the grid column index.
   *
   * #### Notes
   * This is a pure delegate to the [[columnProperty]].
   */
  static setColumn(widget: Widget, value: number): void {
    GridPanel.columnProperty.set(widget, value);
  }

  /**
   * Get the grid row span for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @returns The grid row span of the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[rowSpanProperty]].
   */
  static getRowSpan(widget: Widget): number {
    return GridPanel.rowSpanProperty.get(widget);
  }

  /**
   * Set the grid row span for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @param value - The grid row span for the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[rowSpanProperty]].
   */
  static setRowSpan(widget: Widget, value: number): void {
    GridPanel.rowSpanProperty.set(widget, value);
  }

  /**
   * Get the grid column span for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @returns The grid column span of the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[columnSpanProperty]].
   */
  static getColumnSpan(widget: Widget): number {
    return GridPanel.columnSpanProperty.get(widget);
  }

  /**
   * Set the grid column span for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @param value - The grid column span for the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[columnSpanProperty]].
   */
  static setColumnSpan(widget: Widget, value: number): void {
    GridPanel.columnSpanProperty.set(widget, value);
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
    this._rowStarts.length = 0;
    this._colStarts.length = 0;
    this._rowSizers.length = 0;
    this._colSizers.length = 0;
    super.dispose();
  }

  /**
   * Get the row specs for the grid panel.
   *
   * #### Notes
   * This is a pure delegate to the [[rowSpecsProperty]].
   */
  get rowSpecs(): Spec[] {
    return GridPanel.rowSpecsProperty.get(this);
  }

  /**
   * Set the row specs for the grid panel.
   *
   * #### Notes
   * This is a pure delegate to the [[rowSpecsProperty]].
   */
  set rowSpecs(value: Spec[]) {
    GridPanel.rowSpecsProperty.set(this, value);
  }

  /**
   * Get the column specs for the grid panel.
   *
   * #### Notes
   * This is a pure delegate to the [[columnSpecsProperty]].
   */
  get columnSpecs(): Spec[] {
    return GridPanel.columnSpecsProperty.get(this);
  }

  /**
   * Set the column specs for the grid panel.
   *
   * #### Notes
   * This is a pure delegate to the [[columnSpecsProperty]].
   */
  set columnSpecs(value: Spec[]) {
    GridPanel.columnSpecsProperty.set(this, value);
  }

  /**
   * Get the row spacing for the grid panel.
   *
   * #### Notes
   * This is a pure delegate to the [[rowSpacingProperty]].
   */
  get rowSpacing(): number {
    return GridPanel.rowSpacingProperty.get(this);
  }

  /**
   * Set the row spacing for the grid panel.
   *
   * #### Notes
   * This is a pure delegate to the [[rowSpacingProperty]].
   */
  set rowSpacing(value: number) {
    GridPanel.rowSpacingProperty.set(this, value);
  }

  /**
   * Get the column spacing for the grid panel.
   *
   * #### Notes
   * This is a pure delegate to the [[columnSpacingProperty]].
   */
  get columnSpacing(): number {
    return GridPanel.columnSpacingProperty.get(this);
  }

  /**
   * Set the column spacing for the grid panel.
   *
   * #### Notes
   * This is a pure delegate to the [[columnSpacingProperty]].
   */
  set columnSpacing(value: number) {
    GridPanel.columnSpacingProperty.set(this, value);
  }

  /**
   * A message handler invoked on a `'child-added'` message.
   */
  protected onChildAdded(msg: ChildMessage): void {
    this.node.appendChild(msg.child.node);
    if (this.isAttached) sendMessage(msg.child, Widget.MsgAfterAttach);
    postMessage(this, Widget.MsgUpdateRequest);
  }

  /**
   * A message handler invoked on a `'child-moved'` message.
   */
  protected onChildMoved(msg: ChildMessage): void { /* no-op */ }

  /**
   * A message handler invoked on a `'child-removed'` message.
   */
  protected onChildRemoved(msg: ChildMessage): void {
    if (this.isAttached) sendMessage(msg.child, Widget.MsgBeforeDetach);
    this.node.removeChild(msg.child.node);
    resetGeometry(msg.child);
  }

  /**
   * A message handler invoked on an `'after-show'` message.
   */
  protected onAfterShow(msg: Message): void {
    super.onAfterShow(msg);
    sendMessage(this, Widget.MsgUpdateRequest);
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    postMessage(this, Panel.MsgLayoutRequest);
  }

  /**
   * A message handler invoked on a `'child-shown'` message.
   */
  protected onChildShown(msg: ChildMessage): void {
    postMessage(this, Widget.MsgUpdateRequest);
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: ResizeMessage): void {
    if (this.isVisible) {
      let width = msg.width < 0 ? this.node.offsetWidth : msg.width;
      let height = msg.height < 0 ? this.node.offsetHeight : msg.height;
      this._layoutChildren(width, height);
    }
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    if (this.isVisible) {
      this._layoutChildren(this.node.offsetWidth, this.node.offsetHeight);
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
   * Setup the size constraints and internal state of the grid panel.
   */
  private _setupGeometry(): void {
    // Initialize the size constraints.
    let minW = 0;
    let minH = 0;
    let maxW = Infinity;
    let maxH = Infinity;

    // Compute the height constraints from the row specs.
    let rowSpecs = this.rowSpecs;
    if (rowSpecs.length > 0) {
      let fixed = this.rowSpacing * (rowSpecs.length - 1);
      minH = rowSpecs.reduce((s, spec) => s + spec.minSize, 0) + fixed;
      maxH = rowSpecs.reduce((s, spec) => s + spec.maxSize, 0) + fixed;
    }

    // Compute the width constraints from the column specs.
    let colSpecs = this.columnSpecs;
    if (colSpecs.length > 0) {
      let fixed = this.columnSpacing * (colSpecs.length - 1);
      minW = colSpecs.reduce((s, spec) => s + spec.minSize, 0) + fixed;
      maxW = colSpecs.reduce((s, spec) => s + spec.maxSize, 0) + fixed;
    }

    // Refresh the cached size limits for the children.
    let children = this.children;
    for (let i = 0, n = children.length; i < n; ++i) {
      let widget = children.get(i);
      setLimits(widget, sizeLimits(widget.node));
    }

    // Create the data arrays for the subsequent layout.
    this._rowStarts = zeros(rowSpecs.length);
    this._colStarts = zeros(colSpecs.length);
    this._rowSizers = rowSpecs.map(makeSizer);
    this._colSizers = colSpecs.map(makeSizer);

    // Update the box sizing and add it to the size constraints.
    this._box = boxSizing(this.node);
    minW += this._box.horizontalSum;
    minH += this._box.verticalSum;
    maxW += this._box.horizontalSum;
    maxH += this._box.verticalSum;

    // Update the panel's size constraints.
    let style = this.node.style;
    style.minWidth = minW + 'px';
    style.minHeight = minH + 'px';
    style.maxWidth = maxW === Infinity ? 'none' : maxW + 'px';
    style.maxHeight = maxH === Infinity ? 'none' : maxH + 'px';

    // Notify the parent that it should relayout.
    if (this.parent) sendMessage(this.parent, Panel.MsgLayoutRequest);

    // Update the layout for the child widgets.
    sendMessage(this, Widget.MsgUpdateRequest);
  }

  /**
   * Layout the children using the given offset width and height.
   */
  private _layoutChildren(offsetWidth: number, offsetHeight: number): void {
    // Bail early if their are no children to arrange.
    let children = this.children;
    if (children.length === 0) {
      return;
    }

    // Ensure the box sizing is created.
    let box = this._box || (this._box = boxSizing(this.node));

    // Compute the actual layout bounds adjusted for border and padding.
    let top = box.paddingTop;
    let left = box.paddingLeft;
    let width = offsetWidth - box.horizontalSum;
    let height = offsetHeight - box.verticalSum;

    // If there are no row or column sizers, just stack the children.
    if (this._rowSizers.length === 0 || this._colSizers.length === 0) {
      for (let i = 0, n = children.length; i < n; ++i) {
        let widget = children.get(i);
        let limits = getLimits(widget);
        let w = Math.max(limits.minWidth, Math.min(width, limits.maxWidth));
        let h = Math.max(limits.minHeight, Math.min(height, limits.maxHeight));
        setGeometry(widget, left, top, w, h);
      }
      return;
    }

    // Compute the row positions.
    let rowPos = top;
    let rowStarts = this._rowStarts;
    let rowSizers = this._rowSizers;
    let rowSpacing = this.rowSpacing;
    boxCalc(rowSizers, height - rowSpacing * (rowSizers.length - 1));
    for (let i = 0, n = rowSizers.length; i < n; ++i) {
      rowStarts[i] = rowPos;
      rowPos += rowSizers[i].size + rowSpacing;
    }

    // Compute the column positions.
    let colPos = left;
    let colStarts = this._colStarts;
    let colSizers = this._colSizers;
    let colSpacing = this.columnSpacing;
    boxCalc(colSizers, width - colSpacing * (colSizers.length - 1));
    for (let i = 0, n = colSizers.length; i < n; ++i) {
      colStarts[i] = colPos;
      colPos += colSizers[i].size + colSpacing;
    }

    // Finally, layout the children.
    let maxRow = rowSizers.length - 1;
    let maxCol = colSizers.length - 1;
    for (let i = 0, n = children.length; i < n; ++i) {
      // Fetch the child widget.
      let widget = children.get(i);

      // Compute the widget top and height.
      let r1 = Math.max(0, Math.min(GridPanel.getRow(widget), maxRow));
      let r2 = Math.min(r1 + GridPanel.getRowSpan(widget) - 1, maxRow);
      let y = rowStarts[r1];
      let h = rowStarts[r2] + rowSizers[r2].size - y;

      // Compute the widget left and width.
      let c1 = Math.max(0, Math.min(GridPanel.getColumn(widget), maxCol));
      let c2 = Math.min(c1 + GridPanel.getColumnSpan(widget) - 1, maxCol);
      let x = colStarts[c1];
      let w = colStarts[c2] + colSizers[c2].size - x;

      // Clamp to the limits and update the offset geometry.
      let limits = getLimits(widget);
      w = Math.max(limits.minWidth, Math.min(w, limits.maxWidth));
      h = Math.max(limits.minHeight, Math.min(h, limits.maxHeight));
      setGeometry(widget, x, y, w, h);
    }
  }

  /**
   * The change handler for the `rowSpecs` property.
   */
  private _onRowSpecsChanged(old: Spec[], specs: Spec[]): void {
    for (let i = 0, n = old.length; i < n; ++i) {
      if (specs.indexOf(old[i]) === -1) {
        old[i].changed.disconnect(this._onRowSpecChanged, this);
      }
    }
    for (let i = 0, n = specs.length; i < n; ++i) {
      if (old.indexOf(specs[i]) === -1) {
        specs[i].changed.connect(this._onRowSpecChanged, this);
      }
    }
    postMessage(this, Panel.MsgLayoutRequest);
  }

  /**
   * The change handler for the `columnSpecs` property.
   */
  private _onColSpecsChanged(old: Spec[], specs: Spec[]): void {
    for (let i = 0, n = old.length; i < n; ++i) {
      if (specs.indexOf(old[i]) === -1) {
        old[i].changed.disconnect(this._onColSpecChanged, this);
      }
    }
    for (let i = 0, n = specs.length; i < n; ++i) {
      if (old.indexOf(specs[i]) === -1) {
        specs[i].changed.connect(this._onColSpecChanged, this);
      }
    }
    postMessage(this, Panel.MsgLayoutRequest);
  }

  /**
   * The change handler for a row spec `changed` signal.
   */
  private _onRowSpecChanged(sender: Spec, args: IChangedArgs<any>): void {
    postMessage(this, Panel.MsgLayoutRequest);
  }

  /**
   * The change handler for a column spec `changed` signal.
   */
  private _onColSpecChanged(sender: Spec, args: IChangedArgs<any>): void {
    postMessage(this, Panel.MsgLayoutRequest);
  }

  private _box: IBoxSizing = null;
  private _rowStarts: number[] = [];
  private _colStarts: number[] = [];
  private _rowSizers: BoxSizer[] = [];
  private _colSizers: BoxSizer[] = [];
}


/**
 * An options object used to initialize a spec.
 */
export
interface ISpecOptions {
  /**
   * The size basis for the spec.
   */
  sizeBasis?: number;

  /**
   * The minimum size for the spec.
   */
  minSize?: number;

  /**
   * The maximum size for the spec.
   */
  maxSize?: number;

  /**
   * The stretch factor for the spec.
   */
  stretch?: number;
}


/**
 * An object used to specify a grid row or column.
 */
export
class Spec {
  /**
   * A signal emitted when the spec state changes.
   *
   * **See also:** [[changed]]
   */
  static changedSignal = new Signal<Spec, IChangedArgs<any>>();

  /**
   * The property descriptor for the size basis.
   *
   * This controls the size allocated to the row or column before the
   * stretch factor, size limits, and surplus/deficit space is taken
   * into account.
   *
   * #### Notes
   * The default value is `0`.
   *
   * **See also:** [[sizeBasis]]
   */
  static sizeBasisProperty = new Property<Spec, number>({
    name: 'sizeBasis',
    value: 0,
    notify: Spec.changedSignal,
  });

  /**
   * The property descriptor for the minimum size.
   *
   * The row or column will never be resized less than this size.
   *
   * #### Notes
   * This value is clamped to a lower bound of `0`.
   *
   * This takes precedence over `maxSize` when in conflict.
   *
   * The default value is `0`.
   *
   * **See also:** [[minSize]]
   */
  static minSizeProperty = new Property<Spec, number>({
    name: 'minSize',
    value: 0,
    coerce: (owner, value) => Math.max(0, value),
    notify: Spec.changedSignal,
  });

  /**
   * The property descriptor for the maximum size.
   *
   * The row or column will never be resized more than this size.
   *
   * #### Notes
   * This value is clamped to a lower bound of `0`.
   *
   * The `minSize` takes precedent when in conflict.
   *
   * The default value is `Infinity`.
   *
   * **See also:** [[maxSize]]
   */
  static maxSizeProperty = new Property<Spec, number>({
    name: 'maxSize',
    value: Infinity,
    coerce: (owner, value) => Math.max(0, value),
    notify: Spec.changedSignal,
  });

  /**
   * The property descriptor for the stretch factor.
   *
   * This controls how much the row or column is resized relative
   * to its siblings if there is surplus or deficit layout space.
   *
   * #### Notes
   * This value is clamped to an integer with a lower bound of `0`.
   *
   * The default value is `1`.
   *
   * **See also:** [[stretch]]
   */
  static stretchProperty = new Property<Spec, number>({
    name: 'stretch',
    value: 1,
    coerce: (owner, value) => Math.max(0, value | 0),
    notify: Spec.changedSignal,
  });

  /**
   * Construct a new spec.
   *
   * @param options - The options for initializing the spec.
   */
  constructor(options: ISpecOptions = {}) {
    if (options.sizeBasis !== void 0) {
      this.sizeBasis = options.sizeBasis;
    }
    if (options.minSize !== void 0) {
      this.minSize = options.minSize;
    }
    if (options.maxSize !== void 0) {
      this.maxSize = options.maxSize;
    }
    if (options.stretch !== void 0) {
      this.stretch = options.stretch;
    }
  }

  /**
   * A signal emitted when the spec state changes.
   *
   * #### Notes
   * This is a pure delegate to the [[changedSignal]].
   */
  get changed(): ISignal<Spec, IChangedArgs<any>> {
    return Spec.changedSignal.bind(this);
  }

  /**
   * Get the size basis for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[sizeBasisProperty]].
   */
  get sizeBasis(): number {
    return Spec.sizeBasisProperty.get(this);
  }

  /**
   * Set the size basis for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[sizeBasisProperty]].
   */
  set sizeBasis(value: number) {
    Spec.sizeBasisProperty.set(this, value);
  }

  /**
   * Get the min size for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[minSizeProperty]].
   */
  get minSize(): number {
    return Spec.minSizeProperty.get(this);
  }

  /**
   * Set the min size for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[minSizeProperty]].
   */
  set minSize(value: number) {
    Spec.minSizeProperty.set(this, value);
  }

  /**
   * Get the max size for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[maxSizeProperty]].
   */
  get maxSize(): number {
    return Spec.maxSizeProperty.get(this);
  }

  /**
   * Set the max size for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[maxSizeProperty]].
   */
  set maxSize(value: number) {
    Spec.maxSizeProperty.set(this, value);
  }

  /**
   * Get the stretch factor for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[stretchProperty]].
   */
  get stretch(): number {
    return Spec.stretchProperty.get(this);
  }

  /**
   * Set the stretch factor for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[stretchProperty]].
   */
  set stretch(value: number) {
    Spec.stretchProperty.set(this, value);
  }
}


/**
 * An object which represents an offset rect.
 */
interface IRect {
  /**
   * The offset top edge, in pixels.
   */
  top: number;

  /**
   * The offset left edge, in pixels.
   */
  left: number;

  /**
   * The offset width, in pixels.
   */
  width: number;

  /**
   * The offset height, in pixels.
   */
  height: number;
}


/**
 * A private attached property which stores a widget offset rect.
 */
const rectProperty = new Property<Widget, IRect>({
  name: 'rect',
  create: createRect,
});


/**
 * A private attached property which stores a widget's size limits.
 */
const limitsProperty = new Property<Widget, ISizeLimits>({
  name: 'limits',
  create: owner => sizeLimits(owner.node),
});


/**
 * Create a new offset rect filled with NaNs.
 */
function createRect(): IRect {
  return { top: NaN, left: NaN, width: NaN, height: NaN };
}


/**
 * Get the offset rect for a widget.
 */
function getRect(widget: Widget): IRect {
  return rectProperty.get(widget);
}


/**
 * Get the cached size limits for a widget.
 */
function getLimits(widget: Widget): ISizeLimits {
  return limitsProperty.get(widget);
}


/**
 * Set the cached size limits for a widget.
 */
function setLimits(widget: Widget, value: ISizeLimits): void {
  return limitsProperty.set(widget, value);
}


/**
 * Set the offset geometry for the given widget.
 *
 * A resize message will be dispatched to the widget if appropriate.
 */
function setGeometry(widget: Widget, left: number, top: number, width: number, height: number): void {
  let resized = false;
  let rect = getRect(widget);
  let style = widget.node.style;
  if (rect.top !== top) {
    rect.top = top;
    style.top = top + 'px';
  }
  if (rect.left !== left) {
    rect.left = left;
    style.left = left + 'px';
  }
  if (rect.width !== width) {
    resized = true;
    rect.width = width;
    style.width = width + 'px';
  }
  if (rect.height !== height) {
    resized = true;
    rect.height = height;
    style.height = height + 'px';
  }
  if (resized) {
    sendMessage(widget, new ResizeMessage(width, height));
  }
}


/**
 * Reset the inline geometry and rect cache for the given widget
 */
function resetGeometry(widget: Widget): void {
  let rect = getRect(widget);
  let style = widget.node.style;
  rect.top = NaN;
  rect.left = NaN;
  rect.width = NaN;
  rect.height = NaN;
  style.top = '';
  style.left = '';
  style.width = '';
  style.height = '';
}


/**
 * The change handler for the attached child properties.
 */
function onChildPropertyChanged(child: Widget): void {
  if (child.parent instanceof GridPanel) {
    postMessage(child.parent, Widget.MsgUpdateRequest);
  }
}


/**
 * Create an array filled with zeros.
 */
function zeros(n: number): number[] {
  let arr = new Array<number>(n);
  for (let i = 0; i < n; ++i) arr[i] = 0;
  return arr;
}


/**
 * Create and initialize a box sizer from a spec.
 */
function makeSizer(spec: Spec): BoxSizer {
  let sizer = new BoxSizer();
  sizer.sizeHint = spec.sizeBasis;
  sizer.minSize = spec.minSize;
  sizer.maxSize = spec.maxSize;
  sizer.stretch = spec.stretch;
  sizer.maxSize = Math.max(sizer.minSize, sizer.maxSize);
  return sizer;
}
