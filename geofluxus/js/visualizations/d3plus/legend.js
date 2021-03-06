function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
    @external BaseClass
    @see https://github.com/d3plus/d3plus-common#BaseClass
*/
import { max, sum } from "d3-array";
import { select as _select } from "d3-selection";
import { accessor, assign, BaseClass, configPrep, constant, elem } from "d3plus-common";
import * as shapes from "d3plus-shape";
import { TextBox, textWidth, textWrap } from "d3plus-text";
/**
    @class Legend
    @extends external:BaseClass
    @desc Creates an SVG scale based on an array of data. If *data* is specified, immediately draws based on the specified array and returns the current class instance. If *data* is not specified on instantiation, it can be passed/updated after instantiation using the [data](#shape.data) method.
*/

var Legend = /*#__PURE__*/function (_BaseClass) {
  _inherits(Legend, _BaseClass);

  var _super = _createSuper(Legend);

  /**
      @memberof Legend
      @desc Invoked when creating a new class instance, and sets any default parameters.
      @private
  */
  function Legend() {
    var _this;

    _classCallCheck(this, Legend);

    _this = _super.call(this);
    _this._align = "center";
    _this._data = [];
    _this._direction = "row";
    _this._duration = 600;
    _this._height = 200;
    _this._id = accessor("id");
    _this._label = accessor("id");
    _this._lineData = [];
    _this._outerBounds = {
      width: 0,
      height: 0,
      x: 0,
      y: 0
    };
    _this._padding = 5;
    _this._shape = constant("Rect");
    _this._shapes = [];
    _this._shapeConfig = {
      fill: accessor("color"),
      height: constant(10),
      hitArea: function hitArea(dd, i) {
        var d = _this._lineData[i],
            h = max([d.height, d.shapeHeight]);
        return {
          width: d.width + d.shapeWidth,
          height: h,
          x: -d.shapeWidth / 2,
          y: -h / 2
        };
      },
      labelBounds: function labelBounds(dd, i) {
        var d = _this._lineData[i];
        var x = d.shapeWidth;
        if (d.shape === "Circle") x -= d.shapeR;
        var height = max([d.shapeHeight, d.height]);
        return {
          width: d.width,
          height: height,
          x: x,
          y: -height / 2
        };
      },
      labelConfig: {
        fontColor: constant("#444"),
        fontFamily: new TextBox().fontFamily(),
        fontResize: false,
        fontSize: constant(10),
        verticalAlign: "middle"
      },
      opacity: 1,
      r: constant(5),
      width: constant(10),
      x: function x(d, i) {
        var datum = _this._lineData[i];
        var y = datum.y;
        var pad = _this._align === "left" || _this._align === "right" && _this._direction === "column" ? 0 : _this._align === "center" ? (_this._outerBounds.width - _this._rowWidth(_this._lineData.filter(function (l) {
          return y === l.y;
        }))) / 2 : _this._outerBounds.width - _this._rowWidth(_this._lineData.filter(function (l) {
          return y === l.y;
        }));

        var prevWords = _this._lineData.slice(0, i).filter(function (l) {
          return y === l.y;
        });

        return _this._rowWidth(prevWords) + _this._padding * (prevWords.length ? datum.sentence ? 2 : 1 : 0) + _this._outerBounds.x + datum.shapeWidth / 2 + pad;
      },
      y: function y(d, i) {
        var ld = _this._lineData[i];
        return ld.y + _this._titleHeight + _this._outerBounds.y + max(_this._lineData.filter(function (l) {
          return ld.y === l.y;
        }).map(function (l) {
          return l.height;
        }).concat(_this._data.map(function (l, x) {
          return _this._fetchConfig("height", l, x);
        }))) / 2;
      }
    };
    _this._titleClass = new TextBox();
    _this._titleConfig = {};
    _this._verticalAlign = "middle";
    _this._width = 400;
    return _this;
  }

  _createClass(Legend, [{
    key: "_fetchConfig",
    value: function _fetchConfig(key, d, i) {
      var val = this._shapeConfig[key] !== undefined ? this._shapeConfig[key] : this._shapeConfig.labelConfig[key];
      if (!val && key === "lineHeight") return this._fetchConfig("fontSize", d, i) * 1.4;
      return typeof val === "function" ? val(d, i) : val;
    }
  }, {
    key: "_rowHeight",
    value: function _rowHeight(row) {
      return max(row.map(function (d) {
        return d.height;
      }).concat(row.map(function (d) {
        return d.shapeHeight;
      }))) + this._padding;
    }
  }, {
    key: "_rowWidth",
    value: function _rowWidth(row) {
      var _this2 = this;

      return sum(row.map(function (d, i) {
        var p = _this2._padding * (i === row.length - 1 ? 0 : d.width ? 2 : 1);
        return d.shapeWidth + d.width + p;
      }));
    }
    /**
        @memberof Legend
        @desc Renders the current Legend to the page. If a *callback* is specified, it will be called once the legend is done drawing.
        @param {Function} [*callback* = undefined]
        @chainable
    */

  }, {
    key: "render",
    value: function render(callback) {
      var _this3 = this;

      if (this._select === void 0) this.select(_select("body").append("svg").attr("width", "".concat(this._width, "px")).attr("height", "".concat(this._height, "px")).node()); // Legend Container <g> Groups

      this._group = elem("g.d3plus-Legend", {
        parent: this._select
      });
      this._titleGroup = elem("g.d3plus-Legend-title", {
        parent: this._group
      });
      this._shapeGroup = elem("g.d3plus-Legend-shape", {
        parent: this._group
      });
      var availableHeight = this._height;
      this._titleHeight = 0;
      this._titleWidth = 0;

      if (this._title) {
        var f = this._titleConfig.fontFamily || this._titleClass.fontFamily()(),
            s = this._titleConfig.fontSize || this._titleClass.fontSize()();

        var lH = lH = this._titleConfig.lineHeight || this._titleClass.lineHeight();

        lH = lH ? lH() : s * 1.4;
        var res = textWrap().fontFamily(f).fontSize(s).lineHeight(lH).width(this._width).height(this._height)(this._title);
        this._titleHeight = lH + res.lines.length + this._padding;
        this._titleWidth = max(res.widths);
        availableHeight -= this._titleHeight;
      } // Calculate Text Sizes


      this._lineData = this._data.map(function (d, i) {
        var label = _this3._label(d, i);

        var shape = _this3._shape(d, i);

        var r = _this3._fetchConfig("r", d, i);

        var res = {
          data: d,
          i: i,
          id: _this3._id(d, i),
          shape: shape,
          shapeR: r,
          shapeWidth: shape === "Circle" ? r * 2 : _this3._fetchConfig("width", d, i),
          shapeHeight: shape === "Circle" ? r * 2 : _this3._fetchConfig("height", d, i),
          y: 0
        };

        if (!label) {
          res.sentence = false;
          res.words = [];
          res.height = 0;
          res.width = 0;
          return res;
        }

        var f = _this3._fetchConfig("fontFamily", d, i),
            lh = _this3._fetchConfig("lineHeight", d, i),
            s = _this3._fetchConfig("fontSize", d, i);

        var h = availableHeight - (_this3._data.length + 1) * _this3._padding,
            w = _this3._width;
        res = Object.assign(res, textWrap().fontFamily(f).fontSize(s).lineHeight(lh).width(w).height(h)(label));
        res.width = Math.ceil(max(res.lines.map(function (t) {
          return textWidth(t, {
            "font-family": f,
            "font-size": s
          });
        }))) + s * 0.75;
        res.height = Math.ceil(res.lines.length * (lh + 1));
        res.og = {
          height: res.height,
          width: res.width
        };
        res.f = f;
        res.s = s;
        res.lh = lh;
        return res;
      });
      var spaceNeeded;
      var availableWidth = this._width - this._padding * 2;
      spaceNeeded = this._rowWidth(this._lineData);

      if (this._direction === "column" || spaceNeeded > availableWidth) {
        var lines = 1,
            newRows = [];
        var maxLines = max(this._lineData.map(function (d) {
          return d.words.length;
        }));

        this._wrapLines = function () {
          var _this4 = this;

          lines++;
          if (lines > maxLines) return;
          var wrappable = lines === 1 ? this._lineData.slice() : this._lineData.filter(function (d) {
            return d.width + d.shapeWidth + _this4._padding * (d.width ? 2 : 1) > availableWidth && d.words.length >= lines;
          }).sort(function (a, b) {
            return b.sentence.length - a.sentence.length;
          });

          if (wrappable.length && availableHeight > wrappable[0].height * lines) {
            var truncated = false;

            var _loop = function _loop(x) {
              var label = wrappable[x];
              var h = label.og.height * lines,
                  w = label.og.width * (1.5 * (1 / lines));
              var res = textWrap().fontFamily(label.f).fontSize(label.s).lineHeight(label.lh).width(w).height(h)(label.sentence);

              if (!res.truncated) {
                label.width = Math.ceil(max(res.lines.map(function (t) {
                  return textWidth(t, {
                    "font-family": label.f,
                    "font-size": label.s
                  });
                }))) + label.s;
                label.height = res.lines.length * (label.lh + 1);
              } else {
                truncated = true;
                return "break";
              }
            };

            for (var x = 0; x < wrappable.length; x++) {
              var _ret = _loop(x);

              if (_ret === "break") break;
            }

            if (!truncated) this._wrapRows();
          } else {
            newRows = [];
            return;
          }
        };

        this._wrapRows = function () {
          newRows = [];
          var row = 1,
              rowWidth = 0;

          for (var i = 0; i < this._lineData.length; i++) {
            var d = this._lineData[i],
                w = d.width + this._padding * (d.width ? 2 : 1) + d.shapeWidth;

            if (sum(newRows.map(function (row) {
              return max(row, function (d) {
                return max([d.height, d.shapeHeight]);
              });
            })) > availableHeight) {
              newRows = [];
              break;
            }

            if (w > availableWidth) {
              newRows = [];

              this._wrapLines();

              break;
            } else if (rowWidth + w < availableWidth) {
              rowWidth += w;
            } else if (this._direction !== "column") {
              rowWidth = w;
              row++;
            }

            if (!newRows[row - 1]) newRows[row - 1] = [];
            newRows[row - 1].push(d);

            if (this._direction === "column") {
              rowWidth = 0;
              row++;
            }
          }
        };

        this._wrapRows();

        if (!newRows.length || sum(newRows, this._rowHeight.bind(this)) + this._padding > availableHeight) {
          spaceNeeded = sum(this._lineData.map(function (d) {
            return d.shapeWidth + _this3._padding;
          })) - this._padding;

          for (var i = 0; i < this._lineData.length; i++) {
            this._lineData[i].width = 0;
            this._lineData[i].height = 0;
          }

          this._wrapRows();
        }

        if (newRows.length && sum(newRows, this._rowHeight.bind(this)) + this._padding < availableHeight) {
          newRows.forEach(function (row, i) {
            row.forEach(function (d) {
              if (i) {
                d.y = sum(newRows.slice(0, i), _this3._rowHeight.bind(_this3));
              }
            });
          });
          spaceNeeded = max(newRows, this._rowWidth.bind(this));
        }
      }

      var innerHeight = max(this._lineData, function (d, i) {
        return max([d.height, _this3._fetchConfig("height", d.data, i)]) + d.y;
      }) + this._titleHeight,
          innerWidth = max([spaceNeeded, this._titleWidth]);

      this._outerBounds.width = innerWidth;
      this._outerBounds.height = innerHeight;
      var xOffset = this._padding,
          yOffset = this._padding;
      if (this._align === "center") xOffset = (this._width - innerWidth) / 2;else if (this._align === "right") xOffset = this._width - this._padding - innerWidth;
      if (this._verticalAlign === "middle") yOffset = (this._height - innerHeight) / 2;else if (this._verticalAlign === "bottom") yOffset = this._height - this._padding - innerHeight;
      this._outerBounds.x = xOffset;
      this._outerBounds.y = yOffset;

      this._titleClass.data(this._title ? [{
        text: this._title
      }] : []).duration(this._duration).select(this._titleGroup.node()).textAnchor({
        left: "start",
        center: "middle",
        right: "end"
      }[this._align]).width(this._width - this._padding * 2).x(this._padding).y(this._outerBounds.y).config(this._titleConfig).render();

      this._shapes = [];
      var baseConfig = configPrep.bind(this)(this._shapeConfig, "legend"),
          config = {
        id: function id(d) {
          return d.id;
        },
        label: function label(d) {
          return d.label;
        },
        lineHeight: function lineHeight(d) {
          return d.lH;
        }
      };

      var data = this._data.map(function (d, i) {
        var obj = {
          __d3plus__: true,
          data: d,
          i: i,
          id: _this3._id(d, i),
          label: _this3._lineData[i].width ? _this3._label(d, i) : false,
          lH: _this3._fetchConfig("lineHeight", d, i),
          shape: _this3._shape(d, i)
        };
        return obj;
      }); // Legend Shapes


       this._shapes = [];
       var _this = this;
    ["Circle", "Rect"].forEach(Shape => {

      _this._shapes.push(
        new shapes[Shape]()
          .data(data.filter(d => d.shape === Shape))
          .duration(this._duration)
          .labelConfig({padding: 0})
          .select(this._shapeGroup.node())
          .verticalAlign("top")
          .config(assign({}, baseConfig, config))
          .render()
      );

    });
      if (callback) setTimeout(callback, this._duration + 100);
      return this;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the active method for all shapes to the specified function and returns the current class instance. If *value* is not specified, returns the current active method.
        @param {Function} [*value*]
        @chainable
    */

  }, {
    key: "active",
    value: function active(_) {
      this._shapes.forEach(function (s) {
        return s.active(_);
      });

      return this;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the horizontal alignment to the specified value and returns the current class instance. If *value* is not specified, returns the current horizontal alignment.
        @param {String} [*value* = "center"] Supports `"left"` and `"center"` and `"right"`.
        @chainable
    */

  }, {
    key: "align",
    value: function align(_) {
      return arguments.length ? (this._align = _, this) : this._align;
    }
    /**
        @memberof Legend
        @desc If *data* is specified, sets the data array to the specified array and returns the current class instance. If *data* is not specified, returns the current data array. A shape key will be drawn for each object in the array.
        @param {Array} [*data* = []]
        @chainable
    */

  }, {
    key: "data",
    value: function data(_) {
      return arguments.length ? (this._data = _, this) : this._data;
    }
    /**
        @memberof Legend
        @desc Sets the flow of the items inside the legend. If no value is passed, the current flow will be returned.
        @param {String} [*value* = "row"]
        @chainable
    */

  }, {
    key: "direction",
    value: function direction(_) {
      return arguments.length ? (this._direction = _, this) : this._direction;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the transition duration of the legend and returns the current class instance. If *value* is not specified, returns the current duration.
        @param {Number} [*value* = 600]
        @chainable
    */

  }, {
    key: "duration",
    value: function duration(_) {
      return arguments.length ? (this._duration = _, this) : this._duration;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the overall height of the legend and returns the current class instance. If *value* is not specified, returns the current height value.
        @param {Number} [*value* = 100]
        @chainable
    */

  }, {
    key: "height",
    value: function height(_) {
      return arguments.length ? (this._height = _, this) : this._height;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the hover method for all shapes to the specified function and returns the current class instance. If *value* is not specified, returns the current hover method.
        @param {Function} [*value*]
        @chainable
    */

  }, {
    key: "hover",
    value: function hover(_) {
      this._shapes.forEach(function (s) {
        return s.hover(_);
      });

      return this;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the id accessor to the specified function and returns the current class instance. If *value* is not specified, returns the current id accessor.
        @param {Function} [*value*]
        @chainable
        @example
    function value(d) {
    return d.id;
    }
    */

  }, {
    key: "id",
    value: function id(_) {
      return arguments.length ? (this._id = _, this) : this._id;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the label accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current label accessor, which is the [id](#shape.id) accessor by default.
        @param {Function|String} [*value*]
        @chainable
    */

  }, {
    key: "label",
    value: function label(_) {
      return arguments.length ? (this._label = typeof _ === "function" ? _ : constant(_), this) : this._label;
    }
    /**
        @memberof Legend
        @desc If called after the elements have been drawn to DOM, will returns the outer bounds of the legend content.
        @example
    {"width": 180, "height": 24, "x": 10, "y": 20}
    */

  }, {
    key: "outerBounds",
    value: function outerBounds() {
      return this._outerBounds;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the padding between each key to the specified number and returns the current class instance. If *value* is not specified, returns the current padding value.
        @param {Number} [*value* = 10]
        @chainable
    */

  }, {
    key: "padding",
    value: function padding(_) {
      return arguments.length ? (this._padding = _, this) : this._padding;
    }
    /**
        @memberof Legend
        @desc If *selector* is specified, sets the SVG container element to the specified d3 selector or DOM element and returns the current class instance. If *selector* is not specified, returns the current SVG container element.
        @param {String|HTMLElement} [*selector* = d3.select("body").append("svg")]
        @chainable
    */

  }, {
    key: "select",
    value: function select(_) {
      return arguments.length ? (this._select = _select(_), this) : this._select;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the shape accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current shape accessor.
        @param {Function|String} [*value* = "Rect"]
        @chainable
    */

  }, {
    key: "shape",
    value: function shape(_) {
      return arguments.length ? (this._shape = typeof _ === "function" ? _ : constant(_), this) : this._shape;
    }
    /**
        @memberof Legend
        @desc If *config* is specified, sets the methods that correspond to the key/value pairs for each shape and returns the current class instance. If *config* is not specified, returns the current shape configuration.
        @param {Object} [*config* = {}]
        @chainable
    */

  }, {
    key: "shapeConfig",
    value: function shapeConfig(_) {
      return arguments.length ? (this._shapeConfig = assign(this._shapeConfig, _), this) : this._shapeConfig;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the title of the legend and returns the current class instance. If *value* is not specified, returns the current title.
        @param {String} [*value*]
        @chainable
    */

  }, {
    key: "title",
    value: function title(_) {
      return arguments.length ? (this._title = _, this) : this._title;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the title configuration of the legend and returns the current class instance. If *value* is not specified, returns the current title configuration.
        @param {Object} [*value*]
        @chainable
    */

  }, {
    key: "titleConfig",
    value: function titleConfig(_) {
      return arguments.length ? (this._titleConfig = assign(this._titleConfig, _), this) : this._titleConfig;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the vertical alignment to the specified value and returns the current class instance. If *value* is not specified, returns the current vertical alignment.
        @param {String} [*value* = "middle"] Supports `"top"` and `"middle"` and `"bottom"`.
        @chainable
    */

  }, {
    key: "verticalAlign",
    value: function verticalAlign(_) {
      return arguments.length ? (this._verticalAlign = _, this) : this._verticalAlign;
    }
    /**
        @memberof Legend
        @desc If *value* is specified, sets the overall width of the legend and returns the current class instance. If *value* is not specified, returns the current width value.
        @param {Number} [*value* = 400]
        @chainable
    */

  }, {
    key: "width",
    value: function width(_) {
      return arguments.length ? (this._width = _, this) : this._width;
    }
  }]);

  return Legend;
}(BaseClass);

export { Legend };