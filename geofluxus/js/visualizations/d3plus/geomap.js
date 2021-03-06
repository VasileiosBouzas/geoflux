function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/**
    @external Viz
    @see https://github.com/d3plus/d3plus-viz#Viz
*/
import {
  extent,
  max,
  quantile
} from "d3-array";
import {
  color
} from "d3-color";
import * as d3GeoCore from "d3-geo";
import * as d3GeoProjection from "d3-geo-projection";
var d3Geo = Object.assign({}, d3GeoCore, d3GeoProjection);
import * as scales from "d3-scale";
import {
  tile
} from "visualizations/d3plus/tile";
import {
  feature
} from "topojson-client";
import {
  accessor,
  assign,
  configPrep,
  constant,
  parseSides
} from "d3plus-common";
import {
  Circle,
  Path,
  pointDistance
} from "d3plus-shape";
import {
  dataLoad as load,
  Viz
} from "d3plus-viz";
/**
    @name topo2feature
    @desc Converts a specific topojson object key into a feature ready for projection.
    @param {Object} *topo* A valid topojson json object.
    @param {String} [*key*] The topojson object key to be used. If undefined, the first key available will be used.
    @private
*/

function topo2feature(topo, key) {
  var k = key && topo.objects[key] ? key : Object.keys(topo.objects)[0];
  return feature(topo, topo.objects[k]);
}
/**
    @class Geomap
    @extends external:Viz
    @desc Creates a geographical map with zooming, panning, image tiles, and the ability to layer choropleth paths and coordinate points. See [this example](https://d3plus.org/examples/d3plus-geomap/getting-started/) for help getting started.
*/


