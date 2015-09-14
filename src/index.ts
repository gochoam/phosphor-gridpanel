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
   * The property descriptor for the row specifications.
   *
   * This controls the layout of the rows in the grid panel.
   *
   * #### Notes
   * A frozen shallow copy is maded of the provided array. This means
   * in-place modifications to the row specs are not allowed. The spec
   * objects themselves may be updated in-place, but the array can only
   * be changed wholesale.
   *
   * **See also:** [[rowSpecs]]
   */
  static rowSpecsProperty = new Property<GridPanel, Spec[]>({
    value: Object.freeze([]),
    coerce: (owner, value) => Object.freeze(value.slice()),
    changed: (owner, old, value) => owner._onRowSpecsChanged(old, value),
  });

  /**
   * The property descriptor for the column specifications.
   *
   * This controls the layout of the columns in the grid panel.
   *
   * #### Notes
   * A frozen shallow copy is maded of the provided array. This means
   * in-place modifications to the column specs are not allowed. The
   * spec objects themselves may be updated in-place, but the array
   * can only be changed wholesale.
   *
   * **See also:** [[columnSpecs]]
   */
  static columnSpecsProperty = new Property<GridPanel, Spec[]>({
    value: Object.freeze([]),
    coerce: (owner, value) => Object.freeze(value.slice()),
    changed: (owner, old, value) => owner._onColSpecsChanged(old, value),
  });

  /**
   * The property descriptor for the grid panel row spacing.
   *
   * The controls the fixed row spacing between the child widgets,
   * in pixels. The default value is `8`.
   *
   * **See also:** [[rowSpacing]]
   */
  static rowSpacingProperty = new Property<GridPanel, number>({
    value: 8,
    coerce: (owner, value) => Math.max(0, value | 0),
    changed: owner => postMessage(owner, MSG_LAYOUT_REQUEST),
  });

  /**
   * The property descriptor for the grid panel column spacing.
   *
   * The controls the fixed column spacing between the child widgets,
   * in pixels. The default value is `8`.
   *
   * **See also:** [[columnSpacing]]
   */
  static columnSpacingProperty = new Property<GridPanel, number>({
    value: 8,
    coerce: (owner, value) => Math.max(0, value | 0),
    changed: owner => postMessage(owner, MSG_LAYOUT_REQUEST),
  });

  /**
   * The property descriptor for a widget's origin row.
   *
   * This controls the row index of the widget's origin.
   *
   * #### Notes
   * This value is an integer clamped to a lower bound of `0`.
   *
   * The default value is `0`.
   *
   * **See also:** [[getRow]], [[setRow]]
   */
  static rowProperty = new Property<Widget, number>({
    value: 0,
    coerce: (owner, value) => Math.max(0, value | 0),
  });

  /**
   * The property descriptor for a widget's origin column.
   *
   * This controls the column index of the widget's origin.
   *
   * #### Notes
   * This value is an integer clamped to a lower bound of `0`.
   *
   * The default value is `0`.
   *
   * **See also:** [[getColumn]], [[setColumn]]
   */
  static columnProperty = new Property<Widget, number>({
    value: 0,
    coerce: (owner, value) => Math.max(0, value | 0),
  });

  /**
   * The property descriptor for a widget's row span.
   *
   * This controls the number of rows spanned by the widget.
   *
   * #### Notes
   * This value is an integer clamped to a lower bound of `1`.
   *
   * The default value is `1`.
   *
   * **See also:** [[getRowSpan]], [[setRowSpan]]
   */
  static rowSpanProperty = new Property<Widget, number>({
    value: 1,
    coerce: (owner, value) => Math.max(1, value | 0),
  });

  /**
   * The property descriptor for a widget's column span.
   *
   * This controls the number of columns spanned by the widget.
   *
   * #### Notes
   * This value is an integer clamped to a lower bound of `1`.
   *
   * The default value is `1`.
   *
   * **See also:** [[getColumnSpan]], [[setColumnSpan]]
   */
  static columnSpanProperty = new Property<Widget, number>({
    value: 1,
    coerce: (owner, value) => Math.max(1, value | 0),
  });

  /**
   * Get the origin row index for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @returns The row index of the widget origin.
   *
   * #### Notes
   * This is a pure delegate to the [[rowProperty]].
   */
  static getRow(widget: Widget): number {
    return GridPanel.rowProperty.get(widget);
  }

  /**
   * Set the origin row index for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @param value - The value for the origin row index.
   *
   * #### Notes
   * This is a pure delegate to the [[rowProperty]].
   */
  static setRow(widget: Widget, value: number): void {
    GridPanel.rowProperty.set(widget, value);
  }

  /**
   * Get the origin column index for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @returns The column index of the widget origin.
   *
   * #### Notes
   * This is a pure delegate to the [[columnProperty]].
   */
  static getColumn(widget: Widget): number {
    return GridPanel.columnProperty.get(widget);
  }

  /**
   * Set the origin column index for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @param value - The value for the origin column index.
   *
   * #### Notes
   * This is a pure delegate to the [[columnProperty]].
   */
  static setColumn(widget: Widget, value: number): void {
    GridPanel.columnProperty.set(widget, value);
  }

  /**
   * Get the row span for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @returns The row span of the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[rowSpanProperty]].
   */
  static getRowSpan(widget: Widget): number {
    return GridPanel.rowSpanProperty.get(widget);
  }

  /**
   * Set the row span for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @param value - The row span for the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[rowSpanProperty]].
   */
  static setRowSpan(widget: Widget, value: number): void {
    GridPanel.rowSpanProperty.set(widget, value);
  }

  /**
   * Get the column span for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @returns The column span of the widget.
   *
   * #### Notes
   * This is a pure delegate to the [[columnSpanProperty]].
   */
  static getColumnSpan(widget: Widget): number {
    return GridPanel.columnSpanProperty.get(widget);
  }

  /**
   * Set the column span for the given widget.
   *
   * @param widget - The widget of interest.
   *
   * @param value - The column span for the widget.
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
    Property.getChanged(msg.child).connect(this._onPropertyChanged, this);
    this.node.appendChild(msg.child.node);
    if (this.isAttached) sendMessage(msg.child, MSG_AFTER_ATTACH);
    this.update();
  }

  /**
   * A message handler invoked on a `'child-removed'` message.
   */
  protected onChildRemoved(msg: ChildMessage): void {
    Property.getChanged(msg.child).disconnect(this._onPropertyChanged, this);
    if (this.isAttached) sendMessage(msg.child, MSG_BEFORE_DETACH);
    this.node.removeChild(msg.child.node);
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
    this.update();
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
   * The change handler for the [[rowSpecsProperty]].
   */
  private _onRowSpecsChanged(old: Spec[], value: Spec[]): void {
    // TODO (un)subscribe specs
    postMessage(this, MSG_LAYOUT_REQUEST);
  }

  /**
   * The change handler for the [[columnSpecsProperty]].
   */
  private _onColSpecsChanged(old: Spec[], value: Spec[]): void {
    // TODO (un)subscribe specs
    postMessage(this, MSG_LAYOUT_REQUEST);
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
      this.update();
    }
  }

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
   * The property descriptor for the size basis.
   *
   * This controls the size allocated to the row or column before the
   * stretch factor, size limits, or surplus/deficit space is taken
   * into account.
   *
   * #### Notes
   * The default value is `0`.
   *
   * **See also:** [[sizeBasis]]
   */
  static sizeBasisProperty = new Property<Spec, number>({
    value: 0,
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
    value: 0,
    coerce: (owner, value) => Math.max(0, value),
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
    value: 0,
    coerce: (owner, value) => Math.max(0, value),
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
    value: 1,
    coerce: (owner, value) => Math.max(0, value | 0),
  });

  /**
   * Construct a new spec.
   *
   * @param options - The options object for initializing the spec.
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
   * Get the stretch factory for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[stretchProperty]].
   */
  get stretch(): number {
    return Spec.stretchProperty.get(this);
  }

  /**
   * Set the stretch factory for the spec.
   *
   * #### Notes
   * This is a pure delegate to the [[stretchProperty]].
   */
  set stretch(value: number) {
    Spec.stretchProperty.set(this, value);
  }
}