var Geomap =
  /*#__PURE__*/
  function (_Viz) {
    _inherits(Geomap, _Viz);

    /**
        @memberof Geomap
        @desc Invoked when creating a new class instance, and sets any default parameters.
        @private
    */
    function Geomap() {
      var _this;

      _classCallCheck(this, Geomap);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Geomap).call(this));
      _this._fitObject = false;
      _this._noDataMessage = false;
      _this._ocean = "#d4dadc";
      _this._point = accessor("point");
      _this._pointSize = constant(1);
      _this._pointSizeMax = 10;
      _this._pointSizeMin = 5;
      _this._pointSizeScale = "linear";
      _this._projection = d3Geo.geoMercator();
      _this._projectionPadding = parseSides(20);
      _this._shape = constant("Circle");
      _this._shapeConfig = assign(_this._shapeConfig, {
        ariaLabel: function ariaLabel(d, i) {
          return "".concat(_this._drawLabel(d, i), ", ").concat(_this._pointSize(d, i));
        },
        hoverOpacity: 1,
        Path: {
          ariaLabel: function ariaLabel(d, i) {
            var validColorScale = _this._colorScale ? ", ".concat(_this._colorScale(d, i)) : "";
            return "".concat(_this._drawLabel(d, i)).concat(validColorScale, ".");
          },
          fill: function fill(d, i) {
            if (_this._colorScale && !_this._coordData.features.includes(d)) {
              var c = _this._colorScale(d);

              if (c !== undefined && c !== null) {
                if (_this._colorScaleClass._colorScale) {
                  return _this._colorScaleClass._colorScale(c);
                } else {
                  var _color = _this._colorScaleClass.color();

                  if (_color instanceof Array) _color = _color[_color.length - 1];
                  return _color;
                }
              }
            }

            return _this._topojsonFill(d, i);
          },
          on: {
            "mouseenter": function mouseenter(d) {
              return !_this._coordData.features.includes(d) ? _this._on.mouseenter.bind(_assertThisInitialized(_this))(d) : null;
            },
            "mousemove.shape": function mousemoveShape(d) {
              return !_this._coordData.features.includes(d) ? _this._on["mousemove.shape"].bind(_assertThisInitialized(_this))(d) : null;
            },
            "mouseleave": function mouseleave(d) {
              return !_this._coordData.features.includes(d) ? _this._on.mouseleave.bind(_assertThisInitialized(_this))(d) : null;
            }
          },
          stroke: function stroke(d, i) {
            var c = typeof _this._shapeConfig.Path.fill === "function" ? _this._shapeConfig.Path.fill(d, i) : _this._shapeConfig.Path.fill;
            return color(c).darker();
          },
          strokeWidth: 1
        }
      });
      _this._tiles = true;
      _this._tileGen = tile().wrap(false);
      _this._tileUrl = "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png";
      _this._topojson = false;
      _this._topojsonFill = constant("#f5f5f3");

      _this._topojsonFilter = function (d) {
        return !["010"].includes(d.id);
      };

      _this._topojsonId = accessor("id");
      _this._zoom = true;
      _this._zoomSet = false;
      return _this;
    }
    /**
        Renders map tiles based on the current zoom level.
        @private
    */


    _createClass(Geomap, [{
      key: "_renderTiles",
      value: function _renderTiles(transform) {
        var _this2 = this;

        var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var tileData = [];

        if (this._tiles) {
          tileData = this._tileGen.extent(this._zoomBehavior.translateExtent()).scale(this._projection.scale() * (2 * Math.PI) * transform.k).translate(transform.apply(this._projection.translate()))();

          this._tileGroup.transition().duration(duration).attr("transform", transform);
        }

        var images = this._tileGroup.selectAll("image.d3plus-geomap-tile").data(tileData, function (d) {
          return "".concat(d.x, "-").concat(d.y, "-").concat(d.z);
        });

        images.exit().transition().duration(duration).attr("opacity", 0).remove();
        var scale = tileData.scale / transform.k;
        images.enter().append("image").attr("class", "d3plus-geomap-tile").attr("opacity", 0).attr("xlink:href", function (d) {
          return _this2._tileUrl.replace("{s}", ["a", "b", "c"][Math.random() * 3 | 0]).replace("{z}", d.z).replace("{x}", d.x).replace("{y}", d.y);
        }).attr("width", scale).attr("height", scale).attr("x", function (d) {
          return d.x * scale + tileData.translate[0] * scale - transform.x / transform.k;
        }).attr("y", function (d) {
          return d.y * scale + tileData.translate[1] * scale - transform.y / transform.k;
        }).transition().duration(duration).attr("opacity", 1);
        images.attr("width", scale).attr("height", scale).attr("x", function (d) {
          return d.x * scale + tileData.translate[0] * scale - transform.x / transform.k;
        }).attr("y", function (d) {
          return d.y * scale + tileData.translate[1] * scale - transform.y / transform.k;
        });
      }
      /**
          Extends the draw behavior of the abstract Viz class.
          @private
      */

    }, {
      key: "_draw",
      value: function _draw(callback) {
        var _this3 = this;

        _get(_getPrototypeOf(Geomap.prototype), "_draw", this).call(this, callback);

        var height = this._height - this._margin.top - this._margin.bottom,
          width = this._width - this._margin.left - this._margin.right;
        this._container = this._select.selectAll("svg.d3plus-geomap").data([0]);
        this._container = this._container.enter().append("svg").attr("class", "d3plus-geomap").attr("opacity", 0).attr("width", width).attr("height", height).attr("x", this._margin.left).attr("y", this._margin.top).style("background-color", this._ocean || "transparent").merge(this._container);

        this._container.transition(this._transition).attr("opacity", 1).attr("width", width).attr("height", height).attr("x", this._margin.left).attr("y", this._margin.top);

        var ocean = this._container.selectAll("rect.d3plus-geomap-ocean").data([0]);

        ocean.enter().append("rect").attr("class", "d3plus-geomap-ocean").merge(ocean).attr("width", width).attr("height", height).attr("fill", this._ocean || "transparent");
        this._tileGroup = this._container.selectAll("g.d3plus-geomap-tileGroup").data([0]);
        this._tileGroup = this._tileGroup.enter().append("g").attr("class", "d3plus-geomap-tileGroup").merge(this._tileGroup);
        this._zoomGroup = this._container.selectAll("g.d3plus-geomap-zoomGroup").data([0]);
        this._zoomGroup = this._zoomGroup.enter().append("g").attr("class", "d3plus-geomap-zoomGroup").merge(this._zoomGroup);

        var pathGroup = this._zoomGroup.selectAll("g.d3plus-geomap-paths").data([0]);

        pathGroup = pathGroup.enter().append("g").attr("class", "d3plus-geomap-paths").merge(pathGroup);
        var coordData = this._coordData = this._topojson ? this._topojson : {
          type: "FeatureCollection",
          features: []
        };
        if (this._topojsonFilter) coordData.features = coordData.features.filter(this._topojsonFilter);
        var path = this._path = d3Geo.geoPath().projection(this._projection);

        var pointData = this._filteredData.filter(function (d, i) {
          return _this3._point(d, i) instanceof Array;
        });

        var pathData = this._filteredData.filter(function (d, i) {
          return !(_this3._point(d, i) instanceof Array);
        }).reduce(function (obj, d) {
          obj[_this3._id(d)] = d;
          return obj;
        }, {});

        var topoData = coordData.features.reduce(function (arr, feature) {
          var id = _this3._topojsonId(feature);

          arr.push({
            __d3plus__: true,
            data: pathData[id],
            feature: feature,
            id: id
          });
          return arr;
        }, []);
        var r = scales["scale".concat(this._pointSizeScale.charAt(0).toUpperCase()).concat(this._pointSizeScale.slice(1))]().domain(extent(pointData, function (d, i) {
          return _this3._pointSize(d, i);
        })).range([this._pointSizeMin, this._pointSizeMax]);

        if (!this._zoomSet) {
          var fitData = this._fitObject ? topo2feature(this._fitObject, this._fitKey) : coordData;
          this._extentBounds = {
            type: "FeatureCollection",
            features: this._fitFilter ? fitData.features.filter(this._fitFilter) : fitData.features.slice()
          };
          this._extentBounds.features = this._extentBounds.features.reduce(function (arr, d) {
            if (d.geometry) {
              var reduced = {
                type: d.type,
                id: d.id,
                geometry: {
                  coordinates: d.geometry.coordinates,
                  type: d.geometry.type
                }
              };

              if (d.geometry.type === "MultiPolygon" && d.geometry.coordinates.length > 1) {
                var areas = [],
                  distances = [];
                d.geometry.coordinates.forEach(function (c) {
                  reduced.geometry.coordinates = [c];
                  areas.push(path.area(reduced));
                });
                reduced.geometry.coordinates = [d.geometry.coordinates[areas.indexOf(max(areas))]];
                var center = path.centroid(reduced);
                d.geometry.coordinates.forEach(function (c) {
                  reduced.geometry.coordinates = [c];
                  distances.push(pointDistance(path.centroid(reduced), center));
                });
                var distCutoff = quantile(areas.reduce(function (arr, dist, i) {
                  if (dist) arr.push(areas[i] / dist);
                  return arr;
                }, []), 0.9);
                reduced.geometry.coordinates = d.geometry.coordinates.filter(function (c, i) {
                  var dist = distances[i];
                  return dist === 0 || areas[i] / dist >= distCutoff;
                });
              }

              arr.push(reduced);
            }

            return arr;
          }, []);

          if (!this._extentBounds.features.length && pointData.length) {
            var bounds = [
              [undefined, undefined],
              [undefined, undefined]
            ];
            pointData.forEach(function (d, i) {
              var point = _this3._projection(_this3._point(d, i));

              if (bounds[0][0] === void 0 || point[0] < bounds[0][0]) bounds[0][0] = point[0];
              if (bounds[1][0] === void 0 || point[0] > bounds[1][0]) bounds[1][0] = point[0];
              if (bounds[0][1] === void 0 || point[1] < bounds[0][1]) bounds[0][1] = point[1];
              if (bounds[1][1] === void 0 || point[1] > bounds[1][1]) bounds[1][1] = point[1];
            });
            this._extentBounds = {
              type: "FeatureCollection",
              features: [{
                type: "Feature",
                geometry: {
                  type: "MultiPoint",
                  coordinates: bounds.map(function (b) {
                    return _this3._projection.invert(b);
                  })
                }
              }]
            };
            var maxSize = max(pointData, function (d, i) {
              return r(_this3._pointSize(d, i));
            });
            this._projectionPadding.top += maxSize;
            this._projectionPadding.right += maxSize;
            this._projectionPadding.bottom += maxSize;
            this._projectionPadding.left += maxSize;
          }

          this._zoomBehavior.extent([
            [0, 0],
            [width, height]
          ]).scaleExtent([1, this._zoomMax]).translateExtent([
            [0, 0],
            [width, height]
          ]);

          this._zoomSet = true;
        }

        this._projection = this._projection.fitExtent(this._extentBounds.features.length ? [
          [this._projectionPadding.left, this._projectionPadding.top],
          [width - this._projectionPadding.right, height - this._projectionPadding.bottom]
        ] : [
          [0, 0],
          [width, height]
        ], this._extentBounds.features.length ? this._extentBounds : {
          type: "Sphere"
        });

        this._shapes.push(new Path().data(topoData).d(function (d) {
          return path(d.feature);
        }).select(pathGroup.node()).x(0).y(0).config(configPrep.bind(this)(this._shapeConfig, "shape", "Path")).render());

        var pointGroup = this._zoomGroup.selectAll("g.d3plus-geomap-pins").data([0]);

        pointGroup = pointGroup.enter().append("g").attr("class", "d3plus-geomap-pins").merge(pointGroup);
        var circles = new Circle().config(configPrep.bind(this)(this._shapeConfig, "shape", "Circle")).data(pointData).r(function (d, i) {
          return r(_this3._pointSize(d, i));
        }).select(pointGroup.node()).sort(function (a, b) {
          return _this3._pointSize(b) - _this3._pointSize(a);
        }).x(function (d, i) {
          return _this3._projection(_this3._point(d, i))[0];
        }).y(function (d, i) {
          return _this3._projection(_this3._point(d, i))[1];
        });
        var events = Object.keys(this._on);
        var classEvents = events.filter(function (e) {
            return e.includes(".Circle");
          }),
          globalEvents = events.filter(function (e) {
            return !e.includes(".");
          }),
          shapeEvents = events.filter(function (e) {
            return e.includes(".shape");
          });

        for (var e = 0; e < globalEvents.length; e++) {
          circles.on(globalEvents[e], this._on[globalEvents[e]]);
        }

        for (var _e = 0; _e < shapeEvents.length; _e++) {
          circles.on(shapeEvents[_e], this._on[shapeEvents[_e]]);
        }

        for (var _e2 = 0; _e2 < classEvents.length; _e2++) {
          circles.on(classEvents[_e2], this._on[classEvents[_e2]]);
        }

        this._shapes.push(circles.render());

        return this;
      }
      /**
          @memberof Geomap
          @desc Topojson files sometimes include small geographies that negatively impact how the library determines the default zoom level (for example, a small island or territory far off the coast that is barely visible to the eye). The fitFilter method can be used to remove specific geographies from the logic used to determine the zooming.
      The *value* passed can be a single id to remove, an array of ids, or a filter function. Take a look at the [Choropleth Example](http://d3plus.org/examples/d3plus-geomap/getting-started/) to see it in action.
          @param {Number|String|Array|Function} [*value*]
          @chainable
      */

    }, {
      key: "fitFilter",
      value: function fitFilter(_) {
        if (arguments.length) {
          this._zoomSet = false;
          if (typeof _ === "function") return this._fitFilter = _, this;
          if (!(_ instanceof Array)) _ = [_];
          return this._fitFilter = function (d) {
            return _.includes(d.id);
          }, this;
        }

        return this._fitFilter;
      }
      /**
          @memberof Geomap
          @desc If the topojson being used to determine the zoom fit (either the main [topojson](#Geomap.topojson) object or the [fitObject](#Geomap.fitObject)) contains multiple geographical sets (for example, a file containing state and county boundaries), use this method to indentify which set to use for the zoom fit.
      If not specified, the first key in the *Array* returned from using `Object.keys` on the topojson will be used.
          @param {String} *value*
          @chainable
      */

    }, {
      key: "fitKey",
      value: function fitKey(_) {
        if (arguments.length) {
          this._fitKey = _;
          this._zoomSet = false;
          return this;
        }

        return this._fitKey;
      }
      /**
          @memberof Geomap
          @desc The topojson to be used for the initial projection [fit extent](https://github.com/d3/d3-geo#projection_fitExtent). The value passed should either be a valid Topojson *Object* or a *String* representing a filepath or URL to be loaded.
      Additionally, a custom formatting function can be passed as a second argument to this method. This custom function will be passed the data that has been loaded, as long as there are no errors. This function needs to return the final Topojson *Object*.
          @param {Object|String} *data* = `undefined`
          @param {Function} [*formatter*]
          @chainable
      */

    }, {
      key: "fitObject",
      value: function fitObject(_, f) {
        if (arguments.length) {
          if (typeof _ === "string") {
            var prev = this._queue.find(function (q) {
              return q[3] === "fitObject";
            });

            var d = [load.bind(this), _, f, "fitObject"];
            if (prev) this._queue[this._queue.indexOf(prev)] = d;
            else this._queue.push(d);
          } else {
            this._fitObject = _;
          }

          this._zoomSet = false;
          return this;
        }

        return this._fitObject;
      }
      /**
          @memberof Geomap
          @desc The color visible behind any shapes drawn on the map projection. By default, a color value matching the color used in the map tiles is used to help mask the loading time needed to render the tiles. Any value CSS color value may be used, including hexidecimal, rgb, rgba, and color strings like `"blue"` and `"transparent"`.
          @param {String} [*value* = "#d4dadc"]
          @chainable
      */

    }, {
      key: "ocean",
      value: function ocean(_) {
        return arguments.length ? (this._ocean = _, this) : this._ocean;
      }
      /**
          @memberof Geomap
          @desc The accessor to be used when detecting coordinate points in the objects passed to the [data](https://d3plus.org/docs/#Viz.data) method. Values are expected to be in the format `[longitude, latitude]`, which is in-line with d3's expected coordinate mapping.
          @param {Function|Array} [*value*]
          @chainable
      */

    }, {
      key: "point",
      value: function point(_) {
        return arguments.length ? (this._point = typeof _ === "function" ? _ : constant(_), this) : this._point;
      }
      /**
          @memberof Geomap
          @desc The accessor or static value to be used for sizing coordinate points.
          @param {Function|Number} [*value*]
          @chainable
      */

    }, {
      key: "pointSize",
      value: function pointSize(_) {
        return arguments.length ? (this._pointSize = typeof _ === "function" ? _ : constant(_), this) : this._pointSize;
      }
      /**
          @memberof Geomap
          @desc The maximum pixel radius used in the scale for sizing coordinate points.
          @param {Number} [*value* = 10]
          @chainable
      */

    }, {
      key: "pointSizeMax",
      value: function pointSizeMax(_) {
        return arguments.length ? (this._pointSizeMax = _, this) : this._pointSizeMax;
      }
      /**
          @memberof Geomap
          @desc The minimum pixel radius used in the scale for sizing coordinate points.
          @param {Number} [*value* = 5]
          @chainable
      */

    }, {
      key: "pointSizeMin",
      value: function pointSizeMin(_) {
        return arguments.length ? (this._pointSizeMin = _, this) : this._pointSizeMin;
      }
      /**
          @memberof Geomap
          @desc Sets the map projection used when displaying topojson and coordinate points. Any of the standard projections exported from [d3-geo](https://github.com/d3/d3-geo#projections) are accepted, whether as the string name (ie. "geoMercator") or the generator function itself. Map tiles are only usable when the projection is set to Mercator (which is also the default value).
          @param {Function|String} *projection* = "geoMercator"
          @chainable
      */

    }, {
      key: "projection",
      value: function projection(_) {
        if (arguments.length && _ !== "geoMercator") this._tiles = false;
        return arguments.length ? (this._projection = typeof _ === "string" ? d3Geo[_] ? d3Geo[_]() : d3Geo.geoMercator() : _, this) : this._projection;
      }
      /**
          @memberof Geomap
          @desc The outer padding between the edge of the visualization and the shapes drawn. The value passed can be either a single number to be used on all sides, or a CSS string pattern (ie. `"20px 0 10px"`).
          @param {Number|String} [*value* = 20]
          @chainable
      */

    }, {
      key: "projectionPadding",
      value: function projectionPadding(_) {
        return arguments.length ? (this._projectionPadding = parseSides(_), this) : this._projectionPadding;
      }
      /**
          @memberof Geomap
          @desc An array that corresponds to the value passed to the projection's [rotate](https://github.com/d3/d3-geo#projection_rotate) function. Use this method to shift the centerpoint of a map.
          @param {Array} [*value* = [0, 0]]
          @chainable
      */

    }, {
      key: "projectionRotate",
      value: function projectionRotate(_) {
        if (arguments.length) {
          this._projection.rotate(_);

          this._tiles = false;
          this._zoomSet = false;
          return this;
        } else {
          return this._projectionRotate;
        }
      }
      /**
          @memberof Geomap
          @desc Toggles the visibility of the map tiles.
          @param {Boolean} [*value* = true]
          @chainable
      */

    }, {
      key: "tiles",
      value: function tiles(_) {
        return arguments.length ? (this._tiles = _, this) : this._tiles;
      }
      /**
          @memberof Geomap
          @desc By default, d3plus uses the `light_all` style provided by [CARTO](https://carto.com/location-data-services/basemaps/) for it's map tiles. The [tileUrl](https://d3plus.org/docs/#Geomap.tileUrl) method changes the base URL used for fetching the tiles, as long as the string passed contains `{x}`, `{y}`, and `{z}` variables enclosed in curly brackets for the zoom logic to load the correct tiles.
          @param {String} [url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"]
          @chainable
      */

    }, {
      key: "tileUrl",
      value: function tileUrl(_) {
        return arguments.length ? (this._tileUrl = _, this) : this._tileUrl;
      }
      /**
          @memberof Geomap
          @desc The topojson to be used for drawing geographical paths. The value passed should either be a valid Topojson *Object* or a *String* representing a filepath or URL to be loaded.
      Additionally, a custom formatting function can be passed as a second argument to this method. This custom function will be passed the data that has been loaded, as long as there are no errors. This function should return the final Topojson *Obejct*.
          @param {Object|String} *data* = []
          @param {Function} [*formatter*]
          @chainable
      */

    }, {
      key: "topojson",
      value: function topojson(_, f) {
        if (arguments.length) {
          if (typeof _ === "string") {
            var prev = this._queue.find(function (q) {
              return q[3] === "topojson";
            });

            var d = [load.bind(this), _, f, "topojson"];
            if (prev) this._queue[this._queue.indexOf(prev)] = d;
            else this._queue.push(d);
          } else {
            this._topojson = _;
          }

          this._zoomSet = false;
          return this;
        }

        return this._topojson;
      }
      /**
          @memberof Geomap
          @desc The function is used to set default color of the map.
          @param {String|Function} *value* = string
          @chainable
      */

    }, {
      key: "topojsonFill",
      value: function topojsonFill(_) {
        return arguments.length ? (this._topojsonFill = typeof _ === "function" ? _ : constant(_), this, this) : this._topojsonFill;
      }
      /**
          @memberof Geomap
          @desc If the [topojson](#Geomap.topojson) being used contains boundaries that should not be shown, this method can be used to filter them out of the final output. The *value* passed can be a single id to remove, an array of ids, or a filter function.
          @param {Number|String|Array|Function} [*value*]
          @chainable
      */

    }, {
      key: "topojsonFilter",
      value: function topojsonFilter(_) {
        if (arguments.length) {
          this._zoomSet = false;
          if (typeof _ === "function") return this._topojsonFilter = _, this;
          if (!(_ instanceof Array)) _ = [_];
          return this._topojsonFilter = function (d) {
            return _.includes(d.id);
          }, this;
        }

        return this._topojsonFilter;
      }
      /**
          @memberof Geomap
          @desc If the [topojson](#Geomap.topojson) contains multiple geographical sets (for example, a file containing state and county boundaries), use this method to indentify which set to use.
      If not specified, the first key in the *Array* returned from using `Object.keys` on the topojson will be used.
          @param {String} *value*
          @chainable
      */

    }, {
      key: "topojsonKey",
      value: function topojsonKey(_) {
        if (arguments.length) {
          this._topojsonKey = _;
          this._zoomSet = false;
          return this;
        }

        return this._topojsonKey;
      }
      /**
          @memberof Geomap
          @desc The accessor used to map each topojson geometry to it's corresponding [data](https://d3plus.org/docs/#Viz.data) point.
          @param {String|Function} *value* = "id"
          @chainable
      */

    }, {
      key: "topojsonId",
      value: function topojsonId(_) {
        return arguments.length ? (this._topojsonId = typeof _ === "function" ? _ : accessor(_), this, this) : this._topojsonId;
      }
    }]);

    return Geomap;
  }(Viz);

export {
  Geomap
};