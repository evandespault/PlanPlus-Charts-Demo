var inheriting = {},
    AmCharts = {
        Class: function (a) {
            var b = function () {
                    arguments[0] !== inheriting && (this.events = {}, this.construct.apply(this, arguments))
                };
            a.inherits ? (b.prototype = new a.inherits(inheriting), b.base = a.inherits.prototype, delete a.inherits) : (b.prototype.createEvents = function () {
                for (var a = 0, b = arguments.length; a < b; a++) this.events[arguments[a]] = []
            }, b.prototype.listenTo = function (a, b, d) {
                a.events[b].push({
                    handler: d,
                    scope: this
                })
            }, b.prototype.addListener = function (a, b, d) {
                this.events[a].push({
                    handler: b,
                    scope: d
                })
            }, b.prototype.removeListener = function (a, b, d) {
                a = a.events[b];
                for (b = a.length - 1; 0 <= b; b--) a[b].handler === d && a.splice(b, 1)
            }, b.prototype.fire = function (a, b) {
                for (var d = this.events[a], h = 0, j = d.length; h < j; h++) {
                    var k = d[h];
                    k.handler.call(k.scope, b)
                }
            });
            for (var d in a) b.prototype[d] = a[d];
            return b
        },
        charts: [],
        addChart: function (a) {
            AmCharts.charts.push(a)
        },
        removeChart: function (a) {
            for (var b = AmCharts.charts, d = b.length - 1; 0 <= d; d--) b[d] == a && b.splice(d, 1)
        }
    };
document.attachEvent && (AmCharts.isNN = !1, AmCharts.isIE = !0, AmCharts.dx = 0, AmCharts.dy = 0);
if (document.addEventListener || window.opera) AmCharts.isNN = !0, AmCharts.isIE = !1, AmCharts.dx = 0.5, AmCharts.dy = 0.5;
window.chrome && (AmCharts.chrome = !0);
AmCharts.IEversion = 0; - 1 != navigator.appVersion.indexOf("MSIE") && document.documentMode && (AmCharts.IEversion = document.documentMode);
9 <= AmCharts.IEversion && (AmCharts.ddd = 0.5);
AmCharts.handleResize = function () {
    for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
        var d = a[b];
        d && d.div && d.handleResize()
    }
};
AmCharts.handleMouseUp = function (a) {
    for (var b = AmCharts.charts, d = 0; d < b.length; d++) {
        var e = b[d];
        e && e.handleReleaseOutside(a)
    }
};
AmCharts.handleMouseMove = function (a) {
    for (var b = AmCharts.charts, d = 0; d < b.length; d++) {
        var e = b[d];
        e && e.handleMouseMove(a)
    }
};
AmCharts.resetMouseOver = function () {
    for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
        var d = a[b];
        if (d) d.mouseIsOver = false
    }
};
AmCharts.onReadyArray = [];
AmCharts.ready = function (a) {
    AmCharts.onReadyArray.push(a)
};
AmCharts.handleLoad = function () {
    for (var a = AmCharts.onReadyArray, b = 0; b < a.length; b++)(0, a[b])()
};
AmCharts.updateRate = 40;
AmCharts.uid = 0;
AmCharts.getUniqueId = function () {
    AmCharts.uid++;
    return "AmChartsEl-" + AmCharts.uid
};
AmCharts.isNN && (document.addEventListener("mousemove", AmCharts.handleMouseMove, !0), window.addEventListener("resize", AmCharts.handleResize, !0), document.addEventListener("mouseup", AmCharts.handleMouseUp, !0), window.addEventListener("load", AmCharts.handleLoad, !0));
AmCharts.isIE && (document.attachEvent("onmousemove", AmCharts.handleMouseMove), window.attachEvent("onresize", AmCharts.handleResize), document.attachEvent("onmouseup", AmCharts.handleMouseUp), window.attachEvent("onload", AmCharts.handleLoad));
AmCharts.AmChart = AmCharts.Class({
    construct: function () {
        this.version = "2.6.2";
        AmCharts.addChart(this);
        this.createEvents("dataUpdated");
        this.height = this.width = "100%";
        this.dataChanged = !0;
        this.chartCreated = !1;
        this.previousWidth = this.previousHeight = 0;
        this.backgroundColor = "#FFFFFF";
        this.borderAlpha = this.backgroundAlpha = 0;
        this.color = this.borderColor = "#000000";
        this.fontFamily = "Verdana";
        this.fontSize = 11;
        this.numberFormatter = {
            precision: -1,
            decimalSeparator: ".",
            thousandsSeparator: ","
        };
        this.percentFormatter = {
            precision: 2,
            decimalSeparator: ".",
            thousandsSeparator: ","
        };
        this.labels = [];
        this.allLabels = [];
        this.titles = [];
        this.autoMarginOffset = 0;
        var a = document.createElement("div"),
            b = a.style;
        b.overflow = "hidden";
        b.position = "relative";
        this.chartDiv = a;
        a = document.createElement("div");
        b = a.style;
        b.overflow = "hidden";
        b.position = "relative";
        this.legendDiv = a;
        this.balloon = new AmCharts.AmBalloon;
        this.balloon.chart = this;
        this.titleHeight = 0;
        this.prefixesOfBigNumbers = [{
            number: 1E3,
            prefix: "k"
        }, {
            number: 1E6,
            prefix: "M"
        }, {
            number: 1E9,
            prefix: "G"
        }, {
            number: 1E12,
            prefix: "T"
        }, {
            number: 1E15,
            prefix: "P"
        }, {
            number: 1E18,
            prefix: "E"
        }, {
            number: 1.0E21,
            prefix: "Z"
        }, {
            number: 1.0E24,
            prefix: "Y"
        }];
        this.prefixesOfSmallNumbers = [{
            number: 1.0E-24,
            prefix: "y"
        }, {
            number: 1.0E-21,
            prefix: "z"
        }, {
            number: 1.0E-18,
            prefix: "a"
        }, {
            number: 1.0E-15,
            prefix: "f"
        }, {
            number: 1.0E-12,
            prefix: "p"
        }, {
            number: 1.0E-9,
            prefix: "n"
        }, {
            number: 1.0E-6,
            prefix: "\u03bc"
        }, {
            number: 0.001,
            prefix: "m"
        }];
        this.panEventsEnabled = !1
    },
    drawChart: function () {
        var a = this.container,
            b = this.backgroundColor,
            d = this.backgroundAlpha,
            e = this.realWidth,
            f = this.realHeight,
            g = this.set;
        void 0 != b && 0 < d && (this.background = b = AmCharts.rect(a, e - 1, f, b, d, 1, this.borderColor, this.borderAlpha), g.push(b));
        if (b = this.backgroundImage) this.path && (b = this.path + b), this.bgImg = a = a.image(b, 0, 0, e, f), g.push(a);
        this.redrawLabels();
        this.drawTitles()
    },
    drawTitles: function () {
        var a = this.titles;
        if (AmCharts.ifArray(a)) for (var b = 20, d = 0; d < a.length; d++) {
            var e = a[d],
                f = e.color;
            void 0 == f && (f = this.color);
            var g = e.size;
            isNaN(e.alpha);
            var b = b + g / 2,
                h = this.marginLeft,
                f = AmCharts.text(this.container, e.text, f, this.fontFamily, g);
            f.translate(h + (this.divRealWidth - this.marginRight - h) / 2, b);
            b = !0;
            void 0 != e.bold && (b = e.bold);
            b && f.attr({
                "font-weight": "bold"
            });
            e = f.getBBox();
            b = e.y + e.height + 5;
            this.freeLabelsSet.push(f)
        }
    },
    write: function (a) {
        var b = this.balloon;
        b && !b.chart && (b.chart = this);
        this.listenersAdded || (this.addListeners(), this.listenersAdded = !0);
        this.div = a = "object" != typeof a ? document.getElementById(a) : a;
        a.style.overflow = "hidden";
        var b = this.chartDiv,
            d = this.legendDiv,
            e = this.legend,
            f = d.style,
            g = b.style;
        this.measure();
        if (e) switch (e.position) {
        case "bottom":
            a.appendChild(b);
            a.appendChild(d);
            break;
        case "top":
            a.appendChild(d);
            a.appendChild(b);
            break;
        case "absolute":
            f.position = "absolute";
            g.position = "absolute";
            void 0 != e.left && (f.left = e.left);
            void 0 != e.right && (f.right = e.right);
            void 0 != this.legend.top && (f.top = e.top);
            void 0 != this.legend.bottom && (f.bottom = e.bottom);
            a.appendChild(b);
            a.appendChild(d);
            break;
        case "right":
            f.position = "relative";
            g.position = "absolute";
            a.appendChild(b);
            a.appendChild(d);
            break;
        case "left":
            f.position = "relative", g.position = "absolute", a.appendChild(b), a.appendChild(d)
        } else a.appendChild(b);
        this.divIsFixed = AmCharts.findIfFixed(b);
        this.initChart()
    },
    createLabelsSet: function () {
        AmCharts.remove(this.labelsSet);
        this.labelsSet = this.container.set();
        this.freeLabelsSet.push(this.labelsSet)
    },
    initChart: function () {
        this.previousHeight = this.realHeight;
        this.previousWidth = this.realWidth;
        this.destroy();
        var a = 0;
        if (document.attachEvent && !window.opera) {
            var a = 1,
                b = this.legend;
            if (b && (b = b.position, "right" == b || "left" == b)) a = 2
        }
        this.mouseMode = a;
        a = this.container = new AmCharts.AmDraw(this.chartDiv, this.realWidth, this.realHeight);
        this.set = a.set();
        this.gridSet = a.set();
        this.columnSet = a.set();
        this.graphsSet = a.set();
        this.trendLinesSet = a.set();
        this.axesLabelsSet = a.set();
        this.axesSet = a.set();
        this.cursorSet = a.set();
        this.scrollbarsSet = a.set();
        this.bulletSet = a.set();
        this.freeLabelsSet = a.set();
        this.balloonsSet = a.set();
        this.zoomButtonSet = a.set();
        this.linkSet = a.set();
        this.drb();
        this.renderFix()
    },
    measure: function () {
        var a = this.div,
            b = this.chartDiv,
            d = a.offsetWidth,
            e = a.offsetHeight,
            f = this.container;
        a.clientHeight && (d = a.clientWidth, e = a.clientHeight);
        var a = AmCharts.toCoordinate(this.width, d),
            g = AmCharts.toCoordinate(this.height, e);
        if (a != this.previousWidth || g != this.previousHeight) b.style.width = a + "px", b.style.height = g + "px", f && f.setSize(a, g), this.balloon.setBounds(2, 2, a - 2, g);
        this.realWidth = a;
        this.realHeight = g;
        this.divRealWidth = d;
        this.divRealHeight = e
    },
    destroy: function () {
        this.chartDiv.innerHTML = "";
        this.clearTimeOuts()
    },
    clearTimeOuts: function () {
        var a = this.timeOuts;
        if (a) for (var b = 0; b < a.length; b++) clearTimeout(a[b]);
        this.timeOuts = []
    },
    clear: function () {
        AmCharts.callMethod("clear", [this.chartScrollbar, this.scrollbarV, this.scrollbarH, this.chartCursor]);
        this.chartCursor = this.scrollbarH = this.scrollbarV = this.chartScrollbar = null;
        this.clearTimeOuts();
        this.container && this.container.remove();
        AmCharts.removeChart(this)
    },
    setMouseCursor: function (a) {
        "auto" == a && AmCharts.isNN && (a = "default");
        this.chartDiv.style.cursor = a;
        this.legendDiv.style.cursor = a
    },
    redrawLabels: function () {
        this.labels = [];
        var a = this.allLabels;
        this.createLabelsSet();
        for (var b = 0; b < a.length; b++) this.drawLabel(a[b])
    },
    drawLabel: function (a) {
        if (this.container) {
            var b = a.y,
                d = a.text,
                e = a.align,
                f = a.size,
                g = a.color,
                h = a.rotation,
                j = a.alpha,
                k = a.bold,
                l = AmCharts.toCoordinate(a.x, this.realWidth),
                b = AmCharts.toCoordinate(b, this.realHeight);
            l || (l = 0);
            b || (b = 0);
            void 0 == g && (g = this.color);
            isNaN(f) && (f = this.fontSize);
            e || (e = "start");
            "left" == e && (e = "start");
            "right" == e && (e = "end");
            "center" == e && (e = "middle", h ? b = this.realHeight - b + b / 2 : l = this.realWidth / 2 - l);
            void 0 == j && (j = 1);
            void 0 == h && (h = 0);
            b += f / 2;
            a = AmCharts.text(this.container, d, g, this.fontFamily, f, e, k, j);
            a.translate(l, b);
            0 != h && a.rotate(h);
            this.labelsSet.push(a);
            this.labels.push(a)
        }
    },
    addLabel: function (a, b, d, e, f, g, h, j, k) {
        a = {
            x: a,
            y: b,
            text: d,
            align: e,
            size: f,
            color: g,
            alpha: j,
            rotation: h,
            bold: k
        };
        this.container && this.drawLabel(a);
        this.allLabels.push(a)
    },
    clearLabels: function () {
        for (var a = this.labels, b = a.length - 1; 0 <= b; b--) a[b].remove();
        this.labels = [];
        this.allLabels = []
    },
    updateHeight: function () {
        var a = this.divRealHeight,
            b = this.legend;
        if (b) {
            var d = this.legendDiv.offsetHeight,
                b = b.position;
            if ("top" == b || "bottom" == b) a -= d, 0 > a && (a = 0), this.chartDiv.style.height = a + "px"
        }
        return a
    },
    updateWidth: function () {
        var a = this.divRealWidth,
            b = this.divRealHeight,
            d = this.legend;
        if (d) {
            var e = this.legendDiv,
                f = e.offsetWidth,
                g = e.offsetHeight,
                e = e.style,
                h = this.chartDiv.style,
                d = d.position;
            if ("right" == d || "left" == d) a -= f, 0 > a && (a = 0), h.width = a + "px", "left" == d ? h.left = AmCharts.findPosX(this.div) + f + "px" : e.left = a + "px", e.top = (b - g) / 2 + "px"
        }
        return a
    },
    getTitleHeight: function () {
        var a = 0,
            b = this.titles;
        if (AmCharts.ifArray(b)) for (var d = 0; d < b.length; d++) a += b[d].size + 12;
        return a
    },
    addTitle: function (a, b, d, e, f) {
        isNaN(b) && (b = this.fontSize + 2);
        a = {
            text: a,
            size: b,
            color: d,
            alpha: e,
            bold: f
        };
        this.titles.push(a);
        return a
    },
    addListeners: function () {
        var a = this,
            b = a.chartDiv;
        AmCharts.isNN && (a.panEventsEnabled && "ontouchstart" in document.documentElement && (b.addEventListener("touchstart", function (b) {
            a.handleTouchMove.call(a, b)
        }, !0), b.addEventListener("touchmove", function (b) {
            a.handleTouchMove.call(a, b)
        }, !0), b.addEventListener("touchstart", function (b) {
            a.handleTouchStart.call(a, b)
        }), b.addEventListener("touchend", function (b) {
            a.handleTouchEnd.call(a, b)
        })), b.addEventListener("mousedown", function (b) {
            a.handleMouseDown.call(a, b)
        }, !0), b.addEventListener("mouseover", function (b) {
            a.handleMouseOver.call(a, b)
        }, !0), b.addEventListener("mouseout", function (b) {
            a.handleMouseOut.call(a, b)
        }, !0));
        AmCharts.isIE && (b.attachEvent("onmousedown", function (b) {
            a.handleMouseDown.call(a, b)
        }), b.attachEvent("onmouseover", function (b) {
            a.handleMouseOver.call(a, b)
        }), b.attachEvent("onmouseout", function (b) {
            a.handleMouseOut.call(a, b)
        }))
    },
    dispDUpd: function () {
        this.dispatchDataUpdated && (this.dispatchDataUpdated = !1, this.fire("dataUpdated", {
            type: "dataUpdated"
        }))
    },
    drb: function () {
        var a = "m,o,c,.,s,t,r,a,h,c,m,a".split(",").reverse().join(""),
            b = window.location.hostname.split(".");
        if (2 <= b.length) var d = b[b.length - 2] + "." + b[b.length - 1];
        AmCharts.remove(this.bbset);
        if (d != a) {
            a += "/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemo";
            b = AmCharts.rect(this.container, 145, 20, "#FFFFFF", 1);
            d = AmCharts.text(this.container, "m,o,c,.,s,t,r,a,h,c,m,a, ,y,b, ,t,r,a,h,c".split(",").reverse().join(""), "#000000", "Verdana", 11, "start");
            d.translate(5, 8);
            this.bbset = b = this.container.set([b, d]);
            this.linkSet.push(b);
            b.click(function () {
                window.location.href = "http://" + a
            });
            for (d = 0; d < b.length; d++) b[d].attr({
                cursor: "pointer"
            })
        }
    },
    invalidateSize: function () {
        var a = this;
        a.measure();
        var b = a.legend;
        if ((a.realWidth != a.previousWidth || a.realHeight != a.previousHeight) && a.chartCreated) {
            if (b) {
                clearTimeout(a.legendInitTO);
                var d = setTimeout(function () {
                    b.invalidateSize()
                }, 100);
                a.timeOuts.push(d);
                a.legendInitTO = d
            }
            clearTimeout(a.initTO);
            d = setTimeout(function () {
                a.initChart()
            }, 100);
            a.timeOuts.push(d);
            a.initTO = d
        }
        a.renderFix();
        b && b.renderFix()
    },
    validateData: function (a) {
        this.chartCreated && (this.dataChanged = !0, this.initChart(a))
    },
    validateNow: function () {
        this.initChart()
    },
    showItem: function (a) {
        a.hidden = !1;
        this.initChart()
    },
    hideItem: function (a) {
        a.hidden = !0;
        this.initChart()
    },
    hideBalloon: function () {
        var a = this;
        a.hoverInt = setTimeout(function () {
            a.hideBalloonReal.call(a)
        }, 80)
    },
    hideBalloonReal: function () {
        var a = this.balloon;
        a && a.hide()
    },
    showBalloon: function (a, b, d, e, f) {
        var g = this;
        clearTimeout(g.balloonTO);
        g.balloonTO = setTimeout(function () {
            g.showBalloonReal.call(g, a, b, d, e, f)
        }, 1)
    },
    showBalloonReal: function (a, b, d, e, f) {
        this.handleMouseMove();
        var g = this.balloon;
        g.enabled && (g.followCursor(!1), g.changeColor(b), d || g.setPosition(e, f), g.followCursor(d), a && g.showBalloon(a))
    },
    handleTouchMove: function (a) {
        this.hideBalloon();
        var b = this.chartDiv;
        a.touches && (a = a.touches.item(0), this.mouseX = a.pageX - AmCharts.findPosX(b), this.mouseY = a.pageY - AmCharts.findPosY(b))
    },
    handleMouseOver: function () {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0
    },
    handleMouseOut: function () {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !1
    },
    handleMouseMove: function (a) {
        if (this.mouseIsOver) {
            var b = this.chartDiv;
            a || (a = window.event);
            var d, e;
            if (a) {
                switch (this.mouseMode) {
                case 2:
                    d = a.x - AmCharts.findPosX(b);
                    e = a.y - AmCharts.findPosY(b);
                    break;
                case 1:
                    d = a.x;
                    e = a.y;
                    break;
                case 0:
                    this.divIsFixed ? (d = a.clientX - AmCharts.findPosX(b), e = a.clientY - AmCharts.findPosY(b)) : (d = a.pageX - AmCharts.findPosX(b), e = a.pageY - AmCharts.findPosY(b))
                }
                this.mouseX = d;
                this.mouseY = e
            }
        }
    },
    handleTouchStart: function (a) {
        this.handleMouseDown(a)
    },
    handleTouchEnd: function (a) {
        AmCharts.resetMouseOver();
        this.handleReleaseOutside(a)
    },
    handleReleaseOutside: function () {},
    handleMouseDown: function (a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0;
        a && a.preventDefault && a.preventDefault()
    },
    addLegend: function (a) {
        this.legend = a;
        a.chart = this;
        a.div = this.legendDiv;
        var b = this.handleLegendEvent;
        this.listenTo(a, "showItem", b);
        this.listenTo(a, "hideItem", b);
        this.listenTo(a, "clickMarker", b);
        this.listenTo(a, "rollOverItem", b);
        this.listenTo(a, "rollOutItem", b);
        this.listenTo(a, "rollOverMarker", b);
        this.listenTo(a, "rollOutMarker", b);
        this.listenTo(a, "clickLabel", b)
    },
    removeLegend: function () {
        this.legend = void 0
    },
    handleResize: function () {
        (AmCharts.isPercents(this.width) || AmCharts.isPercents(this.height)) && this.invalidateSize();
        this.renderFix()
    },
    renderFix: function () {
        if (!AmCharts.VML) {
            var a = this.container;
            a && a.renderFix()
        }
    }
});
AmCharts.Slice = AmCharts.Class({
    construct: function () {}
});
AmCharts.SerialDataItem = AmCharts.Class({
    construct: function () {}
});
AmCharts.GraphDataItem = AmCharts.Class({
    construct: function () {}
});
AmCharts.Guide = AmCharts.Class({
    construct: function () {}
});
AmCharts.toBoolean = function (a, b) {
    if (void 0 == a) return b;
    switch (("" + a).toLowerCase()) {
    case "true":
    case "yes":
    case "1":
        return !0;
    case "false":
    case "no":
    case "0":
    case null:
        return !1;
    default:
        return Boolean(a)
    }
};
AmCharts.removeFromArray = function (a, b) {
    for (var d = a.length - 1; 0 <= d; d--) a[d] == b && a.splice(d, 1)
};
AmCharts.formatMilliseconds = function (a, b) {
    if (-1 != a.indexOf("fff")) {
        var d = b.getMilliseconds(),
            e = "" + d;
        10 > d && (e = "00" + d);
        10 <= d && 100 > d && (e = "0" + d);
        a = a.replace(/fff/g, e)
    }
    return a
};
AmCharts.ifArray = function (a) {
    return a && 0 < a.length ? !0 : !1
};
AmCharts.callMethod = function (a, b) {
    for (var d = 0; d < b.length; d++) {
        var e = b[d];
        if (e) {
            if (e[a]) e[a]();
            var f = e.length;
            if (0 < f) for (var g = 0; g < f; g++) {
                var h = e[g];
                if (h && h[a]) h[a]()
            }
        }
    }
};
AmCharts.toNumber = function (a) {
    return "number" == typeof a ? a : Number(("" + a).replace(/[^0-9\-.]+/g, ""))
};
AmCharts.toColor = function (a) {
    if ("" != a && void 0 != a) if (-1 != a.indexOf(",")) for (var a = a.split(","), b = 0; b < a.length; b++) {
        var d = a[b].substring(a[b].length - 6, a[b].length);
        a[b] = "#" + d
    } else a = a.substring(a.length - 6, a.length), a = "#" + a;
    return a
};
AmCharts.toCoordinate = function (a, b, d) {
    var e;
    void 0 != a && (a = a.toString(), d && d < b && (b = d), e = Number(a), -1 != a.indexOf("!") && (e = b - Number(a.substr(1))), -1 != a.indexOf("%") && (e = b * Number(a.substr(0, a.length - 1)) / 100));
    return e
};
AmCharts.fitToBounds = function (a, b, d) {
    a < b && (a = b);
    a > d && (a = d);
    return a
};
AmCharts.isDefined = function (a) {
    return void 0 == a ? !1 : !0
};
AmCharts.stripNumbers = function (a) {
    return a.replace(/[0-9]+/g, "")
};
AmCharts.extractPeriod = function (a) {
    var b = AmCharts.stripNumbers(a),
        d = 1;
    b != a && (d = Number(a.slice(0, a.indexOf(b))));
    return {
        period: b,
        count: d
    }
};
AmCharts.resetDateToMin = function (a, b, d, e) {
    void 0 == e && (e = 1);
    var f, g, h, j, k, l, m;
    switch (b) {
    case "YYYY":
        f = Math.floor(a.getFullYear() / d) * d;
        g = 0;
        h = 1;
        m = l = k = j = 0;
        break;
    case "MM":
        f = a.getFullYear();
        g = Math.floor(a.getMonth() / d) * d;
        h = 1;
        m = l = k = j = 0;
        break;
    case "WW":
        f = a.getFullYear();
        g = a.getMonth();
        b = a.getDay();
        0 == b && 0 < e && (b = 7);
        h = a.getDate() - b + e;
        m = l = k = j = 0;
        break;
    case "DD":
        f = a.getFullYear();
        g = a.getMonth();
        h = Math.floor(a.getDate() / d) * d;
        m = l = k = j = 0;
        break;
    case "hh":
        f = a.getFullYear();
        g = a.getMonth();
        h = a.getDate();
        j = Math.floor(a.getHours() / d) * d;
        m = l = k = 0;
        break;
    case "mm":
        f = a.getFullYear();
        g = a.getMonth();
        h = a.getDate();
        j = a.getHours();
        k = Math.floor(a.getMinutes() / d) * d;
        m = l = 0;
        break;
    case "ss":
        f = a.getFullYear();
        g = a.getMonth();
        h = a.getDate();
        j = a.getHours();
        k = a.getMinutes();
        l = Math.floor(a.getSeconds() / d) * d;
        m = 0;
        break;
    case "fff":
        f = a.getFullYear(), g = a.getMonth(), h = a.getDate(), j = a.getHours(), k = a.getMinutes(), l = a.getSeconds(), m = Math.floor(a.getMilliseconds() / d) * d
    }
    return a = new Date(f, g, h, j, k, l, m)
};
AmCharts.getPeriodDuration = function (a, b) {
    void 0 == b && (b = 1);
    var d;
    switch (a) {
    case "YYYY":
        d = 316224E5;
        break;
    case "MM":
        d = 26784E5;
        break;
    case "WW":
        d = 6048E5;
        break;
    case "DD":
        d = 864E5;
        break;
    case "hh":
        d = 36E5;
        break;
    case "mm":
        d = 6E4;
        break;
    case "ss":
        d = 1E3;
        break;
    case "fff":
        d = 1
    }
    return d * b
};
AmCharts.roundTo = function (a, b) {
    if (0 > b) return a;
    var d = Math.pow(10, b);
    return Math.round(a * d) / d
};
AmCharts.intervals = {
    s: {
        nextInterval: "ss",
        contains: 1E3
    },
    ss: {
        nextInterval: "mm",
        contains: 60,
        count: 0
    },
    mm: {
        nextInterval: "hh",
        contains: 60,
        count: 1
    },
    hh: {
        nextInterval: "DD",
        contains: 24,
        count: 2
    },
    DD: {
        nextInterval: "",
        contains: Infinity,
        count: 3
    }
};
AmCharts.getMaxInterval = function (a, b) {
    var d = AmCharts.intervals;
    return a >= d[b].contains ? (a = Math.round(a / d[b].contains), b = d[b].nextInterval, AmCharts.getMaxInterval(a, b)) : "ss" == b ? d[b].nextInterval : b
};
AmCharts.formatDuration = function (a, b, d, e, f, g) {
    var h = AmCharts.intervals,
        j = g.decimalSeparator;
    if (a >= h[b].contains) {
        var k = a - Math.floor(a / h[b].contains) * h[b].contains;
        "ss" == b && (k = AmCharts.formatNumber(k, g), 1 == k.split(j)[0].length && (k = "0" + k));
        if (("mm" == b || "hh" == b) && 10 > k) k = "0" + k;
        d = k + "" + e[b] + "" + d;
        a = Math.floor(a / h[b].contains);
        b = h[b].nextInterval;
        return AmCharts.formatDuration(a, b, d, e, f, g)
    }
    "ss" == b && (a = AmCharts.formatNumber(a, g), 1 == a.split(j)[0].length && (a = "0" + a));
    if (("mm" == b || "hh" == b) && 10 > a) a = "0" + a;
    d = a + "" + e[b] + "" + d;
    if (h[f].count > h[b].count) for (a = h[b].count; a < h[f].count; a++) b = h[b].nextInterval, "ss" == b || "mm" == b || "hh" == b ? d = "00" + e[b] + "" + d : "DD" == b && (d = "0" + e[b] + "" + d);
    ":" == d.charAt(d.length - 1) && (d = d.substring(0, d.length - 1));
    return d
};
AmCharts.formatNumber = function (a, b, d, e, f) {
    a = AmCharts.roundTo(a, b.precision);
    isNaN(d) && (d = b.precision);
    var g = b.decimalSeparator,
        b = b.thousandsSeparator,
        h = 0 > a ? "-" : "",
        a = Math.abs(a),
        j = a.toString();
    if (-1 == j.indexOf("e")) {
        for (var j = j.split("."), k = "", l = j[0].toString(), m = l.length; 0 <= m; m -= 3) k = m != l.length ? 0 != m ? l.substring(m - 3, m) + b + k : l.substring(m - 3, m) + k : l.substring(m - 3, m);
        void 0 != j[1] && (k = k + g + j[1]);
        void 0 != d && 0 < d && "0" != k && (k = AmCharts.addZeroes(k, g, d))
    } else k = j;
    k = h + k;
    "" == h && !0 == e && 0 != a && (k = "+" + k);
    !0 == f && (k += "%");
    return k
};
AmCharts.addZeroes = function (a, b, d) {
    a = a.split(b);
    void 0 == a[1] && 0 < d && (a[1] = "0");
    return a[1].length < d ? (a[1] += "0", AmCharts.addZeroes(a[0] + b + a[1], b, d)) : void 0 != a[1] ? a[0] + b + a[1] : a[0]
};
AmCharts.scientificToNormal = function (a) {
    var b, a = a.toString().split("e");
    if ("-" == a[1].substr(0, 1)) {
        b = "0.";
        for (var d = 0; d < Math.abs(Number(a[1])) - 1; d++) b += "0";
        b += a[0].split(".").join("")
    } else {
        var e = 0;
        b = a[0].split(".");
        b[1] && (e = b[1].length);
        b = a[0].split(".").join("");
        for (d = 0; d < Math.abs(Number(a[1])) - e; d++) b += "0"
    }
    return b
};
AmCharts.toScientific = function (a, b) {
    if (0 == a) return "0";
    var d = Math.floor(Math.log(Math.abs(a)) * Math.LOG10E);
    Math.pow(10, d);
    mantissa = mantissa.toString().split(".").join(b);
    return mantissa.toString() + "e" + d
};
AmCharts.randomColor = function () {
    function a() {
        return Math.floor(256 * Math.random()).toString(16)
    }
    return "#" + a() + a() + a()
};
AmCharts.hitTest = function (a, b, d) {
    var e = !1,
        f = a.x,
        g = a.x + a.width,
        h = a.y,
        j = a.y + a.height,
        k = AmCharts.isInRectangle;
    e || (e = k(f, h, b));
    e || (e = k(f, j, b));
    e || (e = k(g, h, b));
    e || (e = k(g, j, b));
    !e && !0 != d && (e = AmCharts.hitTest(b, a, !0));
    return e
};
AmCharts.isInRectangle = function (a, b, d) {
    return a >= d.x - 5 && a <= d.x + d.width + 5 && b >= d.y - 5 && b <= d.y + d.height + 5 ? !0 : !1
};
AmCharts.isPercents = function (a) {
    if (-1 != ("" + a).indexOf("%")) return !0
};
AmCharts.dayNames = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");
AmCharts.shortDayNames = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",");
AmCharts.monthNames = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
AmCharts.shortMonthNames = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");
AmCharts.formatDate = function (a, b) {
    var d = a.getFullYear(),
        e = ("" + d).substr(-2, 2),
        f = a.getMonth(),
        g = f + 1;
    9 > f && (g = "0" + g);
    var h = a.getDate(),
        j = h;
    10 > h && (j = "0" + h);
    var k = a.getDay(),
        l = "0" + k,
        m = a.getHours(),
        o = m;
    24 == o && (o = 0);
    var p = o;
    10 > p && (p = "0" + p);
    b = b.replace(/JJ/g, p);
    b = b.replace(/J/g, o);
    o = m;
    0 == o && (o = 24);
    p = o;
    10 > p && (p = "0" + p);
    b = b.replace(/HH/g, p);
    b = b.replace(/H/g, o);
    o = m;
    11 < o && (o -= 12);
    p = o;
    10 > p && (p = "0" + p);
    b = b.replace(/KK/g, p);
    b = b.replace(/K/g, o);
    o = m;
    12 < o && (o -= 12);
    p = o;
    10 > p && (p = "0" + p);
    b = b.replace(/LL/g, p);
    b = b.replace(/L/g, o);
    p = o = a.getMinutes();
    10 > p && (p = "0" + p);
    b = b.replace(/NN/g, p);
    b = b.replace(/N/g, o);
    p = o = a.getSeconds();
    10 > p && (p = "0" + p);
    b = b.replace(/SS/g, p);
    b = b.replace(/S/g, o);
    p = o = a.getMilliseconds();
    10 > p && (p = "00" + p);
    100 > p && (p = "0" + p);
    var n = o;
    10 > n && (n = "00" + n);
    b = b.replace(/QQQ/g, p);
    b = b.replace(/QQ/g, n);
    b = b.replace(/Q/g, o);
    b = 12 > m ? b.replace(/A/g, "am") : b.replace(/A/g, "pm");
    b = b.replace(/YYYY/g, "@IIII@");
    b = b.replace(/YY/g, "@II@");
    b = b.replace(/MMMM/g, "@XXXX@");
    b = b.replace(/MMM/g, "@XXX@");
    b = b.replace(/MM/g, "@XX@");
    b = b.replace(/M/g, "@X@");
    b = b.replace(/DD/g, "@RR@");
    b = b.replace(/D/g, "@R@");
    b = b.replace(/EEEE/g, "@PPPP@");
    b = b.replace(/EEE/g, "@PPP@");
    b = b.replace(/EE/g, "@PP@");
    b = b.replace(/E/g, "@P@");
    b = b.replace(/@IIII@/g, d);
    b = b.replace(/@II@/g, e);
    b = b.replace(/@XXXX@/g, AmCharts.monthNames[f]);
    b = b.replace(/@XXX@/g, AmCharts.shortMonthNames[f]);
    b = b.replace(/@XX@/g, g);
    b = b.replace(/@X@/g, f + 1);
    b = b.replace(/@RR@/g, j);
    b = b.replace(/@R@/g, h);
    b = b.replace(/@PPPP@/g, AmCharts.dayNames[k]);
    b = b.replace(/@PPP@/g, AmCharts.shortDayNames[k]);
    b = b.replace(/@PP@/g, l);
    return b = b.replace(/@P@/g, k)
};
AmCharts.findPosX = function (a) {
    for (var b = a.offsetLeft; a = a.offsetParent;) b += a.offsetLeft, a != document.body && a != document.documentElement && (b -= a.scrollLeft);
    return b
};
AmCharts.findPosY = function (a) {
    for (var b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop, a != document.body && a != document.documentElement && (b -= a.scrollTop);
    return b
};
AmCharts.findIfFixed = function (a) {
    for (; a = a.offsetParent;) if ("fixed" == a.style.position) return !0;
    return !1
};
AmCharts.formatValue = function (a, b, d, e, f, g, h, j) {
    if (b) {
        void 0 == f && (f = "");
        for (var k = 0; k < d.length; k++) {
            var l = d[k],
                m = b[l];
            void 0 != m && (m = g ? AmCharts.addPrefix(m, j, h, e) : AmCharts.formatNumber(m, e), a = a.replace(RegExp("\\[\\[" + f + "" + l + "\\]\\]", "g"), m))
        }
    }
    return a
};
AmCharts.formatDataContextValue = function (a, b) {
    if (a) for (var d = a.match(/\[\[.*?\]\]/g), e = 0; e < d.length; e++) {
        var f = d[e],
            f = f.substr(2, f.length - 4);
        void 0 != b[f] && (a = a.replace(RegExp("\\[\\[" + f + "\\]\\]", "g"), b[f]))
    }
    return a
};
AmCharts.massReplace = function (a, b) {
    for (var d in b) {
        var e = b[d];
        void 0 == e && (e = "");
        a = a.replace(d, e)
    }
    return a
};
AmCharts.cleanFromEmpty = function (a) {
    return a.replace(/\[\[[^\]]*\]\]/g, "")
};
AmCharts.addPrefix = function (a, b, d, e) {
    var f = AmCharts.formatNumber(a, e),
        g = "",
        h;
    if (0 == a) return "0";
    0 > a && (g = "-");
    a = Math.abs(a);
    if (1 < a) for (h = b.length - 1; - 1 < h; h--) {
        if (a >= b[h].number) {
            a /= b[h].number;
            e = Number(e.precision);
            1 > e && (e = 1);
            a = AmCharts.roundTo(a, e);
            f = g + "" + a + "" + b[h].prefix;
            break
        }
    } else for (h = 0; h < d.length; h++) if (a <= d[h].number) {
        a /= d[h].number;
        e = Math.abs(Math.round(Math.log(a) * Math.LOG10E));
        a = AmCharts.roundTo(a, e);
        f = g + "" + a + "" + d[h].prefix;
        break
    }
    return f
};
AmCharts.remove = function (a) {
    a && a.remove()
};
AmCharts.copyProperties = function (a, b) {
    for (var d in a) "events" != d && void 0 != a[d] && "function" != typeof a[d] && (b[d] = a[d])
};
AmCharts.recommended = function () {
    var a = "js";
    document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") || swfobject && swfobject.hasFlashPlayerVersion("8") && (a = "flash");
    return a
};
AmCharts.Bezier = AmCharts.Class({
    construct: function (a, b, d, e, f, g, h, j, k, l) {
        var m = "none";
        void 0 != k && (m = k);
        "object" == typeof h && (h = h[0]);
        "object" == typeof j && (j = j[0]);
        g = {
            fill: h,
            "fill-opacity": j,
            "stroke-dasharray": m,
            "stroke-width": g
        };
        isNaN(f) || (g["stroke-opacity"] = f);
        e && (g.stroke = e);
        e = "M" + Math.round(b[0]) + "," + Math.round(d[0]);
        f = [];
        for (h = 0; h < b.length; h++) f.push({
            x: b[h],
            y: d[h]
        });
        1 < f.length && (b = this.interpolate(f), e += this.drawBeziers(b));
        l && (e += l);
        this.path = a.path(e).attr(g)
    },
    interpolate: function (a) {
        var b = [];
        b.push({
            x: a[0].x,
            y: a[0].y
        });
        var d = a[1].x - a[0].x,
            e = a[1].y - a[0].y;
        b.push({
            x: a[0].x + d / 6,
            y: a[0].y + e / 6
        });
        for (var f = 1; f < a.length - 1; f++) {
            var g = a[f - 1],
                h = a[f],
                e = a[f + 1],
                d = e.x - h.x,
                e = e.y - g.y,
                g = h.x - g.x;
            g > d && (g = d);
            b.push({
                x: h.x - g / 3,
                y: h.y - e / 6
            });
            b.push({
                x: h.x,
                y: h.y
            });
            b.push({
                x: h.x + g / 3,
                y: h.y + e / 6
            })
        }
        e = a[a.length - 1].y - a[a.length - 2].y;
        d = a[a.length - 1].x - a[a.length - 2].x;
        b.push({
            x: a[a.length - 1].x - d / 3,
            y: a[a.length - 1].y - e / 6
        });
        b.push({
            x: a[a.length - 1].x,
            y: a[a.length - 1].y
        });
        return b
    },
    drawBeziers: function (a) {
        for (var b = "", d = 0; d < (a.length - 1) / 3; d++) b += this.drawBezierMidpoint(a[3 * d], a[3 * d + 1], a[3 * d + 2], a[3 * d + 3]);
        return b
    },
    drawBezierMidpoint: function (a, b, d, e) {
        var f = Math.round,
            g = this.getPointOnSegment(a, b, 0.75),
            h = this.getPointOnSegment(e, d, 0.75),
            j = (e.x - a.x) / 16,
            k = (e.y - a.y) / 16,
            l = this.getPointOnSegment(a, b, 0.375),
            a = this.getPointOnSegment(g, h, 0.375);
        a.x -= j;
        a.y -= k;
        b = this.getPointOnSegment(h, g, 0.375);
        b.x += j;
        b.y += k;
        d = this.getPointOnSegment(e, d, 0.375);
        j = this.getMiddle(l, a);
        g = this.getMiddle(g, h);
        h = this.getMiddle(b, d);
        l = " Q" + f(l.x) + "," + f(l.y) + "," + f(j.x) + "," + f(j.y);
        l += " Q" + f(a.x) + "," + f(a.y) + "," + f(g.x) + "," + f(g.y);
        l += " Q" + f(b.x) + "," + f(b.y) + "," + f(h.x) + "," + f(h.y);
        return l += " Q" + f(d.x) + "," + f(d.y) + "," + f(e.x) + "," + f(e.y)
    },
    getMiddle: function (a, b) {
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    },
    getPointOnSegment: function (a, b, d) {
        return {
            x: a.x + (b.x - a.x) * d,
            y: a.y + (b.y - a.y) * d
        }
    }
});
AmCharts.Cuboid = AmCharts.Class({
    construct: function (a, b, d, e, f, g, h, j, k, l, m, o) {
        this.set = a.set();
        this.container = a;
        this.h = Math.round(d);
        this.w = Math.round(b);
        this.dx = e;
        this.dy = f;
        this.colors = g;
        this.alpha = h;
        this.bwidth = j;
        this.bcolor = k;
        this.balpha = l;
        this.colors = g;
        0 > b && 0 == m && (m = 180);
        0 > d && (270 == m && (m = 90), 0 == m && (m = 180));
        this.gradientRotation = m;
        0 == e && 0 == f && (this.cornerRadius = o);
        this.draw()
    },
    draw: function () {
        var a = this.set;
        a.clear();
        var b = this.container,
            d = this.w,
            e = this.h,
            f = this.dx,
            g = this.dy,
            h = this.colors,
            j = this.alpha,
            k = this.bwidth,
            l = this.bcolor,
            m = this.balpha,
            o = this.gradientRotation,
            p = this.cornerRadius;
        if (0 < f || 0 < g) {
            var n = h,
                q = h;
            "object" == typeof h && (n = h[0], q = h[h.length - 1]);
            var r = AmCharts.adjustLuminosity(n, -0.2),
                r = AmCharts.adjustLuminosity(n, -0.2),
                n = AmCharts.polygon(b, [0, f, d + f, d, 0], [0, g, g, 0, 0], r, j, 0, 0, 0, o);
            if (0 < m) var s = AmCharts.line(b, [0, f, d + f], [0, g, g], l, m, k);
            if (0 < Math.abs(e) && 0 < Math.abs(d)) {
                var t = AmCharts.polygon(b, [0, 0, d, d, 0], [0, e, e, 0, 0], r, j, 0, 0, 0, 0, o);
                t.translate(f, g);
                if (0 < m) var u = AmCharts.line(b, [f, f], [g, g + e], l, 1, k);
                var w = AmCharts.polygon(b, [0, 0, f, f, 0], [0, e, e + g, g, 0], r, j, 0, 0, 0, o),
                    A = AmCharts.polygon(b, [d, d, d + f, d + f, d], [0, e, e + g, g, 0], r, j, 0, 0, 0, o);
                if (0 < m) var C = AmCharts.line(b, [d, d + f, d + f, d], [0, g, e + g, e], l, m, k)
            }
            r = AmCharts.adjustLuminosity(q, 0.2);
            q = AmCharts.polygon(b, [0, f, d + f, d, 0], [e, e + g, e + g, e, e], r, 1, 0, 0, 0, o);
            if (0 < m) var v = AmCharts.line(b, [0, f, d + f], [e, e + g, e + g], l, m, k)
        }
        1 > Math.abs(e) && (e = 0);
        1 > Math.abs(d) && (d = 0);
        b = 0 == e ? AmCharts.line(b, [0, d], [0, 0], l, m, k) : 0 == d ? AmCharts.line(b, [0, 0], [0, e], l, m, k) : 0 < p ? AmCharts.rect(b, d, e, h, j, k, l, m, p, o) : AmCharts.polygon(b, [0, 0, d, d, 0], [0, e, e, 0, 0], h, j, k, l, m, o);
        e = 0 > e ? [n, s, t, u, w, A, C, q, v, b] : [q, v, t, u, w, A, n, s, C, b];
        for (s = 0; s < e.length; s++)(t = e[s]) && a.push(t)
    },
    width: function (a) {
        this.w = a;
        this.draw()
    },
    height: function (a) {
        this.h = a;
        this.draw()
    },
    animateHeight: function (a, b) {
        var d = this;
        d.easing = b;
        d.totalFrames = 1E3 * a / AmCharts.updateRate;
        d.rh = d.h;
        d.frame = 0;
        d.height(1);
        setTimeout(function () {
            d.updateHeight.call(d)
        }, AmCharts.updateRate)
    },
    updateHeight: function () {
        var a = this;
        a.frame++;
        var b = a.totalFrames;
        a.frame <= b && (b = a.easing(0, a.frame, 1, a.rh - 1, b), a.height(b), setTimeout(function () {
            a.updateHeight.call(a)
        }, AmCharts.updateRate))
    },
    animateWidth: function (a, b) {
        var d = this;
        d.easing = b;
        d.totalFrames = 1E3 * a / AmCharts.updateRate;
        d.rw = d.w;
        d.frame = 0;
        d.width(1);
        setTimeout(function () {
            d.updateWidth.call(d)
        }, AmCharts.updateRate)
    },
    updateWidth: function () {
        var a = this;
        a.frame++;
        var b = a.totalFrames;
        a.frame <= b && (b = a.easing(0, a.frame, 1, a.rw - 1, b), a.width(b), setTimeout(function () {
            a.updateWidth.call(a)
        }, AmCharts.updateRate))
    }
});
AmCharts.AmLegend = AmCharts.Class({
    construct: function () {
        this.createEvents("rollOverMarker", "rollOverItem", "rollOutMarker", "rollOutItem", "showItem", "hideItem", "clickMarker", "rollOverItem", "rollOutItem", "clickLabel");
        this.position = "bottom";
        this.borderColor = this.color = "#000000";
        this.borderAlpha = 0;
        this.markerLabelGap = 5;
        this.verticalGap = 10;
        this.align = "left";
        this.horizontalGap = 0;
        this.spacing = 10;
        this.markerDisabledColor = "#AAB3B3";
        this.markerType = "square";
        this.markerSize = 16;
        this.markerBorderAlpha;
        this.markerBorderThickness = 1;
        this.marginBottom = this.marginTop = 0;
        this.marginLeft = this.marginRight = 20;
        this.autoMargins = !0;
        this.valueWidth = 50;
        this.switchable = !0;
        this.switchType = "x";
        this.switchColor = "#FFFFFF";
        this.rollOverColor = "#CC0000";
        this.selectedColor;
        this.reversedOrder = !1;
        this.labelText = "[[title]]";
        this.valueText = "[[value]]";
        this.useMarkerColorForLabels = !1;
        this.rollOverGraphAlpha = 1;
        this.textClickEnabled = !1;
        this.equalWidths = !0;
        this.dateFormat = "DD-MM-YYYY";
        this.ly;
        this.lx
    },
    setData: function (a) {
        this.data = a;
        this.invalidateSize()
    },
    invalidateSize: function () {
        this.destroy();
        this.entries = [];
        this.valueLabels = [];
        AmCharts.ifArray(this.data) && this.drawLegend()
    },
    drawLegend: function () {
        var a = this.chart,
            b = this.position,
            d = this.width,
            e = a.realWidth,
            f = a.realHeight,
            g = this.div,
            h = this.data;
        isNaN(this.fontSize) && (this.fontSize = a.fontSize);
        if ("right" == b || "left" == b) this.maxColumns = 1, this.marginLeft = this.marginRight = 10;
        else if (this.autoMargins) {
            this.marginRight = a.marginRight;
            this.marginLeft = a.marginLeft;
            var j = a.autoMarginOffset;
            "bottom" == b ? (this.marginBottom = j, this.marginTop = 0) : (this.marginTop = j, this.marginBottom = 0)
        }
        this.divWidth = b = void 0 != d ? AmCharts.toCoordinate(d, e) : a.realWidth;
        g.style.width = b + "px";
        this.container = new AmCharts.AmDraw(g, b, f);
        this.lx = 0;
        this.ly = 8;
        f = this.markerSize;
        0 < f && (this.lx += f + this.markerLabelGap, this.ly = f / 2 - 2);
        this.titleWidth = 0;
        if (f = this.title) a = AmCharts.text(this.container, f, this.color, a.fontFamily, this.fontSize, "start", !0), a.translate(0, this.marginTop + this.verticalGap + this.ly), this.titleWidth = a.getBBox().width + 15;
        for (a = this.index = this.maxLabelWidth = 0; a < h.length; a++) this.createEntry(h[a]);
        for (a = this.index = 0; a < h.length; a++) this.createValue(h[a]);
        this.arrangeEntries();
        this.updateValues()
    },
    arrangeEntries: function () {
        var a = this.position,
            b = this.marginLeft + this.titleWidth,
            d = this.marginRight,
            e = this.marginTop,
            f = this.marginBottom,
            g = this.horizontalGap,
            h = this.div,
            j = this.divWidth,
            k = this.maxColumns,
            l = this.verticalGap,
            m = this.spacing,
            o = j - d - b,
            p = 0,
            n = 0,
            q = this.container,
            r = q.set();
        this.set = r;
        var s = q.set();
        r.push(s);
        s.translate(g, l);
        for (var t = this.entries, u = 0; u < t.length; u++) {
            var q = t[u].getBBox(),
                w = q.width;
            w > p && (p = w);
            q = q.height;
            q > n && (n = q)
        }
        for (var A = w = 0, C = g, u = 0; u < t.length; u++) {
            var v = t[u];
            this.reversedOrder && (v = t[t.length - u - 1]);
            var q = v.getBBox(),
                D;
            this.equalWidths ? D = g + A * (p + m + this.markerLabelGap) : (D = C, C = C + q.width + g + m);
            D + q.width > o && 0 < u && (w++, A = 0, D = g, C = D + q.width + g + m);
            v.translate(D, (n + l) * w);
            A++;
            !isNaN(k) && A >= k && (A = 0, w++);
            s.push(v)
        }
        q = s.getBBox();
        k = q.height + 2 * l - 1;
        "left" == a || "right" == a ? (g = q.width + 2 * g, h.style.width = g + b + d + "px") : g = j - b - d - 1;
        d = AmCharts.rect(this.container, g, k, this.backgroundColor, this.backgroundAlpha, 0, this.borderColor, this.borderAlpha);
        r.push(d);
        r.translate(b, e);
        d.toBack();
        if ("top" == a || "bottom" == a) "center" == this.align && r.translate(b + (g - q.width) / 2, 0), "right" == this.align && r.translate(b + g - q.width, 0);
        a = k + e + f + 1;
        0 > a && (a = 0);
        h.style.height = Math.round(a) + "px"
    },
    createEntry: function (a) {
        if (!1 !== a.visibleInLegend) {
            var b = this.chart,
                d = a.markerType;
            d || (d = this.markerType);
            var e = a.color,
                f = a.alpha;
            a.legendKeyColor && (e = a.legendKeyColor());
            a.legendKeyAlpha && (f = a.legendKeyAlpha());
            !0 == a.hidden && (e = this.markerDisabledColor);
            d = this.createMarker(d, e, f);
            this.addListeners(d, a);
            d = this.container.set([d]);
            if (f = this.switchType) {
                var g;
                g = "x" == f ? this.createX() : this.createV();
                g.dItem = a;
                !0 != a.hidden ? "x" == f ? g.hide() : g.show() : "x" != f && g.hide();
                this.switchable || g.hide();
                this.addListeners(g, a);
                a.legendSwitch = g;
                d.push(g)
            }
            f = this.color;
            a.showBalloon && this.textClickEnabled && void 0 != this.selectedColor && (f = this.selectedColor);
            this.useMarkerColorForLabels && (f = e);
            !0 == a.hidden && (f = this.markerDisabledColor);
            if (e = AmCharts.massReplace(this.labelText, {
                "[[title]]": a.title
            })) {
                var h = AmCharts.text(this.container, e, f, b.fontFamily, this.fontSize, "start");
                h.translate(this.lx, this.ly);
                d.push(h);
                b = h.getBBox().width;
                this.maxLabelWidth < b && (this.maxLabelWidth = b)
            }
            this.entries[this.index] = d;
            a.legendEntry = this.entries[this.index];
            a.legendLabel = h;
            this.index++
        }
    },
    addListeners: function (a, b) {
        var d = this;
        a && a.mouseover(function () {
            d.rollOverMarker(b)
        }).mouseout(function () {
            d.rollOutMarker(b)
        }).click(function () {
            d.clickMarker(b)
        })
    },
    rollOverMarker: function (a) {
        this.switchable && this.dispatch("rollOverMarker", a);
        this.dispatch("rollOverItem", a)
    },
    rollOutMarker: function (a) {
        this.switchable && this.dispatch("rollOutMarker", a);
        this.dispatch("rollOutItem", a)
    },
    clickMarker: function (a) {
        this.switchable ? !0 == a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a) : this.textClickEnabled && this.dispatch("clickMarker", a)
    },
    rollOverLabel: function (a) {
        a.hidden || (this.textClickEnabled && a.legendLabel && a.legendLabel.attr({
            fill: this.rollOverColor
        }), this.dispatch("rollOverItem", a))
    },
    rollOutLabel: function (a) {
        if (!a.hidden) {
            if (this.textClickEnabled && a.legendLabel) {
                var b = this.color;
                void 0 != this.selectedColor && a.showBalloon && (b = this.selectedColor);
                this.useMarkerColorForLabels && (b = a.lineColor, void 0 == b && (b = a.color));
                a.legendLabel.attr({
                    fill: b
                })
            }
            this.dispatch("rollOutItem", a)
        }
    },
    clickLabel: function (a) {
        this.textClickEnabled ? a.hidden || this.dispatch("clickLabel", a) : this.switchable && (!0 == a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a))
    },
    dispatch: function (a, b) {
        this.fire(a, {
            type: a,
            dataItem: b
        })
    },
    createValue: function (a) {
        var b = this,
            d = b.fontSize;
        if (!1 !== a.visibleInLegend) {
            var e = b.maxLabelWidth;
            b.equalWidths || (b.valueAlign = "left");
            "left" == b.valueAlign && (e = a.legendEntry.getBBox().width);
            var f = e;
            if (b.valueText) {
                var g = b.color;
                b.useMarkerColorForLabels && (g = a.color);
                !0 == a.hidden && (g = b.markerDisabledColor);
                var h = b.valueText,
                    e = e + b.lx + b.markerLabelGap + b.valueWidth,
                    j = "end";
                "left" == b.valueAlign && (e -= b.valueWidth, j = "start");
                g = AmCharts.text(b.container, h, g, b.chart.fontFamily, d, j);
                g.translate(e, b.ly);
                b.entries[b.index].push(g);
                f += b.valueWidth + b.markerLabelGap;
                g.dItem = a;
                b.valueLabels.push(g)
            }
            b.index++;
            g = b.markerSize;
            g < d + 3 && (g = d + 3);
            d = b.container.rect(b.markerSize + b.markerLabelGap, 0, f, g, 0, 0).attr({
                stroke: "none",
                fill: "#FFFFFF",
                "fill-opacity": 0.001
            });
            d.dItem = a;
            b.entries[b.index - 1].push(d);
            d.mouseover(function () {
                b.rollOverLabel(a)
            }).mouseout(function () {
                b.rollOutLabel(a)
            }).click(function () {
                b.clickLabel(a)
            })
        }
    },
    createV: function () {
        var a = this.markerSize;
        return AmCharts.polygon(this.container, [a / 5, a / 2, a - a / 5, a / 2], [a / 3, a - a / 5, a / 5, a / 1.7], this.switchColor)
    },
    createX: function () {
        var a = this.markerSize - 3,
            b = {
                stroke: this.switchColor,
                "stroke-width": 3
            },
            d = this.container,
            e = AmCharts.line(d, [3, a], [3, a]).attr(b),
            a = AmCharts.line(d, [3, a], [a, 3]).attr(b);
        return this.container.set([e, a])
    },
    createMarker: function (a, b, d) {
        var e = this.markerSize,
            f = this.container,
            g, h = this.markerBorderThickness,
            j = this.markerBorderAlpha;
        switch (a) {
        case "square":
            g = AmCharts.rect(f, e, e, b, d, h, b, j);
            break;
        case "circle":
            g = AmCharts.circle(f, e / 2, b, d, h, b, j);
            g.translate(e / 2, e / 2);
            break;
        case "line":
            g = AmCharts.line(f, [0, e], [e / 2, e / 2], b, d, h);
            break;
        case "dashedLine":
            g = AmCharts.line(f, [0, e], [e / 2, e / 2], b, d, h, 3);
            break;
        case "triangleUp":
            g = AmCharts.polygon(f, [0, e / 2, e, e], [e, 0, e, e], b, d, h, b, j);
            break;
        case "triangleDown":
            g = AmCharts.polygon(f, [0, e / 2, e, e], [0, e, 0, 0], b, d, h, b, j);
            break;
        case "bubble":
            g = AmCharts.circle(f, e / 2, b, d, h, b, j, !0), g.translate(e / 2, e / 2)
        }
        return g
    },
    validateNow: function () {
        this.invalidateSize()
    },
    updateValues: function () {
        for (var a = this.valueLabels, b = this.chart, d = 0; d < a.length; d++) {
            var e = a[d],
                f = e.dItem;
            if (void 0 != f.type) {
                var g = f.currentDataItem;
                if (g) {
                    var h = this.valueText;
                    f.legendValueText && (h = f.legendValueText);
                    f = h;
                    f = b.formatString(f, g);
                    e.text(f)
                } else e.text(" ")
            } else g = b.formatString(this.valueText, f), e.text(g)
        }
    },
    renderFix: function () {
        if (!AmCharts.VML) {
            var a = this.container;
            a && a.renderFix()
        }
    },
    destroy: function () {
        this.div.innerHTML = "";
        AmCharts.remove(this.set)
    }
});
AmCharts.AmBalloon = AmCharts.Class({
    construct: function () {
        this.enabled = !0;
        this.fillColor = "#CC0000";
        this.fillAlpha = 1;
        this.borderThickness = 2;
        this.borderColor = "#FFFFFF";
        this.borderAlpha = 1;
        this.cornerRadius = 6;
        this.maximumWidth = 220;
        this.horizontalPadding = 8;
        this.verticalPadding = 5;
        this.pointerWidth = 10;
        this.pointerOrientation = "V";
        this.color = "#FFFFFF";
        this.textShadowColor = "#000000";
        this.adjustBorderColor = !1;
        this.showBullet = !0;
        this.show = this.follow = !1;
        this.bulletSize = 3
    },
    draw: function () {
        var a = this.pointToX,
            b = this.pointToY;
        if (!isNaN(a)) {
            var d = this.chart,
                e = d.container,
                f = this.set;
            AmCharts.remove(f);
            AmCharts.remove(this.pointer);
            this.set = f = e.set();
            d.balloonsSet.push(f);
            if (this.show) {
                var g = this.l,
                    h = this.t,
                    j = this.r,
                    k = this.b,
                    l = this.textShadowColor;
                this.color == l && (l = null);
                var m = this.balloonColor,
                    o = this.fillColor,
                    p = this.borderColor;
                void 0 != m && (this.adjustBorderColor ? p = m : o = m);
                var n = this.horizontalPadding,
                    q = this.verticalPadding,
                    m = this.pointerWidth,
                    r = this.pointerOrientation,
                    s = this.cornerRadius,
                    t = d.fontFamily,
                    u = this.fontSize;
                void 0 == u && (u = d.fontSize);
                d = AmCharts.text(e, this.text, this.color, t, u);
                f.push(d);
                if (void 0 != l) {
                    var w = AmCharts.text(e, this.text, l, t, u, "middle", !1, 0.4);
                    f.push(w)
                }
                l = d.getBBox();
                f = l.height + 2 * q;
                l = l.width + 2 * n;
                window.opera && (f += 2);
                n = l / 2;
                q = f / 2 - 2;
                d.translate(n, q);
                w && w.translate(n + 1, q + 1);
                "H" != r ? (q = a - l / 2, n = b < h + f + 10 && "down" != r ? b + m : b - f - m) : (2 * m > f && (m = f / 2), n = b - f / 2, q = a < g + (j - g) / 2 ? a + m : a - l - m);
                n + f >= k && (n = k - f);
                n < h && (n = h);
                q < g && (q = g);
                q + l > j && (q = j - l);
                0 < s || 0 == m ? (p = AmCharts.rect(e, l, f, o, this.fillAlpha, this.borderThickness, p, this.borderAlpha, this.cornerRadius), this.showBullet && (e = AmCharts.circle(e, this.bulletSize, o, this.fillAlpha), e.translate(a, b), this.pointer = e)) : (k = [], s = [], "H" != r ? (g = a - q, g > l - m && (g = l - m), g < m && (g = m), k = [0, g - m, a - q, g + m, l, l, 0, 0], s = b < h + f + 10 && "down" != r ? [0, 0, b - n, 0, 0, f, f, 0] : [f, f, b - n, f, f, 0, 0, f]) : (h = b - n, h > f - m && (h = f - m), h < m && (h = m), s = [0, h - m, b - n, h + m, f, f, 0, 0], k = a < g + (j - g) / 2 ? [0, 0, a - q, 0, 0, l, l, 0] : [l, l, a - q, l, l, 0, 0, l]), p = AmCharts.polygon(e, k, s, o, this.fillAlpha, this.borderThickness, p, this.borderAlpha));
                this.set.push(p);
                p.toFront();
                w && w.toFront();
                d.toFront();
                this.set.translate(q, n);
                l = p.getBBox();
                this.bottom = n + l.y + l.height;
                this.yPos = l.y + n
            }
        }
    },
    followMouse: function () {
        if (this.follow && this.show) {
            var a = this.chart.mouseX,
                b = this.chart.mouseY;
            this.pointToX = a;
            this.pointToY = b;
            if (a != this.previousX || b != this.previousY) if (this.previousX = a, this.previousY = b, 0 == this.cornerRadius) this.draw();
            else {
                var d = this.set;
                if (d) {
                    var e = d.getBBox(),
                        a = a - e.width / 2,
                        f = b - e.height - 10;
                    a < this.l && (a = this.l);
                    a > this.r - e.width && (a = this.r - e.width);
                    f < this.t && (f = b + 10);
                    d.translate(a, f)
                }
            }
        }
    },
    changeColor: function (a) {
        this.balloonColor = a
    },
    setBounds: function (a, b, d, e) {
        this.l = a;
        this.t = b;
        this.r = d;
        this.b = e
    },
    showBalloon: function (a) {
        this.text = a;
        this.show = !0;
        this.draw()
    },
    hide: function () {
        this.follow = this.show = !1;
        this.destroy()
    },
    setPosition: function (a, b, d) {
        this.pointToX = a;
        this.pointToY = b;
        d && (a != this.previousX || b != this.previousY) && this.draw();
        this.previousX = a;
        this.previousY = b
    },
    followCursor: function (a) {
        var b = this;
        (b.follow = a) ? (b.pShowBullet = b.showBullet, b.showBullet = !1) : void 0 != b.pShowBullet && (b.showBullet = b.pShowBullet);
        clearInterval(b.interval);
        var d = b.chart.mouseX,
            e = b.chart.mouseY;
        !isNaN(d) && a && (b.pointToX = d, b.pointToY = e, b.interval = setInterval(function () {
            b.followMouse.call(b)
        }, 40))
    },
    destroy: function () {
        clearInterval(this.interval);
        AmCharts.remove(this.set);
        AmCharts.remove(this.pointer)
    }
});
AmCharts.AmCoordinateChart = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function () {
        AmCharts.AmCoordinateChart.base.construct.call(this);
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem");
        this.plotAreaFillColors = "#FFFFFF";
        this.plotAreaFillAlphas = 0;
        this.plotAreaBorderColor = "#000000";
        this.plotAreaBorderAlpha = 0;
        this.startAlpha = 1;
        this.startDuration = 0;
        this.startEffect = "elastic";
        this.sequencedAnimation = !0;
        this.colors = "#FF6600,#FCD202,#B0DE09,#0D8ECF,#2A0CD0,#CD0D74,#CC0000,#00CC00,#0000CC,#DDDDDD,#999999,#333333,#990000".split(",");
        this.balloonDateFormat = "MMM DD, YYYY";
        this.valueAxes = [];
        this.graphs = []
    },
    initChart: function () {
        AmCharts.AmCoordinateChart.base.initChart.call(this);
        this.createValueAxes();
        var a = this.legend;
        a && a.setData(this.graphs)
    },
    createValueAxes: function () {
        0 == this.valueAxes.length && this.addValueAxis(new AmCharts.ValueAxis)
    },
    parseData: function () {
        this.processValueAxes();
        this.processGraphs()
    },
    parseSerialData: function () {
        AmCharts.AmSerialChart.base.parseData.call(this);
        var a = this.graphs,
            b = this.seriesIdField;
        b || (b = this.categoryField);
        this.chartData = [];
        var d = this.dataProvider;
        if (d) {
            var e = !1;
            this.categoryAxis && (e = this.categoryAxis.parseDates);
            if (e) var f = AmCharts.extractPeriod(this.categoryAxis.minPeriod),
                g = f.period,
                f = f.count;
            var h = {};
            this.lookupTable = h;
            for (var j = 0; j < d.length; j++) {
                var k = {},
                    l = d[j],
                    m = l[this.categoryField];
                k.category = m;
                h[l[b]] = k;
                e && (m = new Date(m), m = AmCharts.resetDateToMin(m, g, f), k.category = m, k.time = m.getTime());
                var o = this.valueAxes;
                k.axes = {};
                k.x = {};
                for (var p = 0; p < o.length; p++) {
                    var n = o[p].id;
                    k.axes[n] = {};
                    k.axes[n].graphs = {};
                    for (var q = 0; q < a.length; q++) {
                        var m = a[q],
                            r = m.id,
                            s = m.periodValue;
                        if (m.valueAxis.id == n) {
                            k.axes[n].graphs[r] = {};
                            var t = {};
                            t.index = j;
                            t.values = this.processValues(l, m, s);
                            this.processFields(m, t, l);
                            t.category = k.category;
                            t.serialDataItem = k;
                            t.graph = m;
                            k.axes[n].graphs[r] = t
                        }
                    }
                }
                this.chartData[j] = k
            }
        }
        for (b = 0; b < a.length; b++) m = a[b], m.dataProvider && this.parseGraphData(m)
    },
    processValues: function (a, b, d) {
        var e = {},
            f = Number(a[b.valueField + d]);
        isNaN(f) || (e.value = f);
        f = Number(a[b.openField + d]);
        isNaN(f) || (e.open = f);
        f = Number(a[b.closeField + d]);
        isNaN(f) || (e.close = f);
        f = Number(a[b.lowField + d]);
        isNaN(f) || (e.low = f);
        f = Number(a[b.highField + d]);
        isNaN(f) || (e.high = f);
        return e
    },
    parseGraphData: function (a) {
        var b = a.dataProvider,
            d = a.seriesIdField;
        d || (d = this.seriesIdField);
        d || (d = this.categoryField);
        for (var e = 0; e < b.length; e++) {
            var f = b[e],
                g = this.lookupTable["" + f[d]],
                h = a.valueAxis.id;
            g && (h = g.axes[h].graphs[a.id], h.serialDataItem = g, h.values = this.processValues(f, a, a.periodValue), this.processFields(a, h, f))
        }
    },
    addValueAxis: function (a) {
        a.chart = this;
        this.valueAxes.push(a);
        this.validateData()
    },
    removeValueAxesAndGraphs: function () {
        for (var a = this.valueAxes, b = a.length - 1; - 1 < b; b--) this.removeValueAxis(a[b])
    },
    removeValueAxis: function (a) {
        var b = this.graphs,
            d;
        for (d = b.length - 1; 0 <= d; d--) {
            var e = b[d];
            e && e.valueAxis == a && this.removeGraph(e)
        }
        b = this.valueAxes;
        for (d = b.length - 1; 0 <= d; d--) b[d] == a && b.splice(d, 1);
        this.validateData()
    },
    addGraph: function (a) {
        this.graphs.push(a);
        this.chooseGraphColor(a, this.graphs.length - 1);
        this.validateData()
    },
    removeGraph: function (a) {
        for (var b = this.graphs, d = b.length - 1; 0 <= d; d--) b[d] == a && (b.splice(d, 1), a.destroy());
        this.validateData()
    },
    processValueAxes: function () {
        for (var a = this.valueAxes, b = 0; b < a.length; b++) {
            var d = a[b];
            d.chart = this;
            d.id || (d.id = "valueAxis" + b);
            if (!0 === this.usePrefixes || !1 === this.usePrefixes) d.usePrefixes = this.usePrefixes
        }
    },
    processGraphs: function () {
        for (var a = this.graphs, b = 0; b < a.length; b++) {
            var d = a[b];
            d.chart = this;
            d.valueAxis || (d.valueAxis = this.valueAxes[0]);
            d.id || (d.id = "graph" + b)
        }
    },
    formatString: function (a, b) {
        var d = b.graph,
            e = d.valueAxis;
        e.duration && b.values.value && (e = AmCharts.formatDuration(b.values.value, e.duration, "", e.durationUnits, e.maxInterval, e.numberFormatter), a = a.split("[[value]]").join(e));
        a = AmCharts.massReplace(a, {
            "[[title]]": d.title,
            "[[description]]": b.description,
            "<br>": "\n"
        });
        return a = AmCharts.cleanFromEmpty(a)
    },
    getBalloonColor: function (a, b) {
        var d = a.lineColor,
            e = a.balloonColor,
            f = a.fillColors;
        "object" == typeof f ? d = f[0] : void 0 != f && (d = f);
        if (b.isNegative) {
            var f = a.negativeLineColor,
                g = a.negativeFillColors;
            "object" == typeof g ? f = g[0] : void 0 != g && (f = g);
            void 0 != f && (d = f)
        }
        void 0 != b.color && (d = b.color);
        void 0 == e && (e = d);
        return e
    },
    getGraphById: function (a) {
        for (var b, d = this.graphs, e = 0; e < d.length; e++) {
            var f = d[e];
            f.id == a && (b = f)
        }
        return b
    },
    processFields: function (a, b, d) {
        if (a.itemColors) {
            var e = a.itemColors,
                f = b.index;
            b.color = f < e.length ? e[f] : AmCharts.randomColor()
        }
        e = "color,alpha,fillColors,description,bullet,customBullet,bulletSize,bulletConfig,url".split(",");
        for (f = 0; f < e.length; f++) {
            var g = e[f],
                h = a[g + "Field"];
            h && (h = d[h], AmCharts.isDefined(h) && (b[g] = h))
        }
        b.dataContext = d
    },
    chooseGraphColor: function (a, b) {
        if (void 0 == a.lineColor) {
            var d;
            d = this.colors.length > b ? this.colors[b] : AmCharts.randomColor();
            a.lineColor = d
        }
    },
    handleLegendEvent: function (a) {
        var b = a.type;
        if (a = a.dataItem) {
            var d = a.hidden,
                e = a.showBalloon;
            switch (b) {
            case "clickMarker":
                e ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
                break;
            case "clickLabel":
                e ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
                break;
            case "rollOverItem":
                d || this.highlightGraph(a);
                break;
            case "rollOutItem":
                d || this.unhighlightGraph();
                break;
            case "hideItem":
                this.hideGraph(a);
                break;
            case "showItem":
                this.showGraph(a)
            }
        }
    },
    highlightGraph: function (a) {
        var b = this.graphs,
            d, e = 0.2;
        this.legend && (e = this.legend.rollOverGraphAlpha);
        for (d = 0; d < b.length; d++) {
            var f = b[d];
            f != a && f.changeOpacity(e)
        }
    },
    unhighlightGraph: function () {
        for (var a = this.graphs, b = 0; b < a.length; b++) a[b].changeOpacity(1)
    },
    showGraph: function (a) {
        a.hidden = !1;
        this.initChart()
    },
    hideGraph: function (a) {
        a.hidden = !0;
        this.initChart()
    },
    hideGraphsBalloon: function (a) {
        a.showBalloon = !1;
        this.updateLegend()
    },
    showGraphsBalloon: function (a) {
        a.showBalloon = !0;
        this.updateLegend()
    },
    updateLegend: function () {
        this.legend && this.legend.invalidateSize()
    },
    animateAgain: function () {
        var a = this.graphs;
        if (a) for (var b = 0; b < a.length; b++) a[b].animationPlayed = !1
    }
});
AmCharts.AmRectangularChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart,
    construct: function () {
        AmCharts.AmRectangularChart.base.construct.call(this);
        this.createEvents("zoomed");
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 20;
        this.verticalPosition = this.horizontalPosition = this.depth3D = this.angle = 0;
        this.heightMultiplyer = this.widthMultiplyer = 1;
        this.zoomOutText = "Show all";
        this.zbSet;
        this.zoomOutButton = {
            backgroundColor: "#b2e1ff",
            backgroundAlpha: 1
        };
        this.trendLines = [];
        this.autoMargins = !0;
        this.marginsUpdated = !1;
        this.autoMarginOffset = 10
    },
    initChart: function () {
        AmCharts.AmRectangularChart.base.initChart.call(this);
        this.updateDxy();
        var a = !0;
        !this.marginsUpdated && this.autoMargins && (this.resetMargins(), a = !1);
        this.updateMargins();
        this.updatePlotArea();
        this.updateScrollbars();
        this.updateTrendLines();
        this.updateChartCursor();
        this.updateValueAxes();
        a && (this.scrollbarOnly || this.updateGraphs())
    },
    drawChart: function () {
        AmCharts.AmRectangularChart.base.drawChart.call(this);
        this.drawPlotArea();
        if (AmCharts.ifArray(this.chartData)) {
            var a = this.chartCursor;
            a && a.draw();
            a = this.zoomOutText;
            "" != a && a && this.drawZoomOutButton()
        }
    },
    resetMargins: function () {
        var a = {};
        if ("serial" == this.chartType) {
            for (var b = this.valueAxes, d = 0; d < b.length; d++) {
                var e = b[d];
                e.ignoreAxisWidth || (e.setOrientation(this.rotate), e.fixAxisPosition(), a[e.position] = !0)
            }
            if ((d = this.categoryAxis) && !d.ignoreAxisWidth) d.setOrientation(!this.rotate), d.fixAxisPosition(), d.fixAxisPosition(), a[d.position] = !0
        } else {
            e = this.xAxes;
            b = this.yAxes;
            for (d = 0; d < e.length; d++) {
                var f = e[d];
                f.ignoreAxisWidth || (f.setOrientation(!0), f.fixAxisPosition(), a[f.position] = !0)
            }
            for (d = 0; d < b.length; d++) e = b[d], e.ignoreAxisWidth || (e.setOrientation(!1), e.fixAxisPosition(), a[e.position] = !0)
        }
        a.left && (this.marginLeft = 0);
        a.right && (this.marginRight = 0);
        a.top && (this.marginTop = 0);
        a.bottom && (this.marginBottom = 0);
        this.fixMargins = a
    },
    measureMargins: function () {
        var a = this.valueAxes,
            b, d = this.autoMarginOffset,
            e = this.fixMargins,
            f = this.realWidth,
            g = this.realHeight,
            h = d,
            j = d,
            k = f - d;
        b = g - d;
        for (var l = 0; l < a.length; l++) b = this.getAxisBounds(a[l], h, k, j, b), h = b.l, k = b.r, j = b.t, b = b.b;
        if (a = this.categoryAxis) b = this.getAxisBounds(a, h, k, j, b), h = b.l, k = b.r, j = b.t, b = b.b;
        e.left && h < d && (this.marginLeft = Math.round(-h + d));
        e.right && k > f - d && (this.marginRight = Math.round(k - f + d));
        e.top && j < d && (this.marginTop = Math.round(this.marginTop - j + d + this.titleHeight));
        e.bottom && b > g - d && (this.marginBottom = Math.round(b - g + d));
        this.animateAgain();
        this.initChart()
    },
    getAxisBounds: function (a, b, d, e, f) {
        if (!a.ignoreAxisWidth) {
            var g = a.labelsSet,
                h = a.tickLength;
            a.inside && (h = 0);
            if (g) switch (g = a.getBBox(), a.position) {
            case "top":
                a = g.y;
                e > a && (e = a);
                break;
            case "bottom":
                a = g.y + g.height;
                f < a && (f = a);
                break;
            case "right":
                a = g.x + g.width + h + 3;
                d < a && (d = a);
                break;
            case "left":
                a = g.x - h, b > a && (b = a)
            }
        }
        return {
            l: b,
            t: e,
            r: d,
            b: f
        }
    },
    drawZoomOutButton: function () {
        var a = this,
            b = a.container.set();
        a.zoomButtonSet.push(b);
        var d = a.color,
            e = a.fontSize,
            f = a.zoomOutButton;
        if (f && (f.fontSize && (e = f.fontSize), f.color)) d = f.color;
        d = AmCharts.text(a.container, a.zoomOutText, d, a.fontFamily, e, "start");
        e = d.getBBox();
        d.translate(29, 6 + e.height / 2);
        f = AmCharts.rect(a.container, e.width + 40, e.height + 15, f.backgroundColor, f.backgroundAlpha);
        b.push(f);
        a.zbBG = f;
        void 0 != a.pathToImages && (f = a.container.image(a.pathToImages + "lens.png", 0, 0, 16, 16), f.translate(7, e.height / 2 - 1), f.toFront(), b.push(f));
        d.toFront();
        b.push(d);
        f = b.getBBox();
        b.translate(a.marginLeftReal + a.plotAreaWidth - f.width, a.marginTopReal);
        b.hide();
        b.mouseover(function () {
            a.rollOverZB()
        }).mouseout(function () {
            a.rollOutZB()
        }).click(function () {
            a.clickZB()
        }).touchstart(function () {
            a.rollOverZB()
        }).touchend(function () {
            a.rollOutZB();
            a.clickZB()
        });
        for (f = 0; f < b.length; f++) b[f].attr({
            cursor: "pointer"
        });
        a.zbSet = b
    },
    rollOverZB: function () {
        this.zbBG.show()
    },
    rollOutZB: function () {
        this.zbBG.hide()
    },
    clickZB: function () {
        this.zoomOut()
    },
    zoomOut: function () {
        this.updateScrollbar = !0;
        this.zoom()
    },
    drawPlotArea: function () {
        var a = this.dx,
            b = this.dy,
            d = this.marginLeftReal,
            e = this.marginTopReal,
            f = this.plotAreaWidth,
            g = this.plotAreaHeight,
            h = this.plotAreaFillColors,
            j = this.plotAreaFillAlphas;
        this.trendLinesSet.clipRect(d, e, f, g);
        "object" == typeof j && (j = j[0]);
        h = this.plotAreaBorderAlpha;
        0 < j && 0 < h && (h = AmCharts.rect(this.container, f, g, this.plotAreaFillColors, j, 1, this.plotAreaBorderColor, this.plotAreaBorderAlpha), h.translate(d, e), this.set.push(h), 0 != a && 0 != b && (h.translate(a, b), h = this.plotAreaFillColors, "object" == typeof h && (h = h[0]), h = AmCharts.adjustLuminosity(h, -0.15), j = {
            fill: h,
            "fill-opacity": j,
            stroke: this.plotAreaBorderColor,
            "stroke-opacity": this.plotAreaBorderAlpha
        }, f = this.container.path(["M", 0, 0, "L", a, b, "L", f + a, b, "L", f, 0, "L", 0, 0, "Z"]).attr(j), f.translate(d, e + g), this.set.push(f), a = this.container.path(["M", 0, 0, "L", 0, g, "L", a, g + b, "L", a, b, "L", 0, 0, "Z"]).attr(j), a.translate(d, e), this.set.push(a)))
    },
    updatePlotArea: function () {
        this.realWidth = this.updateWidth() - 1;
        this.realHeight = this.updateHeight() - 1;
        var a = this.realWidth - this.marginLeftReal - this.marginRightReal - this.dx,
            b = this.realHeight - this.marginTopReal - this.marginBottomReal;
        1 > a && (a = 1);
        1 > b && (b = 1);
        this.plotAreaWidth = Math.round(a);
        this.plotAreaHeight = Math.round(b)
    },
    updateDxy: function () {
        this.dx = this.depth3D * Math.cos(this.angle * Math.PI / 180);
        this.dy = -this.depth3D * Math.sin(this.angle * Math.PI / 180)
    },
    updateMargins: function () {
        var a = this.getTitleHeight();
        this.titleHeight = a;
        this.marginTopReal = this.marginTop - this.dy + a;
        this.marginBottomReal = this.marginBottom;
        this.marginLeftReal = this.marginLeft;
        this.marginRightReal = this.marginRight
    },
    updateValueAxes: function () {
        for (var a = this.valueAxes, b = this.marginLeftReal, d = this.marginTopReal, e = this.plotAreaHeight, f = this.plotAreaWidth, g = 0; g < a.length; g++) {
            var h = a[g];
            h.axisRenderer = AmCharts.RecAxis;
            h.guideFillRenderer = AmCharts.RecFill;
            h.axisItemRenderer = AmCharts.RecItem;
            h.dx = this.dx;
            h.dy = this.dy;
            h.viW = f;
            h.viH = e;
            h.marginsChanged = !0;
            h.viX = b;
            h.viY = d;
            this.updateObjectSize(h)
        }
    },
    updateObjectSize: function (a) {
        a.width = this.plotAreaWidth * this.widthMultiplyer;
        a.height = this.plotAreaHeight * this.heightMultiplyer;
        a.x = this.marginLeftReal + this.horizontalPosition;
        a.y = this.marginTopReal + this.verticalPosition
    },
    updateGraphs: function () {
        for (var a = this.graphs, b = 0; b < a.length; b++) {
            var d = a[b];
            d.x = this.marginLeftReal + this.horizontalPosition;
            d.y = this.marginTopReal + this.verticalPosition;
            d.width = this.plotAreaWidth * this.widthMultiplyer;
            d.height = this.plotAreaHeight * this.heightMultiplyer;
            d.index = b;
            d.dx = this.dx;
            d.dy = this.dy;
            d.rotate = this.rotate;
            d.chartType = this.chartType
        }
    },
    updateChartCursor: function () {
        var a = this.chartCursor;
        a && (a.x = this.marginLeftReal, a.y = this.marginTopReal, a.width = this.plotAreaWidth, a.height = this.plotAreaHeight, a.chart = this)
    },
    updateScrollbars: function () {},
    addChartCursor: function (a) {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        a && (this.listenTo(a, "changed", this.handleCursorChange), this.listenTo(a, "zoomed", this.handleCursorZoom));
        this.chartCursor = a
    },
    removeChartCursor: function () {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        this.chartCursor = null
    },
    zoomTrendLines: function () {
        var a = this.trendLines;
        for (i = 0; i < a.length; i++) {
            var b = a[i];
            b.valueAxis.recalculateToPercents ? b.set && b.set.hide() : (b.x = this.marginLeftReal + this.horizontalPosition, b.y = this.marginTopReal + this.verticalPosition, b.draw())
        }
    },
    addTrendLine: function (a) {
        this.trendLines.push(a)
    },
    removeTrendLine: function (a) {
        for (var b = this.trendLines, d = b.length - 1; 0 <= d; d--) b[d] == a && b.splice(d, 1)
    },
    adjustMargins: function (a, b) {
        var d = a.scrollbarHeight;
        "top" == a.position ? b ? this.marginLeftReal += d : this.marginTopReal += d : b ? this.marginRightReal += d : this.marginBottomReal += d
    },
    getScrollbarPosition: function (a, b, d) {
        a.position = b ? "bottom" == d || "left" == d ? "bottom" : "top" : "top" == d || "right" == d ? "bottom" : "top"
    },
    updateChartScrollbar: function (a, b) {
        if (a) {
            a.rotate = b;
            var d = this.marginTopReal,
                e = this.marginLeftReal,
                f = a.scrollbarHeight,
                g = this.dx,
                h = this.dy;
            "top" == a.position ? b ? (a.y = d, a.x = e - f) : (a.y = d - f + h, a.x = e + g) : b ? (a.y = d + h, a.x = e + this.plotAreaWidth + g) : (a.y = d + this.plotAreaHeight + 1, a.x = this.marginLeftReal)
        }
    },
    showZB: function (a) {
        var b = this.zbSet;
        b && (a ? b.show() : b.hide(), this.zbBG.hide())
    },
    handleReleaseOutside: function (a) {
        AmCharts.AmRectangularChart.base.handleReleaseOutside.call(this, a);
        (a = this.chartCursor) && a.handleReleaseOutside()
    },
    handleMouseDown: function (a) {
        AmCharts.AmRectangularChart.base.handleMouseDown.call(this, a);
        var b = this.chartCursor;
        b && b.handleMouseDown(a)
    },
    handleCursorChange: function () {}
});
AmCharts.TrendLine = AmCharts.Class({
    construct: function () {
        this.createEvents("click");
        this.isProtected = !1;
        this.dashLength = 0;
        this.lineColor = "#00CC00";
        this.lineThickness = this.lineAlpha = 1
    },
    draw: function () {
        var a = this;
        a.destroy();
        var b = a.chart,
            d = b.container,
            e, f, g, h, j = a.categoryAxis,
            k = a.initialDate,
            l = a.initialCategory,
            m = a.finalDate,
            o = a.finalCategory,
            p = a.valueAxis,
            n = a.valueAxisX,
            q = a.initialXValue,
            r = a.finalXValue,
            s = a.initialValue,
            t = a.finalValue,
            u = p.recalculateToPercents;
        j && (k && (e = j.dateToCoordinate(k)), l && (e = j.categoryToCoordinate(l)), m && (f = j.dateToCoordinate(m)), o && (f = j.categoryToCoordinate(o)));
        n && !u && (isNaN(q) || (e = n.getCoordinate(q)), isNaN(r) || (f = n.getCoordinate(r)));
        p && !u && (isNaN(s) || (g = p.getCoordinate(s)), isNaN(t) || (h = p.getCoordinate(t)));
        !isNaN(e) && !isNaN(f) && !isNaN(g) && !isNaN(g) && (b.rotate ? (j = [g, h], f = [e, f]) : (j = [e, f], f = [g, h]), g = a.lineColor, e = AmCharts.line(d, j, f, g, a.lineAlpha, a.lineThickness, a.dashLength), f = AmCharts.line(d, j, f, g, 0.005, 5), d = d.set([e, f]), d.translate(b.marginLeftReal, b.marginTopReal), b.trendLinesSet.push(d), a.line = e, a.set = d, f.mouseup(function () {
            a.handleLineClick()
        }).mouseover(function () {
            a.handleLineOver()
        }).mouseout(function () {
            a.handleLineOut()
        }))
    },
    handleLineClick: function () {
        var a = {
            type: "click",
            trendLine: this
        };
        this.fire(a.type, a)
    },
    handleLineOver: function () {
        var a = this.rollOverColor;
        void 0 != a && this.line.attr({
            stroke: a
        })
    },
    handleLineOut: function () {
        this.line.attr({
            stroke: this.lineColor
        })
    },
    destroy: function () {
        AmCharts.remove(this.set)
    }
});
AmCharts.AmSerialChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart,
    construct: function () {
        AmCharts.AmSerialChart.base.construct.call(this);
        this.createEvents("changed");
        this.columnSpacing = 5;
        this.columnWidth = 0.8;
        this.updateScrollbar = !0;
        var a = new AmCharts.CategoryAxis;
        a.chart = this;
        this.categoryAxis = a;
        this.chartType = "serial";
        this.zoomOutOnDataUpdate = !0;
        this.skipZoom = !1
    },
    initChart: function () {
        AmCharts.AmSerialChart.base.initChart.call(this);
        this.updateCategoryAxis();
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.updateScrollbar = !0;
        this.drawChart();
        this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins())
    },
    validateData: function (a) {
        this.marginsUpdated = !1;
        this.zoomOutOnDataUpdate && !a && (this.endTime = this.end = this.startTime = this.start = NaN);
        AmCharts.AmSerialChart.base.validateData.call(this)
    },
    drawChart: function () {
        AmCharts.AmSerialChart.base.drawChart.call(this);
        var a = this.chartData;
        if (AmCharts.ifArray(a)) {
            var b = this.chartScrollbar;
            b && b.draw();
            var b = a.length - 1,
                d, e;
            d = this.categoryAxis;
            if (d.parseDates && !d.equalSpacing) {
                if (d = this.startTime, e = this.endTime, isNaN(d) || isNaN(e)) d = a[0].time, e = a[b].time
            } else if (d = this.start, e = this.end, isNaN(d) || isNaN(e)) d = 0, e = b;
            this.endTime = this.startTime = this.end = this.start = void 0;
            this.zoom(d, e)
        } else this.cleanChart();
        this.chartCreated = !0;
        this.dispDUpd()
    },
    cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.categoryAxis, this.chartScrollbar, this.chartCursor])
    },
    updateCategoryAxis: function () {
        var a = this.categoryAxis;
        a.id = "categoryAxis";
        a.rotate = this.rotate;
        a.axisRenderer = AmCharts.RecAxis;
        a.guideFillRenderer = AmCharts.RecFill;
        a.axisItemRenderer = AmCharts.RecItem;
        a.setOrientation(!this.rotate);
        a.x = this.marginLeftReal;
        a.y = this.marginTopReal;
        a.dx = this.dx;
        a.dy = this.dy;
        a.width = this.plotAreaWidth;
        a.height = this.plotAreaHeight;
        a.viW = this.plotAreaWidth;
        a.viH = this.plotAreaHeight;
        a.viX = this.marginLeftReal;
        a.viY = this.marginTopReal;
        a.marginsChanged = !0
    },
    updateValueAxes: function () {
        AmCharts.AmSerialChart.base.updateValueAxes.call(this);
        for (var a = this.valueAxes, b = 0; b < a.length; b++) {
            var d = a[b],
                e = this.rotate;
            d.rotate = e;
            d.setOrientation(e);
            e = this.categoryAxis;
            if (!e.startOnAxis || e.parseDates) d.expandMinMax = !0
        }
    },
    updateData: function () {
        this.parseData();
        var a = this.countColumns(),
            b = this.chartCursor;
        b && b.updateData();
        for (var b = this.graphs, d = 0; d < b.length; d++) {
            var e = b[d];
            e.columnCount = a;
            e.data = this.chartData
        }
    },
    updateMargins: function () {
        AmCharts.AmSerialChart.base.updateMargins.call(this);
        var a = this.chartScrollbar;
        a && (this.getScrollbarPosition(a, this.rotate, this.categoryAxis.position), this.adjustMargins(a, this.rotate))
    },
    updateScrollbars: function () {
        this.updateChartScrollbar(this.chartScrollbar, this.rotate)
    },
    zoom: function (a, b) {
        var d = this.categoryAxis;
        d.parseDates && !d.equalSpacing ? this.timeZoom(a, b) : this.indexZoom(a, b);
        this.updateColumnsDepth()
    },
    timeZoom: function (a, b) {
        var d = this.maxSelectedTime;
        if (!isNaN(d) && (b != this.endTime && b - a > d && (a = b - d, this.updateScrollbar = !0), a != this.startTime && b - a > d)) b = a + d, this.updateScrollbar = !0;
        var e = this.chartData,
            f = this.categoryAxis;
        if (AmCharts.ifArray(e) && (a != this.startTime || b != this.endTime)) {
            var g = f.minDuration(),
                h = e[0].time;
            this.firstTime = h;
            var j = e[e.length - 1].time;
            this.lastTime = j;
            a || (a = h, isNaN(d) || (a = j - d));
            b || (b = j);
            a > j && (a = j);
            b < h && (b = h);
            a < h && (a = h);
            b > j && (b = j);
            b < a && (b = a + g);
            this.startTime = a;
            this.endTime = b;
            d = e.length - 1;
            g = this.getClosestIndex(e, "time", a, !0, 0, d);
            e = this.getClosestIndex(e, "time", b, !1, g, d);
            f.timeZoom(a, b);
            f.zoom(g, e);
            this.start = AmCharts.fitToBounds(g, 0, d);
            this.end = AmCharts.fitToBounds(e, 0, d);
            this.zoomAxesAndGraphs();
            this.zoomScrollbar();
            a != h || b != j ? this.showZB(!0) : this.showZB(!1);
            this.dispatchTimeZoomEvent()
        }
    },
    indexZoom: function (a, b) {
        var d = this.maxSelectedSeries;
        if (!isNaN(d) && (b != this.end && b - a > d && (a = b - d, this.updateScrollbar = !0), a != this.start && b - a > d)) b = a + d, this.updateScrollbar = !0;
        if (a != this.start || b != this.end) {
            var e = this.chartData.length - 1;
            isNaN(a) && (a = 0, isNaN(d) || (a = e - d));
            isNaN(b) && (b = e);
            b < a && (b = a);
            b > e && (b = e);
            a > e && (a = e - 1);
            0 > a && (a = 0);
            this.start = a;
            this.end = b;
            this.categoryAxis.zoom(a, b);
            this.zoomAxesAndGraphs();
            this.zoomScrollbar();
            0 != a || b != this.chartData.length - 1 ? this.showZB(!0) : this.showZB(!1);
            this.dispatchIndexZoomEvent()
        }
    },
    updateGraphs: function () {
        AmCharts.AmSerialChart.base.updateGraphs.call(this);
        for (var a = this.graphs, b = 0; b < a.length; b++) {
            var d = a[b];
            d.columnWidth = this.columnWidth;
            d.categoryAxis = this.categoryAxis
        }
    },
    updateColumnsDepth: function () {
        var a, b = this.graphs;
        AmCharts.remove(this.columnsSet);
        this.columnsArray = [];
        for (a = 0; a < b.length; a++) {
            var d = b[a],
                e = d.columnsArray;
            if (e) for (var f = 0; f < e.length; f++) this.columnsArray.push(e[f])
        }
        this.columnsArray.sort(this.compareDepth);
        if (0 < this.columnsArray.length) {
            b = this.container.set();
            this.columnSet.push(b);
            for (a = 0; a < this.columnsArray.length; a++) b.push(this.columnsArray[a].column.set);
            d && b.translate(d.x, d.y);
            this.columnsSet = b
        }
    },
    compareDepth: function (a, b) {
        return a.depth > b.depth ? 1 : -1
    },
    zoomScrollbar: function () {
        var a = this.chartScrollbar,
            b = this.categoryAxis;
        a && this.updateScrollbar && (b.parseDates && !b.equalSpacing ? a.timeZoom(this.startTime, this.endTime) : a.zoom(this.start, this.end), this.updateScrollbar = !0)
    },
    updateTrendLines: function () {
        for (var a = this.trendLines, b = 0; b < a.length; b++) {
            var d = a[b];
            d.chart = this;
            d.valueAxis || (d.valueAxis = this.valueAxes[0]);
            d.categoryAxis = this.categoryAxis
        }
    },
    zoomAxesAndGraphs: function () {
        for (var a = this.valueAxes, b = 0; b < a.length; b++) a[b].zoom(this.start, this.end);
        a = this.graphs;
        for (b = 0; b < a.length; b++) a[b].zoom(this.start, this.end);
        this.zoomTrendLines();
        (b = this.chartCursor) && b.zoom(this.start, this.end, this.startTime, this.endTime)
    },
    countColumns: function () {
        for (var a = 0, b = this.valueAxes.length, d = this.graphs.length, e, f, g = !1, h, j = 0; j < b; j++) {
            f = this.valueAxes[j];
            var k = f.stackType;
            if ("100%" == k || "regular" == k) {
                g = !1;
                for (h = 0; h < d; h++) e = this.graphs[h], !e.hidden && e.valueAxis == f && "column" == e.type && (!g && e.stackable && (a++, g = !0), e.stackable || a++, e.columnIndex = a - 1)
            }
            if ("none" == k || "3d" == k) for (h = 0; h < d; h++) e = this.graphs[h], !e.hidden && e.valueAxis == f && "column" == e.type && (e.columnIndex = a, a++);
            if ("3d" == k) {
                for (j = 0; j < d; j++) e = this.graphs[j], e.depthCount = a;
                a = 1
            }
        }
        return a
    },
    parseData: function () {
        AmCharts.AmSerialChart.base.parseData.call(this);
        this.parseSerialData()
    },
    getCategoryIndexByValue: function (a) {
        for (var b = this.chartData, d, e = 0; e < b.length; e++) b[e].category == a && (d = e);
        return d
    },
    handleCursorChange: function (a) {
        this.updateLegendValues(a.index)
    },
    handleCursorZoom: function (a) {
        this.updateScrollbar = !0;
        this.zoom(a.start, a.end)
    },
    handleScrollbarZoom: function (a) {
        this.updateScrollbar = !1;
        this.zoom(a.start, a.end)
    },
    dispatchTimeZoomEvent: function () {
        if (this.prevStartTime != this.startTime || this.prevEndTime != this.endTime) {
            var a = {
                type: "zoomed"
            };
            a.startDate = new Date(this.startTime);
            a.endDate = new Date(this.endTime);
            a.startIndex = this.start;
            a.endIndex = this.end;
            this.startIndex = this.start;
            this.endIndex = this.end;
            this.prevStartTime = this.startTime;
            this.prevEndTime = this.endTime;
            var b = this.categoryAxis,
                d = AmCharts.extractPeriod(b.minPeriod).period,
                b = b.dateFormatsObject[d];
            a.startValue = AmCharts.formatDate(a.startDate, b);
            a.endValue = AmCharts.formatDate(a.endDate, b);
            this.fire(a.type, a)
        }
    },
    dispatchIndexZoomEvent: function () {
        if (this.prevStartIndex != this.start || this.prevEndIndex != this.end) {
            this.startIndex = this.start;
            this.endIndex = this.end;
            var a = this.chartData;
            if (AmCharts.ifArray(a) && !isNaN(this.start) && !isNaN(this.end)) {
                var b = {
                    type: "zoomed"
                };
                b.startIndex = this.start;
                b.endIndex = this.end;
                b.startValue = a[this.start].category;
                b.endValue = a[this.end].category;
                this.categoryAxis.parseDates && (this.startTime = a[this.start].time, this.endTime = a[this.end].time, b.startDate = new Date(this.startTime), b.endDate = new Date(this.endTime));
                this.prevStartIndex = this.start;
                this.prevEndIndex = this.end;
                this.fire(b.type, b)
            }
        }
    },
    updateLegendValues: function (a) {
        for (var b = this.graphs, d = 0; d < b.length; d++) {
            var e = b[d];
            e.currentDataItem = isNaN(a) ? void 0 : this.chartData[a].axes[e.valueAxis.id].graphs[e.id]
        }
        this.legend && this.legend.updateValues()
    },
    getClosestIndex: function (a, b, d, e, f, g) {
        0 > f && (f = 0);
        g > a.length - 1 && (g = a.length - 1);
        var h = f + Math.round((g - f) / 2),
            j = a[h][b];
        if (1 >= g - f) {
            if (e) return f;
            e = a[g][b];
            return Math.abs(a[f][b] - d) < Math.abs(e - d) ? f : g
        }
        return d == j ? h : d < j ? this.getClosestIndex(a, b, d, e, f, h) : this.getClosestIndex(a, b, d, e, h, g)
    },
    zoomToIndexes: function (a, b) {
        this.updateScrollbar = !0;
        var d = this.chartData;
        if (d) {
            var e = d.length;
            0 < e && (0 > a && (a = 0), b > e - 1 && (b = e - 1), e = this.categoryAxis, e.parseDates && !e.equalSpacing ? this.zoom(d[a].time, d[b].time) : this.zoom(a, b))
        }
    },
    zoomToDates: function (a, b) {
        this.updateScrollbar = !0;
        var d = this.chartData;
        if (this.categoryAxis.equalSpacing) {
            var e = this.getClosestIndex(d, "time", a.getTime(), !0, 0, d.length),
                d = this.getClosestIndex(d, "time", b.getTime(), !1, 0, d.length);
            this.zoom(e, d)
        } else this.zoom(a.getTime(), b.getTime())
    },
    zoomToCategoryValues: function (a, b) {
        this.updateScrollbar = !0;
        this.zoom(this.getCategoryIndexByValue(a), this.getCategoryIndexByValue(b))
    },
    formatString: function (a, b) {
        var d = b.graph;
        if (-1 != a.indexOf("[[category]]")) {
            var e = b.serialDataItem.category;
            if (this.categoryAxis.parseDates) {
                var f = this.balloonDateFormat,
                    g = this.chartCursor;
                g && (f = g.categoryBalloonDateFormat); - 1 != a.indexOf("[[category]]") && (f = AmCharts.formatDate(e, f), -1 != f.indexOf("fff") && (f = AmCharts.formatMilliseconds(f, e)), e = f)
            }
            a = a.replace(/\[\[category\]\]/g, "" + e)
        }
        d = d.numberFormatter;
        d || (d = this.numberFormatter);
        e = b.graph.valueAxis;
        if ((f = e.duration) && !isNaN(b.values.value)) e = AmCharts.formatDuration(b.values.value, f, "", e.durationUnits, e.maxInterval, d), a = a.replace(RegExp("\\[\\[value\\]\\]", "g"), e);
        e = ["value", "open", "low", "high", "close"];
        f = this.percentFormatter;
        a = AmCharts.formatValue(a, b.percents, e, f, "percents.");
        a = AmCharts.formatValue(a, b.values, e, d, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        a = AmCharts.formatValue(a, b.values, ["percents"], f); - 1 != a.indexOf("[[") && (a = AmCharts.formatDataContextValue(a, b.dataContext));
        return a = AmCharts.AmSerialChart.base.formatString.call(this, a, b)
    },
    addChartScrollbar: function (a) {
        AmCharts.callMethod("destroy", [this.chartScrollbar]);
        a && (a.chart = this, this.listenTo(a, "zoomed", this.handleScrollbarZoom));
        this.rotate ? void 0 == a.width && (a.width = a.scrollbarHeight) : void 0 == a.height && (a.height = a.scrollbarHeight);
        this.chartScrollbar = a
    },
    removeChartScrollbar: function () {
        AmCharts.callMethod("destroy", [this.chartScrollbar]);
        this.chartScrollbar = null
    },
    handleReleaseOutside: function (a) {
        AmCharts.AmSerialChart.base.handleReleaseOutside.call(this, a);
        AmCharts.callMethod("handleReleaseOutside", [this.chartScrollbar])
    }
});
AmCharts.AmRadarChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart,
    construct: function () {
        AmCharts.AmRadarChart.base.construct.call(this);
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 0;
        this.chartType = "radar";
        this.radius = "35%"
    },
    initChart: function () {
        AmCharts.AmRadarChart.base.initChart.call(this);
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.drawChart()
    },
    updateData: function () {
        this.parseData();
        for (var a = this.graphs, b = 0; b < a.length; b++) a[b].data = this.chartData
    },
    updateGraphs: function () {
        for (var a = this.graphs, b = 0; b < a.length; b++) {
            var d = a[b];
            d.index = b;
            d.width = this.realRadius;
            d.height = this.realRadius;
            d.x = this.marginLeftReal;
            d.y = this.marginTopReal;
            d.chartType = this.chartType
        }
    },
    parseData: function () {
        AmCharts.AmRadarChart.base.parseData.call(this);
        this.parseSerialData()
    },
    updateValueAxes: function () {
        for (var a = this.valueAxes, b = 0; b < a.length; b++) {
            var d = a[b];
            d.axisRenderer = AmCharts.RadAxis;
            d.guideFillRenderer = AmCharts.RadarFill;
            d.axisItemRenderer = AmCharts.RadItem;
            d.autoGridCount = !1;
            d.x = this.marginLeftReal;
            d.y = this.marginTopReal;
            d.width = this.realRadius;
            d.height = this.realRadius
        }
    },
    drawChart: function () {
        AmCharts.AmRadarChart.base.drawChart.call(this);
        var a = this.updateWidth(),
            b = this.updateHeight(),
            d = this.marginTop + this.getTitleHeight(),
            e = this.marginLeft,
            b = b - d - this.marginBottom;
        this.marginLeftReal = e + (a - e - this.marginRight) / 2;
        this.marginTopReal = d + b / 2;
        this.realRadius = AmCharts.toCoordinate(this.radius, a, b);
        this.updateValueAxes();
        this.updateGraphs();
        a = this.chartData;
        if (AmCharts.ifArray(a)) {
            a = a.length - 1;
            e = this.valueAxes;
            for (d = 0; d < e.length; d++) e[d].zoom(0, a);
            e = this.graphs;
            for (d = 0; d < e.length; d++) e[d].zoom(0, a)
        } else this.cleanChart();
        this.chartCreated = !0;
        this.dispDUpd()
    },
    formatString: function (a, b) {
        var d = b.graph; - 1 != a.indexOf("[[category]]") && (a = a.replace(/\[\[category\]\]/g, "" + b.serialDataItem.category));
        d = d.numberFormatter;
        d || (d = this.numberFormatter);
        a = AmCharts.formatValue(a, b.values, ["value"], d, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        return a = AmCharts.AmRadarChart.base.formatString.call(this, a, b)
    },
    cleanChart: function () {
        this.callMethod("destroy", [this.valueAxes, this.graphs])
    }
});
AmCharts.AxisBase = AmCharts.Class({
    construct: function () {
        this.viY = this.viX = this.y = this.x = this.dy = this.dx = 0;
        this.axisWidth;
        this.axisThickness = 1;
        this.axisColor = "#000000";
        this.axisAlpha = 1;
        this.gridCount = this.tickLength = 5;
        this.gridAlpha = 0.15;
        this.gridThickness = 1;
        this.gridColor = "#000000";
        this.dashLength = 0;
        this.labelFrequency = 1;
        this.showLastLabel = this.showFirstLabel = !0;
        this.fillColor = "#FFFFFF";
        this.fillAlpha = 0;
        this.labelsEnabled = !0;
        this.labelRotation = 0;
        this.autoGridCount = !0;
        this.valueRollOverColor = "#CC0000";
        this.offset = 0;
        this.guides = [];
        this.visible = !0;
        this.counter = 0;
        this.guides = [];
        this.ignoreAxisWidth = this.inside = !1;
        this.titleColor;
        this.titleFontSize;
        this.titleBold = !0
    },
    zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.dataChanged = !0;
        this.draw()
    },
    fixAxisPosition: function () {
        var a = this.position;
        "H" == this.orientation ? ("left" == a && (a = "bottom"), "right" == a && (a = "top")) : ("bottom" == a && (a = "left"), "top" == a && (a = "right"));
        this.position = a
    },
    draw: function () {
        var a = this.chart;
        void 0 == this.titleColor && (this.titleColor = a.color);
        isNaN(this.titleFontSize) && (this.titleFontSize = a.fontSize + 1);
        this.allLabels = [];
        this.counter = 0;
        this.destroy();
        this.fixAxisPosition();
        this.labels = [];
        var b = a.container,
            d = b.set();
        a.gridSet.push(d);
        this.set = d;
        b = b.set();
        a.axesLabelsSet.push(b);
        this.labelsSet = b;
        this.axisLine = new this.axisRenderer(this);
        this.autoGridCount && ("V" == this.orientation ? (a = this.height / 35, 3 > a && (a = 3)) : a = this.width / 75, this.gridCount = a);
        this.axisWidth = this.axisLine.axisWidth;
        this.addTitle()
    },
    setOrientation: function (a) {
        this.orientation = a ? "H" : "V"
    },
    addTitle: function () {
        var a = this.title;
        if (a) {
            var b = this.chart;
            this.titleLabel = AmCharts.text(b.container, a, this.titleColor, b.fontFamily, this.titleFontSize, "middle", this.titleBold)
        }
    },
    positionTitle: function () {
        var a = this.titleLabel;
        if (a) {
            var b, d, e = this.labelsSet,
                f = e.getBBox();
            e.push(a);
            var e = f.x,
                g = f.y;
            AmCharts.VML && (this.rotate ? e -= this.x : g -= this.y);
            var h = f.width,
                f = f.height,
                j = this.viW,
                k = this.viH;
            a.getBBox();
            var l = 0,
                m = this.titleFontSize / 2,
                o = this.inside;
            switch (this.position) {
            case "top":
                b = j / 2;
                d = g - 10 - m;
                break;
            case "bottom":
                b = j / 2;
                d = g + f + 10 + m;
                break;
            case "left":
                b = e - 10 - m;
                o && (b -= 5);
                d = k / 2;
                l = -90;
                break;
            case "right":
                b = e + h + 10 + m - 3, o && (b += 7), d = k / 2, l = -90
            }
            this.marginsChanged ? (a.translate(b, d), this.tx = b, this.ty = d) : a.translate(this.tx, this.ty);
            this.marginsChanged = !1;
            0 != l && a.rotate(l)
        }
    },
    pushAxisItem: function (a) {
        var b = a.graphics();
        0 < b.length() && this.set.push(b);
        (a = a.getLabel()) && this.labelsSet.push(a)
    },
    addGuide: function (a) {
        this.guides.push(a)
    },
    removeGuide: function (a) {
        for (var b = this.guides, d = 0; d < b.length; d++) b[d] == a && b.splice(d, 1)
    },
    handleGuideOver: function (a) {
        clearTimeout(this.chart.hoverInt);
        var b = a.graphics.getBBox(),
            d = b.x + b.width / 2,
            b = b.y + b.height / 2,
            e = a.fillColor;
        void 0 == e && (e = a.lineColor);
        this.chart.showBalloon(a.balloonText, e, !0, d, b)
    },
    handleGuideOut: function () {
        this.chart.hideBalloon()
    },
    getBBox: function () {
        var a = this.labelsSet.getBBox();
        AmCharts.VML || (a = {
            x: a.x + this.x,
            y: a.y + this.y,
            width: a.width,
            height: a.height
        });
        return a
    },
    destroy: function () {
        AmCharts.remove(this.set);
        AmCharts.remove(this.labelsSet);
        var a = this.axisLine;
        a && AmCharts.remove(a.set);
        AmCharts.remove(this.grid0)
    }
});
AmCharts.ValueAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,
    construct: function () {
        this.createEvents("axisChanged", "logarithmicAxisFailed", "axisSelfZoomed", "axisZoomed");
        AmCharts.ValueAxis.base.construct.call(this);
        this.dataChanged = !0;
        this.gridCount = 8;
        this.stackType = "none";
        this.position = "left";
        this.unitPosition = "right";
        this.recalculateToPercents = this.includeHidden = this.includeGuidesInMinMax = this.integersOnly = !1;
        this.duration;
        this.durationUnits = {
            DD: "d. ",
            hh: ":",
            mm: ":",
            ss: ""
        };
        this.scrollbar = !1;
        this.maxDecCount;
        this.baseValue = 0;
        this.radarCategoriesEnabled = !0;
        this.gridType = "polygons";
        this.useScientificNotation = !1;
        this.axisTitleOffset = 10
    },
    updateData: function () {
        0 >= this.gridCount && (this.gridCount = 1);
        this.data = this.chart.chartData;
        "xy" != this.chart.chartType && (this.stackGraphs("smoothedLine"), this.stackGraphs("line"), this.stackGraphs("column"), this.stackGraphs("step"));
        this.recalculateToPercents && this.recalculate();
        this.synchronizationMultiplyer && this.synchronizeWithAxis ? this.foundGraphs = !0 : (this.foundGraphs = !1, this.getMinMax())
    },
    draw: function () {
        AmCharts.ValueAxis.base.draw.call(this);
        var a = this.chart,
            b = this.set;
        "duration" == this.type && (this.duration = "ss");
        !0 == this.dataChanged && (this.updateData(), this.dataChanged = !1);
        if (this.logarithmic && (0 >= this.getMin(0, this.data.length - 1) || 0 >= this.minimum)) this.fire("logarithmicAxisFailed", {
            type: "logarithmicAxisFailed"
        });
        else {
            this.grid0 = null;
            var d, e, f = a.dx,
                g = a.dy,
                h = !1,
                j = this.logarithmic,
                k = a.chartType;
            if (!isNaN(this.min) && !isNaN(this.max) && this.foundGraphs && Infinity != this.min && -Infinity != this.max) {
                var l = this.labelFrequency,
                    m = this.showFirstLabel,
                    o = this.showLastLabel,
                    p = 1,
                    n = 0,
                    q = Math.round((this.max - this.min) / this.step) + 1;
                if (!0 == j) {
                    var r = Math.log(this.max) * Math.LOG10E - Math.log(this.minReal) * Math.LOG10E;
                    this.stepWidth = this.axisWidth / r;
                    2 < r && (q = Math.ceil(Math.log(this.max) * Math.LOG10E) + 1, n = Math.round(Math.log(this.minReal) * Math.LOG10E), q > this.gridCount && (p = Math.ceil(q / this.gridCount)))
                } else this.stepWidth = this.axisWidth / (this.max - this.min);
                d = 0;
                1 > this.step && -1 < this.step && (e = this.step.toString(), d = -1 != e.indexOf("e-") ? Number(e.split("-")[1]) : e.split(".")[1].length);
                this.integersOnly && (d = 0);
                d > this.maxDecCount && (d = this.maxDecCount);
                isNaN(this.precision) || (d = this.precision);
                this.max = AmCharts.roundTo(this.max, this.maxDecCount);
                this.min = AmCharts.roundTo(this.min, this.maxDecCount);
                var s = {};
                s.precision = d;
                s.decimalSeparator = a.numberFormatter.decimalSeparator;
                s.thousandsSeparator = a.numberFormatter.thousandsSeparator;
                this.numberFormatter = s;
                var t = this.guides,
                    u = t.length;
                if (0 < u) {
                    var w = this.fillAlpha;
                    for (e = this.fillAlpha = 0; e < u; e++) {
                        var A = t[e],
                            C = NaN;
                        if (!isNaN(A.toValue)) {
                            var C = this.getCoordinate(A.toValue),
                                v = new this.axisItemRenderer(this, C, "", !0, NaN, NaN, A);
                            this.pushAxisItem(v)
                        }
                        var D = NaN;
                        isNaN(A.value) || (D = this.getCoordinate(A.value), v = new this.axisItemRenderer(this, D, A.label, !0, NaN, (C - D) / 2, A), this.pushAxisItem(v));
                        isNaN(C - D) || (v = new this.guideFillRenderer(this, D, C, A), this.pushAxisItem(v), v = v.graphics(), A.graphics = v, A.balloonText && this.addEventListeners(v, A))
                    }
                    this.fillAlpha = w
                }
                t = !1;
                for (e = n; e < q; e += p) v = AmCharts.roundTo(this.step * e + this.min, d), -1 != ("" + v).indexOf("e") && (t = !0, ("" + v).split("e"));
                this.duration && (this.maxInterval = AmCharts.getMaxInterval(this.max, this.duration));
                for (e = n; e < q; e += p) if (n = this.step * e + this.min, n = AmCharts.roundTo(n, this.maxDecCount + 1), !(this.integersOnly && Math.round(n) != n)) {
                    !0 == j && (0 == n && (n = this.minReal), 2 < r && (n = Math.pow(10, e)), t = -1 != ("" + n).indexOf("e") ? !0 : !1);
                    this.useScientificNotation && (t = !0);
                    this.usePrefixes && (t = !1);
                    t ? (v = -1 == ("" + n).indexOf("e") ? n.toExponential(15) : "" + n, v = v.split("e"), d = Number(v[0]), v = Number(v[1]), 10 == d && (d = 1, v += 1), v = d + "e" + v, 0 == n && (v = "0"), 1 == n && (v = "1")) : (j && (d = ("" + n).split("."), s.precision = d[1] ? d[1].length : -1), v = this.usePrefixes ? AmCharts.addPrefix(n, a.prefixesOfBigNumbers, a.prefixesOfSmallNumbers, s) : AmCharts.formatNumber(n, s, s.precision));
                    this.duration && (v = AmCharts.formatDuration(n, this.duration, "", this.durationUnits, this.maxInterval, s));
                    this.recalculateToPercents ? v += "%" : (d = this.unit) && (v = "left" == this.unitPosition ? d + v : v + d);
                    Math.round(e / l) != e / l && (v = void 0);
                    if (0 == e && !m || e == q - 1 && !o) v = " ";
                    d = this.getCoordinate(n);
                    v = new this.axisItemRenderer(this, d, v);
                    this.pushAxisItem(v);
                    if (n == this.baseValue && "radar" != k) {
                        var O, G, u = this.viW,
                            w = this.viH,
                            n = this.viX,
                            v = this.viY;
                        "H" == this.orientation ? 0 <= d && d <= u + 1 && (O = [d, d, d + f], G = [w, 0, g]) : 0 <= d && d <= w + 1 && (O = [0, u, u + f], G = [d, d, d + g]);
                        O && (d = AmCharts.line(a.container, O, G, this.gridColor, 2 * this.gridAlpha, 1, this.dashLength), d.translate(n, v), this.grid0 = d, a.axesSet.push(d))
                    }
                }
                a = this.baseValue;
                this.min > this.baseValue && this.max > this.baseValue && (a = this.min);
                this.min < this.baseValue && this.max < this.baseValue && (a = this.max);
                j && a < this.minReal && (a = this.minReal);
                this.baseCoord = this.getCoordinate(a);
                a = {
                    type: "axisChanged"
                };
                a.min = j ? this.minReal : this.min;
                a.max = this.max;
                this.fire("axisChanged", a);
                this.axisCreated = !0
            } else h = !0;
            j = this.axisLine.set;
            a = this.labelsSet;
            this.positionTitle();
            "radar" != k ? (k = this.viX, f = this.viY, b.translate(k, f), a.translate(k, f)) : j.toFront();
            !this.visible || h ? (b.hide(), j.hide(), a.hide()) : (b.show(), j.show(), a.show())
        }
    },
    addEventListeners: function (a, b) {
        var d = this;
        a.mouseover(function () {
            d.handleGuideOver(b)
        });
        a.mouseout(function () {
            d.handleGuideOut(b)
        })
    },
    stackGraphs: function (a) {
        var b = this.stackType;
        "stacked" == b && (b = "regular");
        "line" == b && (b = "none");
        "100% stacked" == b && (b = "100%");
        this.stackType = b;
        var d = [],
            e = [],
            f = [],
            g = [],
            h, j = this.chart.graphs,
            k, l, m, o = this.baseValue;
        if (("line" == a || "step" == a || "smoothedLine" == a) && ("regular" == b || "100%" == b)) for (m = 0; m < j.length; m++) h = j[m], h.hidden || (l = h.type, h.chart == this.chart && h.valueAxis == this && a == l && h.stackable && (k && (h.stackGraph = k), k = h));
        for (k = this.start; k <= this.end; k++) for (m = 0; m < j.length; m++) if (h = j[m], !h.hidden && (l = h.type, h.chart == this.chart && h.valueAxis == this && a == l && h.stackable && (l = this.data[k].axes[this.id].graphs[h.id], h = l.values.value, !isNaN(h) && (g[k] = isNaN(g[k]) ? Math.abs(h) : g[k] + Math.abs(h), "regular" == b)))) {
            if ("line" == a || "step" == a || "smoothedLine" == a) isNaN(d[k]) ? (d[k] = h, l.values.close = h, l.values.open = this.baseValue) : (l.values.close = isNaN(h) ? d[k] : h + d[k], l.values.open = d[k], d[k] = l.values.close);
            "column" == a && !isNaN(h) && (l.values.close = h, 0 > h ? (l.values.close = h, isNaN(e[k]) ? l.values.open = o : (l.values.close += e[k], l.values.open = e[k]), e[k] = l.values.close) : (l.values.close = h, isNaN(f[k]) ? l.values.open = o : (l.values.close += f[k], l.values.open = f[k]), f[k] = l.values.close))
        }
        for (k = this.start; k <= this.end; k++) for (m = 0; m < j.length; m++) h = j[m], h.hidden || (l = h.type, h.chart == this.chart && h.valueAxis == this && a == l && h.stackable && (l = this.data[k].axes[this.id].graphs[h.id], h = l.values.value, isNaN(h) || (d = 100 * (h / g[k]), l.values.percents = d, l.values.total = g[k], "100%" == b && (isNaN(e[k]) && (e[k] = 0), isNaN(f[k]) && (f[k] = 0), 0 > d ? (l.values.close = d + e[k], l.values.open = e[k], e[k] = l.values.close) : (l.values.close = d + f[k], l.values.open = f[k], f[k] = l.values.close)))))
    },
    recalculate: function () {
        for (var a = this.chart.graphs, b = 0; b < a.length; b++) {
            var d = a[b];
            if (d.valueAxis == this) {
                var e = "value";
                if ("candlestick" == d.type || "ohlc" == d.type) e = "open";
                var f, g, h = this.end + 2,
                    h = AmCharts.fitToBounds(this.end + 1, 0, this.data.length - 1),
                    j = this.start;
                0 < j && j--;
                for (var k = this.start; k <= h && !(g = this.data[k].axes[this.id].graphs[d.id], f = g.values[e], !isNaN(f)); k++);
                for (e = j; e <= h; e++) {
                    g = this.data[e].axes[this.id].graphs[d.id];
                    g.percents = {};
                    var j = g.values,
                        l;
                    for (l in j) g.percents[l] = "percents" != l ? 100 * (j[l] / f) - 100 : j[l]
                }
            }
        }
    },
    getMinMax: function () {
        for (var a = !1, b = this.chart, d = b.graphs, e = 0; e < d.length; e++) {
            var f = d[e].type;
            if ("line" == f || "step" == f || "smoothedLine" == f) this.expandMinMax && (a = !0)
        }
        a && (0 < this.start && this.start--, this.end < this.data.length - 1 && this.end++);
        "serial" == b.chartType && !0 == b.categoryAxis.parseDates && !a && this.end < this.data.length - 1 && this.end++;
        this.min = this.getMin(this.start, this.end);
        this.max = this.getMax();
        a = this.guides.length;
        if (this.includeGuidesInMinMax && 0 < a) for (b = 0; b < a; b++) if (d = this.guides[b], d.toValue < this.min && (this.min = d.toValue), d.value < this.min && (this.min = d.value), d.toValue > this.max && (this.max = d.toValue), d.value > this.max) this.max = d.value;
        isNaN(this.minimum) || (this.min = this.minimum);
        isNaN(this.maximum) || (this.max = this.maximum);
        this.min > this.max && (a = this.max, this.max = this.min, this.min = a);
        isNaN(this.minTemp) || (this.min = this.minTemp);
        isNaN(this.maxTemp) || (this.max = this.maxTemp);
        this.minReal = this.min;
        this.maxReal = this.max;
        0 == this.min && 0 == this.max && (this.max = 9);
        this.min > this.max && (this.min = this.max - 1);
        a = this.min;
        b = this.max;
        d = this.max - this.min;
        e = 0 == d ? Math.pow(10, Math.floor(Math.log(Math.abs(this.max)) * Math.LOG10E)) / 10 : Math.pow(10, Math.floor(Math.log(Math.abs(d)) * Math.LOG10E)) / 10;
        isNaN(this.maximum) && isNaN(this.maxTemp) && (this.max = Math.ceil(this.max / e) * e + e);
        isNaN(this.minimum) && isNaN(this.minTemp) && (this.min = Math.floor(this.min / e) * e - e);
        0 > this.min && 0 <= a && (this.min = 0);
        0 < this.max && 0 >= b && (this.max = 0);
        "100%" == this.stackType && (this.min = 0 > this.min ? -100 : 0, this.max = 0 > this.max ? 0 : 100);
        d = this.max - this.min;
        e = Math.pow(10, Math.floor(Math.log(Math.abs(d)) * Math.LOG10E)) / 10;
        this.step = Math.ceil(d / this.gridCount / e) * e;
        d = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E));
        d = d.toExponential(0).split("e");
        e = Number(d[1]);
        9 == Number(d[0]) && e++;
        d = this.generateNumber(1, e);
        e = Math.ceil(this.step / d);
        5 < e && (e = 10);
        5 >= e && 2 < e && (e = 5);
        this.step = Math.ceil(this.step / (d * e)) * d * e;
        1 > d ? (this.maxDecCount = Math.abs(Math.log(Math.abs(d)) * Math.LOG10E), this.maxDecCount = Math.round(this.maxDecCount), this.step = AmCharts.roundTo(this.step, this.maxDecCount + 1)) : this.maxDecCount = 0;
        this.min = this.step * Math.floor(this.min / this.step);
        this.max = this.step * Math.ceil(this.max / this.step);
        0 > this.min && 0 <= a && (this.min = 0);
        0 < this.max && 0 >= b && (this.max = 0);
        1 < this.minReal && 1 < this.max - this.minReal && (this.minReal = Math.floor(this.minReal));
        d = Math.pow(10, Math.floor(Math.log(Math.abs(this.minReal)) * Math.LOG10E));
        0 == this.min && (this.minReal = d);
        0 == this.min && 1 < this.minReal && (this.minReal = 1);
        0 < this.min && 0 < this.minReal - this.step && (this.minReal = this.min + this.step < this.minReal ? this.min + this.step : this.min);
        d = Math.log(b) * Math.LOG10E - Math.log(a) * Math.LOG10E;
        this.logarithmic && (2 < d ? (this.minReal = this.min = Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)), this.max = Math.pow(10, Math.ceil(Math.log(Math.abs(b)) * Math.LOG10E))) : (b = Math.pow(10, Math.floor(Math.log(Math.abs(this.min)) * Math.LOG10E)) / 10, a = Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)) / 10, b < a && (this.minReal = this.min = 10 * a)))
    },
    generateNumber: function (a, b) {
        var d = "",
            e;
        e = 0 > b ? Math.abs(b) - 1 : Math.abs(b);
        for (var f = 0; f < e; f++) d += "0";
        return 0 > b ? Number("0." + d + ("" + a)) : Number("" + a + d)
    },
    getMin: function (a, b) {
        for (var d, e = a; e <= b; e++) {
            var f = this.data[e].axes[this.id].graphs,
                g;
            for (g in f) {
                var h = this.chart.getGraphById(g);
                if (h.includeInMinMax && (!h.hidden || this.includeHidden)) {
                    isNaN(d) && (d = Infinity);
                    this.foundGraphs = !0;
                    h = f[g].values;
                    this.recalculateToPercents && (h = f[g].percents);
                    var j;
                    if (this.minMaxField) j = h[this.minMaxField], j < d && (d = j);
                    else for (var k in h) "percents" != k && "total" != k && (j = h[k], j < d && (d = j))
                }
            }
        }
        return d
    },
    getMax: function () {
        for (var a, b = this.start; b <= this.end; b++) {
            var d = this.data[b].axes[this.id].graphs,
                e;
            for (e in d) {
                var f = this.chart.getGraphById(e);
                if (f.includeInMinMax && (!f.hidden || this.includeHidden)) {
                    isNaN(a) && (a = -Infinity);
                    this.foundGraphs = !0;
                    f = d[e].values;
                    this.recalculateToPercents && (f = d[e].percents);
                    var g;
                    if (this.minMaxField) g = f[this.minMaxField], g > a && (a = g);
                    else for (var h in f) "percents" != h && "total" != h && (g = f[h], g > a && (a = g))
                }
            }
        }
        return a
    },
    dispatchZoomEvent: function (a, b) {
        var d = {
            type: "axisZoomed",
            startValue: a,
            endValue: b
        };
        this.fire(d.type, d)
    },
    zoomToValues: function (a, b) {
        if (b < a) var d = b,
            b = a,
            a = d;
        a < this.min && (a = this.min);
        b > this.max && (b = this.max);
        d = {
            type: "axisSelfZoomed",
            valueAxis: this
        };
        d.multiplyer = this.axisWidth / Math.abs(this.getCoordinate(b) - this.getCoordinate(a));
        d.position = "V" == this.orientation ? this.reversed ? this.getCoordinate(a) - this.y : this.getCoordinate(b) - this.y : this.reversed ? this.getCoordinate(b) - this.x : this.getCoordinate(a) - this.x;
        this.fire(d.type, d)
    },
    coordinateToValue: function (a) {
        if (isNaN(a)) return NaN;
        var b = this.axisWidth,
            d = this.stepWidth,
            e = this.reversed,
            f = this.rotate,
            g = this.min,
            h = this.minReal;
        return !0 == this.logarithmic ? Math.pow(10, (f ? !0 == e ? (b - a) / d : a / d : !0 == e ? a / d : (b - a) / d) + Math.log(h) * Math.LOG10E) : !0 == e ? f ? g - (a - b) / d : a / d + g : f ? a / d + g : g - (a - b) / d
    },
    getCoordinate: function (a) {
        if (isNaN(a)) return NaN;
        var b = this.rotate,
            d = this.reversed,
            e = this.axisWidth,
            f = this.stepWidth,
            g = this.min,
            h = this.minReal;
        !0 == this.logarithmic ? (a = Math.log(a) * Math.LOG10E - Math.log(h) * Math.LOG10E, b = b ? !0 == d ? e - f * a : f * a : !0 == d ? f * a : e - f * a) : b = !0 == d ? b ? e - f * (a - g) : f * (a - g) : b ? f * (a - g) : e - f * (a - g);
        b = this.rotate ? b + (this.x - this.viX) : b + (this.y - this.viY);
        return Math.round(b)
    },
    synchronizeWithAxis: function (a) {
        this.synchronizeWithAxis = a;
        this.removeListener(this.synchronizeWithAxis, "axisChanged", this.handleSynchronization);
        this.listenTo(this.synchronizeWithAxis, "axisChanged", this.handleSynchronization)
    },
    handleSynchronization: function () {
        var a = this.synchronizeWithAxis,
            b = a.min,
            d = a.max,
            a = a.step,
            e = this.synchronizationMultiplyer;
        e && (this.min = b * e, this.max = d * e, this.step = a * e, b = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E)), b = Math.abs(Math.log(Math.abs(b)) * Math.LOG10E), this.maxDecCount = b = Math.round(b), this.draw())
    }
});
AmCharts.CategoryAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,
    construct: function () {
        AmCharts.CategoryAxis.base.construct.call(this);
        this.minPeriod = "DD";
        this.equalSpacing = this.parseDates = !1;
        this.position = "bottom";
        this.startOnAxis = !1;
        this.firstDayOfWeek = 1;
        this.gridPosition = "middle";
        this.boldPeriodBeginning = !0;
        this.periods = [{
            period: "ss",
            count: 1
        }, {
            period: "ss",
            count: 5
        }, {
            period: "ss",
            count: 10
        }, {
            period: "ss",
            count: 30
        }, {
            period: "mm",
            count: 1
        }, {
            period: "mm",
            count: 5
        }, {
            period: "mm",
            count: 10
        }, {
            period: "mm",
            count: 30
        }, {
            period: "hh",
            count: 1
        }, {
            period: "hh",
            count: 3
        }, {
            period: "hh",
            count: 6
        }, {
            period: "hh",
            count: 12
        }, {
            period: "DD",
            count: 1
        }, {
            period: "WW",
            count: 1
        }, {
            period: "MM",
            count: 1
        }, {
            period: "MM",
            count: 2
        }, {
            period: "MM",
            count: 3
        }, {
            period: "MM",
            count: 6
        }, {
            period: "YYYY",
            count: 1
        }, {
            period: "YYYY",
            count: 2
        }, {
            period: "YYYY",
            count: 5
        }, {
            period: "YYYY",
            count: 10
        }, {
            period: "YYYY",
            count: 50
        }, {
            period: "YYYY",
            count: 100
        }];
        this.dateFormats = [{
            period: "fff",
            format: "JJ:NN:SS"
        }, {
            period: "ss",
            format: "JJ:NN:SS"
        }, {
            period: "mm",
            format: "JJ:NN"
        }, {
            period: "hh",
            format: "JJ:NN"
        }, {
            period: "DD",
            format: "MMM DD"
        }, {
            period: "WW",
            format: "MMM DD"
        }, {
            period: "MM",
            format: "MMM"
        }, {
            period: "YYYY",
            format: "YYYY"
        }];
        this.nextPeriod = {};
        this.nextPeriod.fff = "ss";
        this.nextPeriod.ss = "mm";
        this.nextPeriod.mm = "hh";
        this.nextPeriod.hh = "DD";
        this.nextPeriod.DD = "MM";
        this.nextPeriod.MM = "YYYY"
    },
    draw: function () {
        var a = this;
        AmCharts.CategoryAxis.base.draw.call(a);
        a.generateDFObject();
        var b = a.chart.chartData;
        a.data = b;
        if (AmCharts.ifArray(b)) {
            var d = a.chart,
                e = a.start,
                f = a.labelFrequency,
                g = 0,
                h = a.end - e + 1,
                j = a.gridCount,
                k = a.showFirstLabel,
                l = a.showLastLabel,
                m, o = "",
                o = AmCharts.extractPeriod(a.minPeriod);
            m = AmCharts.getPeriodDuration(o.period, o.count);
            var p, n, q, r, s;
            p = a.rotate;
            var t = a.firstDayOfWeek,
                b = AmCharts.resetDateToMin(new Date(b[b.length - 1].time + 1.05 * m), a.minPeriod, 1, t).getTime();
            a.endTime > b && (a.endTime = b);
            if (a.parseDates && !a.equalSpacing) {
                if (a.timeDifference = a.endTime - a.startTime, e = a.choosePeriod(0), f = e.period, p = e.count, n = AmCharts.getPeriodDuration(f, p), n < m && (f = o.period, p = o.count, n = m), b = f, "WW" == b && (b = "DD"), a.stepWidth = a.getStepWidth(a.timeDifference), j = Math.ceil(a.timeDifference / n) + 1, o = AmCharts.resetDateToMin(new Date(a.startTime - n), f, p, t).getTime(), b == f && 1 == p && (q = n * a.stepWidth), a.cellWidth = m * a.stepWidth, h = Math.round(o / n), e = -1, h / 2 == Math.round(h / 2) && (e = -2, o -= n), 0 < a.gridCount) for (h = e; h <= j; h++) {
                    r = o + 1.5 * n;
                    r = AmCharts.resetDateToMin(new Date(r), f, p, t).getTime();
                    m = (r - a.startTime) * a.stepWidth;
                    s = !1;
                    a.nextPeriod[b] && (s = a.checkPeriodChange(a.nextPeriod[b], 1, r, o));
                    var u = !1;
                    s ? (o = a.dateFormatsObject[a.nextPeriod[b]], u = !0) : o = a.dateFormatsObject[b];
                    a.boldPeriodBeginning || (u = !1);
                    o = AmCharts.formatDate(new Date(r), o);
                    if (h == e && !k || h == j && !l) o = " ";
                    m = new a.axisItemRenderer(this, m, o, !1, q, 0, !1, u);
                    a.pushAxisItem(m);
                    o = r
                }
            } else if (a.parseDates) {
                if (a.parseDates && a.equalSpacing) {
                    g = a.start;
                    a.startTime = a.data[a.start].time;
                    a.endTime = a.data[a.end].time;
                    a.timeDifference = a.endTime - a.startTime;
                    e = a.choosePeriod(0);
                    f = e.period;
                    p = e.count;
                    n = AmCharts.getPeriodDuration(f, p);
                    n < m && (f = o.period, p = o.count, n = m);
                    b = f;
                    "WW" == b && (b = "DD");
                    a.stepWidth = a.getStepWidth(h);
                    j = Math.ceil(a.timeDifference / n) + 1;
                    o = AmCharts.resetDateToMin(new Date(a.startTime - n), f, p, t).getTime();
                    a.cellWidth = a.getStepWidth(h);
                    h = Math.round(o / n);
                    e = -1;
                    h / 2 == Math.round(h / 2) && (e = -2, o -= n);
                    h = a.start;
                    h / 2 == Math.round(h / 2) && h--;
                    0 > h && (h = 0);
                    q = a.end + 2;
                    q >= a.data.length && (q = a.data.length);
                    t = !1;
                    for (a.end - a.start > a.gridCount && (t = !0); h < q; h++) if (r = a.data[h].time, a.checkPeriodChange(f, p, r, o)) {
                        m = a.getCoordinate(h - a.start);
                        s = !1;
                        a.nextPeriod[b] && (s = a.checkPeriodChange(a.nextPeriod[b], 1, r, o));
                        u = !1;
                        s ? (o = a.dateFormatsObject[a.nextPeriod[b]], u = !0) : o = a.dateFormatsObject[b];
                        o = AmCharts.formatDate(new Date(r), o);
                        if (h == e && !k || h == j && !l) o = " ";
                        t ? t = !1 : (m = new a.axisItemRenderer(this, m, o, void 0, void 0, void 0, void 0, u), m.graphics(), a.pushAxisItem(m));
                        o = r
                    }
                }
            } else if (a.cellWidth = a.getStepWidth(h), h < j && (j = h), g += a.start, a.stepWidth = a.getStepWidth(h), 0 < j) {
                j = Math.floor(h / j);
                h = g;
                h / 2 == Math.round(h / 2) && h--;
                0 > h && (h = 0);
                for (q = 0; h <= a.end + 2; h += j) {
                    q++;
                    o = 0 <= h && h < a.data.length ? a.data[h].category : "";
                    m = a.getCoordinate(h - g);
                    t = 0;
                    "start" == a.gridPosition && (m -= a.cellWidth / 2, t = a.cellWidth / 2);
                    if (h == e && !k || h == a.end && !l) o = " ";
                    Math.round(q / f) != q / f && (o = " ");
                    b = a.cellWidth;
                    p && (b = NaN);
                    m = new a.axisItemRenderer(this, m, o, !0, b, t, void 0, !1, t);
                    a.pushAxisItem(m)
                }
            }
            for (h = 0; h < a.data.length; h++) if (k = a.data[h]) l = a.parseDates && !a.equalSpacing ? Math.round((k.time - a.startTime) * a.stepWidth + a.cellWidth / 2) : a.getCoordinate(h - g), k.x[a.id] = l
        }
        k = a.guides.length;
        for (h = 0; h < k; h++) if (l = a.guides[h], q = j = e = NaN, l.toCategory && (q = d.getCategoryIndexByValue(l.toCategory), isNaN(q) || (e = a.getCoordinate(q - g), m = new a.axisItemRenderer(this, e, "", !0, NaN, NaN, l), a.pushAxisItem(m))), l.category && (q = d.getCategoryIndexByValue(l.category), isNaN(q) || (j = a.getCoordinate(q - g), q = (e - j) / 2, m = new a.axisItemRenderer(this, j, l.label, !0, NaN, q, l), a.pushAxisItem(m))), l.toDate && (a.equalSpacing ? (q = d.getClosestIndex(a.data, "time", l.toDate.getTime(), !1, 0, a.data.length - 1), isNaN(q) || (e = a.getCoordinate(q - g))) : e = (l.toDate.getTime() - a.startTime) * a.stepWidth, m = new a.axisItemRenderer(this, e, "", !0, NaN, NaN, l), a.pushAxisItem(m)), l.date && (a.equalSpacing ? (q = d.getClosestIndex(a.data, "time", l.date.getTime(), !1, 0, a.data.length - 1), isNaN(q) || (j = a.getCoordinate(q - g))) : j = (l.date.getTime() - a.startTime) * a.stepWidth, q = (e - j) / 2, m = "H" == a.orientation ? new a.axisItemRenderer(this, j, l.label, !1, 2 * q, NaN, l) : new a.axisItemRenderer(this, j, l.label, !1, NaN, q, l), a.pushAxisItem(m)), e = new a.guideFillRenderer(this, j, e, l), j = e.graphics(), a.pushAxisItem(e), l.graphics = j, j.index = h, l.balloonText) j.mouseover(function () {
            a.handleGuideOver(this.index)
        }), j.mouseout(function () {
            a.handleGuideOut(this.index)
        });
        a.axisCreated = !0;
        d = a.x;
        g = a.y;
        a.set.translate(d, g);
        a.labelsSet.translate(d, g);
        a.positionTitle();
        (d = a.axisLine.set) && d.toFront()
    },
    choosePeriod: function (a) {
        var b = AmCharts.getPeriodDuration(this.periods[a].period, this.periods[a].count);
        return Math.ceil(this.timeDifference / b) <= this.gridCount ? this.periods[a] : a + 1 < this.periods.length ? this.choosePeriod(a + 1) : this.periods[a]
    },
    getStepWidth: function (a) {
        var b;
        this.startOnAxis ? (b = this.axisWidth / (a - 1), 1 == a && (b = this.axisWidth)) : b = this.axisWidth / a;
        return b
    },
    getCoordinate: function (a) {
        a *= this.stepWidth;
        this.startOnAxis || (a += this.stepWidth / 2);
        return Math.round(a)
    },
    timeZoom: function (a, b) {
        this.startTime = a;
        this.endTime = b + this.minDuration()
    },
    minDuration: function () {
        var a = AmCharts.extractPeriod(this.minPeriod);
        return AmCharts.getPeriodDuration(a.period, a.count)
    },
    checkPeriodChange: function (a, b, d, e) {
        var e = new Date(e),
            f = this.firstDayOfWeek,
            d = AmCharts.resetDateToMin(new Date(d), a, b, f).getTime(),
            a = AmCharts.resetDateToMin(e, a, b, f).getTime();
        return d != a ? !0 : !1
    },
    generateDFObject: function () {
        this.dateFormatsObject = {};
        for (var a = 0; a < this.dateFormats.length; a++) {
            var b = this.dateFormats[a];
            this.dateFormatsObject[b.period] = b.format
        }
    },
    xToIndex: function (a) {
        var b = this.data,
            d = this.chart,
            e = d.rotate,
            f = this.stepWidth;
        this.parseDates && !this.equalSpacing ? (a = this.startTime + Math.round(a / f) - this.minDuration() / 2, d = d.getClosestIndex(b, "time", a, !1, this.start, this.end + 1)) : (this.startOnAxis || (a -= f / 2), d = this.start + Math.round(a / f));
        var d = AmCharts.fitToBounds(d, 0, b.length - 1),
            g;
        b[d] && (g = b[d].x[this.id]);
        e ? g > this.height + 1 && d-- : g > this.width + 1 && d--;
        0 > g && d++;
        return d = AmCharts.fitToBounds(d, 0, b.length - 1)
    },
    dateToCoordinate: function (a) {
        return this.parseDates && !this.equalSpacing ? (a.getTime() - this.startTime) * this.stepWidth : this.parseDates && this.equalSpacing ? this.getCoordinate(this.chart.getClosestIndex(this.data, "time", a.getTime(), !1, 0, this.data.length - 1) - this.start) : NaN
    },
    categoryToCoordinate: function (a) {
        return this.chart ? this.getCoordinate(this.chart.getCategoryIndexByValue(a) - this.start) : NaN
    },
    coordinateToDate: function (a) {
        return this.equalSpacing ? (a = this.xToIndex(a), new Date(this.data[a].time)) : new Date(this.startTime + a / this.stepWidth)
    }
});
AmCharts.RecAxis = AmCharts.Class({
    construct: function (a) {
        var b = a.chart,
            d = a.axisThickness,
            e = a.axisColor,
            f = a.axisAlpha,
            g = a.offset,
            h = a.dx,
            j = a.dy,
            k = a.viX,
            l = a.viY,
            m = a.viH,
            o = a.viW,
            p = b.container;
        "H" == a.orientation ? (e = AmCharts.line(p, [0, o], [0, 0], e, f, d), this.axisWidth = a.width, "bottom" == a.position ? (a = d / 2 + g + m + l - 1, d = k) : (a = -d / 2 - g + l + j, d = h + k)) : (this.axisWidth = a.height, "right" == a.position ? (e = AmCharts.line(p, [0, 0, -h], [0, m, m - j], e, f, d), a = l + j, d = d / 2 + g + h + o + k - 1) : (e = AmCharts.line(p, [0, 0], [0, m], e, f, d), a = l, d = -d / 2 - g + k));
        e.translate(d, a);
        b.axesSet.push(e);
        this.set = e
    }
});
AmCharts.RecItem = AmCharts.Class({
    construct: function (a, b, d, e, f, g, h, j, k) {
        b = Math.round(b);
        void 0 == d && (d = "");
        k || (k = 0);
        void 0 == e && (e = !0);
        var l = a.chart.fontFamily,
            m = a.fontSize;
        void 0 == m && (m = a.chart.fontSize);
        var o = a.color;
        void 0 == o && (o = a.chart.color);
        var p = a.chart.container,
            n = p.set();
        this.set = n;
        var q = a.axisThickness,
            r = a.axisColor,
            s = a.axisAlpha,
            t = a.tickLength,
            u = a.gridAlpha,
            w = a.gridThickness,
            A = a.gridColor,
            C = a.dashLength,
            v = a.fillColor,
            D = a.fillAlpha,
            O = a.labelsEnabled,
            G = a.labelRotation,
            U = a.counter,
            J = a.inside,
            L = a.dx,
            E = a.dy,
            $ = a.orientation,
            K = a.position,
            P = a.previousCoord,
            Ma = a.chart.rotate,
            V = a.viH,
            da = a.viW,
            ea = a.offset,
            Q, R;
        if (h) {
            if (O = !0, isNaN(h.tickLength) || (t = h.tickLength), void 0 != h.lineColor && (A = h.lineColor), isNaN(h.lineAlpha) || (u = h.lineAlpha), isNaN(h.dashLength) || (C = h.dashLength), isNaN(h.lineThickness) || (w = h.lineThickness), !0 == h.inside && (J = !0), !isNaN(h.labelRotation)) G = h.labelRotation
        } else d || (u /= 3, t /= 2);
        R = "start";
        f && (R = "middle");
        var aa = G * Math.PI / 180,
            Y, x = 0,
            B = 0,
            fa = 0,
            ga = Y = 0;
        "V" == $ && (G = 0);
        if (O) var S = AmCharts.text(p, d, o, l, m, R, j),
            ga = S.getBBox().width;
        if ("H" == $) {
            if (0 <= b && b <= da + 1 && (0 < t && 0 < s && b + k <= da + 1 && (Q = AmCharts.line(p, [b + k, b + k], [0, t], r, s, w), n.push(Q)), 0 < u)) R = AmCharts.line(p, [b, b + L, b + L], [V, V + E, E], A, u, w, C), n.push(R);
            B = 0;
            x = b;
            h && 90 == G && (x -= m);
            !1 == e ? (R = "start", Ma || (B = "bottom" == K ? J ? B + t : B - t : J ? B - t : B + t, x += 3, f && (x += f / 2, R = "middle"))) : R = "middle";
            1 == U && 0 < D && !h && P < da && (e = AmCharts.fitToBounds(b, 0, da), P = AmCharts.fitToBounds(P, 0, da), Y = e - P, 0 < Y && (fill = AmCharts.rect(p, Y, a.height, v, D), fill.translate(e - Y + L, E), n.push(fill)));
            "bottom" == K ? (B += V + m / 2 + ea, J ? 0 < G ? (B = V - ga / 2 * Math.sin(aa) - t - 3, x += ga / 2 * Math.cos(aa)) : B -= t + m + 3 + 3 : 0 < G ? (B = V + ga / 2 * Math.sin(aa) + t + 3, x -= ga / 2 * Math.cos(aa)) : B += t + q + 3 + 3) : (B += E + m / 2 - ea, x += L, J ? 0 < G ? (B = ga / 2 * Math.sin(aa) + t + 3, x -= ga / 2 * Math.cos(aa)) : B += t + 3 : 0 < G ? (B = -(ga / 2) * Math.sin(aa) - t - 6, x += ga / 2 * Math.cos(aa)) : B -= t + m + 3 + q + 3);
            "bottom" == K ? Y = (J ? V - t - 1 : V + q - 1) + ea : (fa = L, Y = (J ? E : E - t - q + 1) - ea);
            g && (x += g);
            E = x;
            0 < G && (E += ga / 2 * Math.cos(aa));
            if (S && (K = 0, J && (K = ga * Math.cos(aa)), E + K > da + 1 || 0 > E)) S.remove(), S = null
        } else {
            if (0 <= b && b <= V + 1 && (0 < t && 0 < s && b + k <= V + 1 && (Q = AmCharts.line(p, [0, t], [b + k, b + k], r, s, w), n.push(Q)), 0 < u)) R = AmCharts.line(p, [0, L, da + L], [b, b + E, b + E], A, u, w, C), n.push(R);
            R = "end";
            if (!0 == J && "left" == K || !1 == J && "right" == K) R = "start";
            B = b - m / 2;
            1 == U && 0 < D && !h && (e = AmCharts.fitToBounds(b, 0, V), P = AmCharts.fitToBounds(P, 0, V), aa = e - P, fill = AmCharts.polygon(p, [0, a.width, a.width, 0], [0, 0, aa, aa], v, D), fill.translate(L, e - aa + E), n.push(fill));
            B += m / 2;
            "right" == K ? (x += L + da + ea, B += E, J ? (x -= t + 4, g || (B -= m / 2 + 3)) : (x += t + 4 + q, B -= 2)) : J ? (x += t + 4 - ea, g || (B -= m / 2 + 3), h && (x += L, B += E)) : (x += -t - q - 4 - 2 - ea, B -= 2);
            Q && ("right" == K ? (fa += L + ea + da, Y += E, fa = J ? fa - q : fa + q) : (fa -= ea, J || (fa -= t + q)));
            g && (B += g);
            J = -3;
            "right" == K && (J += E);
            if (S && (B > V + 1 || B < J)) S.remove(), S = null
        }
        Q && Q.translate(fa, Y);
        !1 == a.visible && (Q && Q.remove(), S && (S.remove(), S = null));
        S && (S.attr({
            "text-anchor": R
        }), S.translate(x, B), 0 != G && S.rotate(-G), a.allLabels.push(S), this.label = S);
        a.counter = 0 == U ? 1 : 0;
        a.previousCoord = b;
        0 == this.set.node.childNodes.length && this.set.remove()
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {
        return this.label
    }
});
AmCharts.RecFill = AmCharts.Class({
    construct: function (a, b, d, e) {
        var f = a.dx,
            g = a.dy,
            h = a.orientation,
            j = 0;
        if (d < b) var k = b,
            b = d,
            d = k;
        var l = e.fillAlpha;
        isNaN(l) && (l = 0);
        k = a.chart.container;
        e = e.fillColor;
        "V" == h ? (b = AmCharts.fitToBounds(b, 0, a.viH), d = AmCharts.fitToBounds(d, 0, a.viH)) : (b = AmCharts.fitToBounds(b, 0, a.viW), d = AmCharts.fitToBounds(d, 0, a.viW));
        d -= b;
        isNaN(d) && (d = 4, j = 2, l = 0);
        0 > d && "object" == typeof e && (e = e.join(",").split(",").reverse());
        "V" == h ? (a = AmCharts.rect(k, a.width, d, e, l), a.translate(f, b - j + g)) : (a = AmCharts.rect(k, d, a.height, e, l), a.translate(b - j + f, g));
        this.set = k.set([a])
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {}
});
AmCharts.RadAxis = AmCharts.Class({
    construct: function (a) {
        var b = a.chart,
            d = a.axisThickness,
            e = a.axisColor,
            f = a.axisAlpha,
            g = a.x,
            h = a.y;
        this.set = b.container.set();
        b.axesSet.push(this.set);
        var j = a.axisTitleOffset,
            k = a.radarCategoriesEnabled,
            l = a.chart.fontFamily,
            m = a.fontSize;
        void 0 == m && (m = a.chart.fontSize);
        var o = a.color;
        void 0 == o && (o = a.chart.color);
        if (b) {
            this.axisWidth = a.height;
            for (var a = b.chartData, p = a.length, n = 0; n < p; n++) {
                var q = 180 - 360 / p * n,
                    r = g + this.axisWidth * Math.sin(q / 180 * Math.PI),
                    s = h + this.axisWidth * Math.cos(q / 180 * Math.PI);
                this.set.push(AmCharts.line(b.container, [g, r], [h, s], e, f, d));
                if (k) {
                    var t = "start",
                        r = g + (this.axisWidth + j) * Math.sin(q / 180 * Math.PI),
                        s = h + (this.axisWidth + j) * Math.cos(q / 180 * Math.PI);
                    if (180 == q || 0 == q) t = "middle", r -= 5;
                    0 > q && (t = "end", r -= 10);
                    180 == q && (s -= 5);
                    0 == q && (s += 5);
                    q = AmCharts.text(b.container, a[n].category, o, l, m, t);
                    q.translate(r + 5, s);
                    this.set.push(q);
                    q.getBBox()
                }
            }
        }
    }
});
AmCharts.RadItem = AmCharts.Class({
    construct: function (a, b, d, e, f, g, h) {
        void 0 == d && (d = "");
        var j = a.chart.fontFamily,
            k = a.fontSize;
        void 0 == k && (k = a.chart.fontSize);
        var l = a.color;
        void 0 == l && (l = a.chart.color);
        var m = a.chart.container;
        this.set = e = m.set();
        var o = a.axisColor,
            p = a.axisAlpha,
            n = a.tickLength,
            q = a.gridAlpha,
            r = a.gridThickness,
            s = a.gridColor,
            t = a.dashLength,
            u = a.fillColor,
            w = a.fillAlpha,
            A = a.labelsEnabled,
            f = a.counter,
            C = a.inside,
            v = a.gridType,
            b = b - a.height,
            D, g = a.x,
            O = a.y;
        h ? (A = !0, isNaN(h.tickLength) || (n = h.tickLength), void 0 != h.lineColor && (s = h.lineColor), isNaN(h.lineAlpha) || (q = h.lineAlpha), isNaN(h.dashLength) || (t = h.dashLength), isNaN(h.lineThickness) || (r = h.lineThickness), !0 == h.inside && (C = !0)) : d || (q /= 3, n /= 2);
        var G = "end",
            U = -1;
        C && (G = "start", U = 1);
        if (A) {
            var J = AmCharts.text(m, d, l, j, k, G);
            J.translate(g + (n + 3) * U, b);
            e.push(J);
            this.label = J;
            D = AmCharts.line(m, [g, g + n * U], [b, b], o, p, r);
            e.push(D)
        }
        b = a.y - b;
        if ("polygons" == v) {
            for (var L = [], E = [], $ = a.data.length, d = 0; d < $; d++) j = 180 - 360 / $ * d, L.push(b * Math.sin(j / 180 * Math.PI)), E.push(b * Math.cos(j / 180 * Math.PI));
            L.push(L[0]);
            E.push(E[0]);
            d = AmCharts.line(m, L, E, s, q, r, t)
        } else d = AmCharts.circle(m, b, "#FFFFFF", 0, r, s, q);
        d.translate(g, O);
        e.push(d);
        if (1 == f && 0 < w && !h) {
            h = a.previousCoord;
            if ("polygons" == v) {
                for (d = $; 0 <= d; d--) j = 180 - 360 / $ * d, L.push(h * Math.sin(j / 180 * Math.PI)), E.push(h * Math.cos(j / 180 * Math.PI));
                L = AmCharts.polygon(m, L, E, u, w)
            } else L = AmCharts.wedge(m, 0, 0, 0, -360, b, b, h, 0, {
                fill: u,
                "fill-opacity": w,
                stroke: 0,
                "stroke-opacity": 0,
                "stroke-width": 0
            });
            e.push(L);
            L.translate(g, O)
        }!1 == a.visible && (D && D.hide(), J && J.hide());
        a.counter = 0 == f ? 1 : 0;
        a.previousCoord = b
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {
        return this.label
    }
});
AmCharts.RadarFill = AmCharts.Class({
    construct: function (a, b, d, e) {
        var f = a.chart.container,
            g = e.fillAlpha,
            h = e.fillColor,
            d = Math.abs(d) - a.y,
            b = Math.abs(b) - a.y,
            j = -e.angle,
            e = -e.toAngle;
        isNaN(j) && (j = 0);
        isNaN(e) && (e = -360);
        this.set = f.set();
        void 0 == h && (h = "#000000");
        isNaN(g) && (g = 0);
        if ("polygons" == a.gridType) {
            for (var e = [], k = [], l = a.data.length, m = 0; m < l; m++) j = 180 - 360 / l * m, e.push(d * Math.sin(j / 180 * Math.PI)), k.push(d * Math.cos(j / 180 * Math.PI));
            e.push(e[0]);
            k.push(k[0]);
            for (m = l; 0 <= m; m--) j = 180 - 360 / l * m, e.push(b * Math.sin(j / 180 * Math.PI)), k.push(b * Math.cos(j / 180 * Math.PI));
            this.fill = AmCharts.polygon(f, e, k, h, g)
        } else this.fill = AmCharts.wedge(f, 0, 0, j, e - j, d, d, b, 0, {
            fill: h,
            "fill-opacity": g,
            stroke: 0,
            "stroke-opacity": 0,
            "stroke-width": 0
        });
        this.set.push(this.fill);
        this.fill.translate(a.x, a.y)
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {}
});
AmCharts.AmGraph = AmCharts.Class({
    construct: function () {
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem");
        this.type = "line";
        this.stackable = !0;
        this.columnCount = 1;
        this.columnIndex = 0;
        this.centerCustomBullets = this.showBalloon = !0;
        this.maxBulletSize = 50;
        this.minBulletSize = 0;
        this.balloonText = "[[value]]";
        this.hidden = this.scrollbar = this.animationPlayed = !1;
        this.columnWidth = 0.8;
        this.pointPosition = "middle";
        this.depthCount = 1;
        this.includeInMinMax = !0;
        this.negativeBase = 0;
        this.visibleInLegend = !0;
        this.showAllValueLabels = !1;
        this.showBalloonAt = "close";
        this.lineThickness = 1;
        this.dashLength = 0;
        this.connect = !0;
        this.lineAlpha = 1;
        this.bullet = "none";
        this.bulletBorderThickness = 2;
        this.bulletAlpha = this.bulletBorderAlpha = 1;
        this.bulletSize = 8;
        this.hideBulletsCount = this.bulletOffset = 0;
        this.labelPosition = "top";
        this.cornerRadiusTop = 0;
        this.cursorBulletAlpha = 1;
        this.gradientOrientation = "vertical";
        this.dy = this.dx = 0;
        this.periodValue = "";
        this.y = this.x = 0
    },
    draw: function () {
        var a = this.chart,
            b = a.container;
        this.container = b;
        this.destroy();
        var d = b.set();
        a.graphsSet.push(d);
        var e = b.set();
        a.bulletSet.push(e);
        this.bulletSet = e;
        if (!this.scrollbar) {
            var f = a.marginLeftReal,
                a = a.marginTopReal;
            d.translate(f, a);
            e.translate(f, a)
        }
        if ("column" == this.type) var g = b.set();
        AmCharts.remove(this.columnsSet);
        d.push(g);
        this.set = d;
        this.columnsSet = g;
        this.columnsArray = [];
        this.ownColumns = [];
        this.allBullets = [];
        this.animationArray = [];
        AmCharts.ifArray(this.data) && (b = !1, "xy" == this.chartType ? this.xAxis.axisCreated && this.yAxis.axisCreated && (b = !0) : this.valueAxis.axisCreated && (b = !0), !this.hidden && b && this.createGraph())
    },
    createGraph: function () {
        var a = this.chart;
        "inside" == this.labelPosition && (this.labelPosition = "bottom");
        this.sDur = a.startDuration;
        this.sEff = a.startEffect;
        this.startAlpha = a.startAlpha;
        this.seqAn = a.sequencedAnimation;
        this.baseCoord = this.valueAxis.baseCoord;
        this.fillColors || (this.fillColors = this.lineColor);
        void 0 == this.fillAlphas && (this.fillAlphas = 0);
        void 0 == this.bulletColor && (this.bulletColor = this.lineColor, this.bulletColorNegative = this.negativeLineColor);
        void 0 == this.bulletAlpha && (this.bulletAlpha = this.lineAlpha);
        this.bulletBorderColor || (this.bulletBorderAlpha = 0);
        if (!isNaN(this.valueAxis.min) && !isNaN(this.valueAxis.max)) {
            switch (this.chartType) {
            case "serial":
                this.createSerialGraph();
                break;
            case "radar":
                this.createRadarGraph();
                break;
            case "xy":
                this.createXYGraph(), this.positiveClip(this.set)
            }
            this.animationPlayed = !0
        }
    },
    createXYGraph: function () {
        var a = [],
            b = [],
            d = this.xAxis,
            e = this.yAxis;
        this.pmh = e.viH + 1;
        this.pmw = d.viW + 1;
        this.pmy = this.pmx = 0;
        for (var f = this.start; f <= this.end; f++) {
            var g = this.data[f].axes[d.id].graphs[this.id],
                h = g.values,
                j = h.x,
                k = h.y,
                h = d.getCoordinate(j),
                l = e.getCoordinate(k);
            !isNaN(j) && !isNaN(k) && (a.push(h), b.push(l), (j = this.createBullet(g, h, l, f)) || (j = 0), this.labelText && this.positionLabel(this.createLabel(g, h, l), this.labelPosition, j))
        }
        this.drawLineGraph(a, b);
        this.launchAnimation()
    },
    createRadarGraph: function () {
        for (var a = this.valueAxis.stackType, b = [], d = [], e, f, g = this.start; g <= this.end; g++) {
            var h = this.data[g].axes[this.valueAxis.id].graphs[this.id],
                j;
            j = "none" == a || "3d" == a ? h.values.value : h.values.close;
            if (isNaN(j)) this.drawLineGraph(b, d), b = [], d = [];
            else {
                var k = this.y - (this.valueAxis.getCoordinate(j) - this.height),
                    l = 180 - 360 / (this.end - this.start + 1) * g;
                j = k * Math.sin(l / 180 * Math.PI);
                k *= Math.cos(l / 180 * Math.PI);
                b.push(j);
                d.push(k);
                (l = this.createBullet(h, j, k, g)) || (l = 0);
                this.labelText && this.positionLabel(this.createLabel(h, j, k), this.labelPosition, l);
                isNaN(e) && (e = j);
                isNaN(f) && (f = k)
            }
        }
        b.push(e);
        d.push(f);
        this.drawLineGraph(b, d);
        this.launchAnimation()
    },
    positionLabel: function (a, b, d) {
        var e = a.attr("x"),
            f = a.attr("y"),
            g = a.getBBox();
        switch (b) {
        case "left":
            e -= (g.width + d) / 2 + 5;
            break;
        case "top":
            f -= (d + g.height) / 2 + 3;
            break;
        case "right":
            e += (g.width + d) / 2 + 5;
            break;
        case "bottom":
            f += (d + g.height) / 2 + 3
        }
        a.attr({
            x: e,
            y: f
        })
    },
    createSerialGraph: function () {
        var a = this.id,
            b = this.index,
            d = this.data,
            e = this.chart.container,
            f = this.valueAxis,
            g = this.type,
            h = this.columnWidth,
            j = this.width,
            k = this.height,
            l = this.y,
            m = this.rotate,
            o = this.columnCount,
            p = AmCharts.toCoordinate(this.cornerRadiusTop, h / 2),
            n = this.connect,
            q = [],
            r = [],
            s, t, u = this.chart.graphs.length,
            w, A = this.dx / this.depthCount,
            C = this.dy / this.depthCount,
            v = f.stackType,
            D = this.labelPosition,
            O = this.start,
            G = this.end,
            U = this.scrollbar,
            J = this.categoryAxis,
            L = this.baseCoord,
            E = this.negativeBase,
            $ = this.columnIndex,
            K = this.lineThickness,
            P = this.lineAlpha,
            Ma = this.lineColor,
            V = this.dashLength,
            da = this.set;
        "above" == D && (D = "top");
        "below" == D && (D = "bottom");
        var ea = 270;
        "horizontal" == this.gradientOrientation && (ea = 0);
        var Q = this.chart.columnSpacing,
            R = J.cellWidth,
            aa = (R * h - o) / o;
        Q > aa && (Q = aa);
        var Y, x, B, fa = k + 1,
            ga = j + 1,
            S = 0,
            Na = 0,
            Oa, Pa, Fa, Ga, ob = this.fillColors,
            Ca = this.negativeFillColors,
            ua = this.negativeLineColor,
            va = this.fillAlphas,
            Da = this.negativeFillAlphas;
        "object" == typeof va && (va = va[0]);
        "object" == typeof Da && (Da = Da[0]);
        var Ha = f.getCoordinate(f.min);
        f.logarithmic && (Ha = f.getCoordinate(f.minReal));
        this.minCoord = Ha;
        this.resetBullet && (this.bullet = "none");
        if (!U && ("line" == g || "smoothedLine" == g || "step" == g)) if (1 == d.length && "step" != g && "none" == this.bullet && (this.bullet = "round", this.resetBullet = !0), Ca || void 0 != ua) {
            var wa = E;
            wa > f.max && (wa = f.max);
            wa < f.min && (wa = f.min);
            f.logarithmic && (wa = f.minReal);
            var na = f.getCoordinate(wa),
                hb = f.getCoordinate(f.max);
            m ? (fa = k, ga = Math.abs(hb - na), Oa = k, Pa = Math.abs(Ha - na), Ga = Na = 0, f.reversed ? (S = 0, Fa = na) : (S = na, Fa = 0)) : (ga = j, fa = Math.abs(hb - na), Pa = j, Oa = Math.abs(Ha - na), Fa = S = 0, f.reversed ? (Ga = l, Na = na) : Ga = na + 1)
        }
        var oa = Math.round;
        this.pmx = oa(S);
        this.pmy = oa(Na);
        this.pmh = oa(fa);
        this.pmw = oa(ga);
        this.nmx = oa(Fa);
        this.nmy = oa(Ga);
        this.nmh = oa(Oa);
        this.nmw = oa(Pa);
        h = "column" == g ? (R * h - Q * (o - 1)) / o : R * h;
        1 > h && (h = 1);
        var M;
        if ("line" == g || "step" == g || "smoothedLine" == g) {
            if (0 < O) for (M = O - 1; - 1 < M; M--) if (Y = d[M], x = Y.axes[f.id].graphs[a], B = x.values.value) {
                O = M;
                break
            }
            if (G < d.length - 1) for (M = G + 1; M < d.length; M++) if (Y = d[M], x = Y.axes[f.id].graphs[a], B = x.values.value) {
                G = M;
                break
            }
        }
        G < d.length - 1 && G++;
        var ka = [],
            la = [],
            Qa = !1;
        if ("line" == g || "step" == g || "smoothedLine" == g) if (this.stackable && "regular" == v || "100%" == v) Qa = !0;
        for (M = O; M <= G; M++) {
            Y = d[M];
            x = Y.axes[f.id].graphs[a];
            x.index = M;
            var xa = NaN,
                z = NaN,
                y = NaN,
                Z = NaN,
                T = NaN,
                Ia = NaN,
                ya = NaN,
                Ja = NaN,
                za = NaN,
                W = NaN,
                X = NaN,
                pa = NaN,
                qa = NaN,
                N = NaN,
                ja = void 0,
                ra = ob,
                Ra = va,
                ba = Ma;
            void 0 != x.color && (ra = [x.color]);
            x.fillColors && (ra = x.fillColors);
            isNaN(x.alpha) || (Ra = [x.alpha]);
            var ma = x.values;
            f.recalculateToPercents && (ma = x.percents);
            if (ma) {
                N = !this.stackable || "none" == v || "3d" == v ? ma.value : ma.close;
                if ("candlestick" == g || "ohlc" == g) var N = ma.close,
                    Sa = ma.low,
                    ya = f.getCoordinate(Sa),
                    Ta = ma.high,
                    za = f.getCoordinate(Ta);
                var ia = ma.open,
                    y = f.getCoordinate(N);
                isNaN(ia) || (T = f.getCoordinate(ia));
                if (!U) switch (this.showBalloonAt) {
                case "close":
                    x.y = y;
                    break;
                case "open":
                    x.y = T;
                    break;
                case "high":
                    x.y = za;
                    break;
                case "low":
                    x.y = ya
                }
                var xa = Y.x[J.id],
                    Ea = R / 2,
                    Ua = R / 2;
                "start" == this.pointPosition && (xa -= R / 2, Ea = 0, Ua = R);
                U || (x.x = xa);
                m ? (z = y, Z = T, T = y = xa, isNaN(ia) && (Z = L), Ia = ya, Ja = za) : (Z = z = xa, isNaN(ia) && (T = L));
                switch (g) {
                case "line":
                    if (isNaN(N)) n || (this.drawLineGraph(q, r, ka, la), q = [], r = [], ka = [], la = []);
                    else if (N < E && (x.isNegative = !0), q.push(z), r.push(y), W = z, X = y, pa = z, qa = y, Qa) ka.push(Z), la.push(T);
                    break;
                case "smoothedLine":
                    if (isNaN(N)) n || (this.drawSmoothedGraph(q, r, ka, la), q = [], r = [], ka = [], la = []);
                    else if (N < E && (x.isNegative = !0), q.push(z), r.push(y), W = z, X = y, pa = z, qa = y, Qa) ka.push(Z), la.push(T);
                    break;
                case "step":
                    isNaN(N) ? n || (this.drawLineGraph(q, r, ka, la), q = [], r = [], ka = [], la = []) : (N < E && (x.isNegative = !0), m ? (s && n && (q.push(s), r.push(y - Ea)), r.push(y - Ea), q.push(z), r.push(y + Ua), q.push(z)) : (t && n && (r.push(t), q.push(z - Ea)), q.push(z - Ea), r.push(y), q.push(z + Ua), r.push(y)), s = z, t = y, W = z, X = y, pa = z, qa = y);
                    break;
                case "column":
                    if (!isNaN(N)) {
                        N < E && (x.isNegative = !0, Ca && (ra = Ca), void 0 != ua && (ba = ua));
                        var ib = f.min,
                            jb = f.max;
                        if (!(N < ib && (ia < ib || void 0 == ia) || N > jb && ia > jb)) if (m) {
                            if ("3d" == v) var H = y - 0.5 * (h + Q) + Q / 2 + C * $,
                                I = Z + A * $;
                            else H = y - (o / 2 - $) * (h + Q) + Q / 2, I = Z;
                            var F = h,
                                W = z,
                                X = H + h / 2,
                                pa = z,
                                qa = H + h / 2;
                            H + F > k && (F = k - H);
                            0 > H && (F += H, H = 0);
                            var ca = z - Z,
                                pb = I,
                                I = AmCharts.fitToBounds(I, 0, j),
                                ca = ca + (pb - I),
                                ca = AmCharts.fitToBounds(ca, -I, j - I);
                            H < k && 0 < F && (ja = new AmCharts.Cuboid(e, ca, F, A, C, ra, va, K, ba, P, ea, p), "bottom" != D && (D = "right", 0 > N ? D = "left" : (W += this.dx, "regular" != v && "100%" != v && (X += this.dy))))
                        } else {
                            "3d" == v ? (I = z - 0.5 * (h + Q) + Q / 2 + A * $, H = T + C * $) : (I = z - (o / 2 - $) * (h + Q) + Q / 2, H = T);
                            F = h;
                            W = I + h / 2;
                            X = y;
                            pa = I + h / 2;
                            qa = y;
                            I + F > j + $ * A && (F = j - I + $ * A);
                            0 > I && (F += I, I = 0);
                            var ca = y - T,
                                qb = H,
                                H = AmCharts.fitToBounds(H, 0, k),
                                ca = ca + (qb - H),
                                ca = AmCharts.fitToBounds(ca, -H, k - H);
                            I < j + $ * A && 0 < F && (ja = new AmCharts.Cuboid(e, F, ca, A, C, ra, va, K, ba, this.lineAlpha, ea, p), 0 > N ? D = "bottom" : ("regular" != v && "100%" != v && (W += this.dx), X += this.dy))
                        }
                        if (ja) {
                            var sa = ja.set;
                            sa.translate(I, H);
                            this.columnsSet.push(sa);
                            if (!U) {
                                "none" == v && (w = m ? (this.end + 1 - M) * u - b : u * M + b);
                                "3d" == v && (m ? (w = (u - b) * (this.end + 1 - M), X = H + h / 2) : (w = (u - b) * (M + 1), W += A * this.columnIndex), X += C * this.columnIndex);
                                if ("regular" == v || "100%" == v) D = "middle", w = m ? 0 < ma.value ? (this.end + 1 - M) * u + b : (this.end + 1 - M) * u - b : 0 < ma.value ? u * M + b : u * M - b;
                                this.columnsArray.push({
                                    column: ja,
                                    depth: w
                                });
                                x.x = m ? H + F / 2 : I + F / 2;
                                this.ownColumns.push(ja);
                                this.animateColumns(ja, M, z, Z, y, T);
                                this.addListeners(sa, x)
                            }
                            x.columnSprite = sa
                        }
                    }
                    break;
                case "candlestick":
                    if (!isNaN(ia) && !isNaN(Ta) && !isNaN(Sa) && !isNaN(N)) {
                        var Ka, Va;
                        N < ia && (x.isNegative = !0, Ca && (ra = Ca), Da && (Ra = Da), void 0 != ua && (ba = ua));
                        if (m) {
                            if (H = y - h / 2, I = Z, F = h, H + F > k && (F = k - H), 0 > H && (F += H, H = 0), H < k && 0 < F) {
                                var Wa, Xa;
                                N > ia ? (Wa = [z, Ja], Xa = [Z, Ia]) : (Wa = [Z, Ja], Xa = [z, Ia]);
                                y < k && 0 < y && (Ka = AmCharts.line(e, Wa, [y, y], ba, P, K), Va = AmCharts.line(e, Xa, [y, y], ba, P, K));
                                ca = z - Z;
                                ja = new AmCharts.Cuboid(e, ca, F, A, C, ra, va, K, ba, P, ea, p)
                            }
                        } else if (I = z - h / 2, H = T + K / 2, F = h, I + F > j && (F = j - I), 0 > I && (F += I, I = 0), ca = y - T, I < j && 0 < F) {
                            var ja = new AmCharts.Cuboid(e, F, ca, A, C, ra, Ra, K, ba, P, ea, p),
                                Ya, Za;
                            N > ia ? (Ya = [y, za], Za = [T, ya]) : (Ya = [T, za], Za = [y, ya]);
                            z < j && 0 < z && (Ka = AmCharts.line(e, [z, z], Ya, ba, P, K), Va = AmCharts.line(e, [z, z], Za, ba, P, K))
                        }
                        if (ja && (sa = ja.set, da.push(sa), sa.translate(I, H), Ka && (da.push(Ka), da.push(Va)), W = z, X = y, pa = z, qa = y, !U)) x.x = m ? H + F / 2 : I + F / 2, this.animateColumns(ja, M, z, Z, y, T), this.addListeners(sa, x)
                    }
                    break;
                case "ohlc":
                    if (!isNaN(ia) && !isNaN(Ta) && !isNaN(Sa) && !isNaN(N)) {
                        N < ia && (x.isNegative = !0, void 0 != ua && (ba = ua));
                        var $a, ab, bb;
                        if (m) {
                            var cb = y - h / 2,
                                cb = AmCharts.fitToBounds(cb, 0, k),
                                kb = AmCharts.fitToBounds(y, 0, k),
                                db = y + h / 2,
                                db = AmCharts.fitToBounds(db, 0, k);
                            ab = AmCharts.line(e, [Z, Z], [cb, kb], ba, P, K, V);
                            0 < y && y < k && ($a = AmCharts.line(e, [Ia, Ja], [y, y], ba, P, K, V));
                            bb = AmCharts.line(e, [z, z], [kb, db], ba, P, K, V)
                        } else {
                            var eb = z - h / 2,
                                eb = AmCharts.fitToBounds(eb, 0, j),
                                lb = AmCharts.fitToBounds(z, 0, j),
                                fb = z + h / 2,
                                fb = AmCharts.fitToBounds(fb, 0, j);
                            ab = AmCharts.line(e, [eb, lb], [T, T], ba, P, K, V);
                            0 < z && z < j && ($a = AmCharts.line(e, [z, z], [ya, za], ba, P, K, V));
                            bb = AmCharts.line(e, [lb, fb], [y, y], ba, P, K, V)
                        }
                        da.push(ab);
                        da.push($a);
                        da.push(bb);
                        W = z;
                        X = y;
                        pa = z;
                        qa = y
                    }
                }
                if (!U && !isNaN(N)) {
                    var mb = this.hideBulletsCount;
                    if (this.end - this.start <= mb || 0 == mb) {
                        var Aa = this.createBullet(x, pa, qa, M);
                        Aa || (Aa = 0);
                        if (this.labelText) {
                            var ha = this.createLabel(x, 0, 0),
                                ta = 0,
                                Ba = 0,
                                nb = ha.getBBox(),
                                La = nb.width,
                                gb = nb.height;
                            switch (D) {
                            case "left":
                                ta = -(La / 2 + Aa / 2 + 3);
                                break;
                            case "top":
                                Ba = -(gb / 2 + Aa / 2 + 3);
                                break;
                            case "right":
                                ta = Aa / 2 + 2 + La / 2;
                                break;
                            case "bottom":
                                m && "column" == g ? (W = L, 0 > N ? (ta = -6, ha.attr({
                                    "text-anchor": "end"
                                })) : (ta = 6, ha.attr({
                                    "text-anchor": "start"
                                }))) : (Ba = Aa / 2 + gb / 2, ha.x = -(La / 2 + 2));
                                break;
                            case "middle":
                                "column" == g && (m ? (ta = -(z - Z) / 2 - A, 0 > ca && (ta += A), Math.abs(z - Z) < La && !this.showAllValueLabels && (ha.remove(), ha = null)) : (Ba = -(y - T) / 2, 0 > ca && (Ba -= C), Math.abs(y - T) < gb && !this.showAllValueLabels && (ha.remove(), ha = null)))
                            }
                            if (ha) if (W += ta, X += Ba, ha.translate(W, X), m) {
                                if (0 > X || X > k) ha.remove(), ha = null
                            } else if (0 > W || W > j) ha.remove(), ha = null
                        }
                    }
                }
            }
        }
        if ("line" == g || "step" == g || "smoothedLine" == g) "smoothedLine" == g ? this.drawSmoothedGraph(q, r, ka, la) : this.drawLineGraph(q, r, ka, la), U || this.launchAnimation()
    },
    animateColumns: function (a, b) {
        var d = this;
        if (0 < d.sDur && !d.animationPlayed) if (d.seqAn) {
            a.set.hide();
            d.animationArray.push(a);
            var e = setTimeout(function () {
                d.animate.call(d)
            }, 1E3 * d.sDur / (d.end - d.start + 1) * (b - d.start));
            d.timeOuts.push(e)
        } else d.animate(a)
    },
    createLabel: function (a, b, d) {
        var e = this.chart,
            f = this.color;
        void 0 == f && (f = e.color);
        var g = this.fontSize;
        void 0 == g && (g = e.fontSize);
        a = e.formatString(this.labelText, a, this);
        a = AmCharts.cleanFromEmpty(a);
        e = AmCharts.text(this.container, a, f, e.fontFamily, g);
        e.translate(b, d);
        this.bulletSet.push(e);
        this.allBullets.push(e);
        return e
    },
    positiveClip: function (a) {
        a.clipRect(this.pmx, this.pmy, this.pmw, this.pmh)
    },
    negativeClip: function (a) {
        a.clipRect(this.nmx, this.nmy, this.nmw, this.nmh)
    },
    drawLineGraph: function (a, b, d, e) {
        if (1 < a.length) {
            var f = this.set,
                g = this.container,
                h = g.set(),
                j = g.set();
            f.push(h);
            f.push(j);
            var k = this.lineAlpha,
                l = this.lineThickness,
                m = this.dashLength,
                f = this.fillAlphas,
                o = this.fillColors,
                p = this.negativeLineColor,
                n = this.negativeFillColors,
                q = this.negativeFillAlphas,
                r = this.baseCoord,
                s = AmCharts.line(g, a, b, this.lineColor, k, l, m);
            h.push(s);
            void 0 != p && (k = AmCharts.line(g, a, b, p, k, l, m), j.push(k));
            if (0 < f && (k = a.join(";").split(";"), l = b.join(";").split(";"), "serial" == this.chartType && (0 < d.length ? (d.reverse(), e.reverse(), k = a.concat(d), l = b.concat(e)) : this.rotate ? (l.push(l[l.length - 1]), k.push(r), l.push(l[0]), k.push(r), l.push(l[0]), k.push(k[0])) : (k.push(k[k.length - 1]), l.push(r), k.push(k[0]), l.push(r), k.push(a[0]), l.push(l[0]))), a = AmCharts.polygon(g, k, l, o, f), h.push(a), n || void 0 != p)) q || (q = f), n || (n = p), g = AmCharts.polygon(g, k, l, n, q), j.push(g);
            this.applyMask(j, h)
        }
    },
    applyMask: function (a, b) {
        var d = a.length();
        "serial" == this.chartType && !this.scrollbar && (this.positiveClip(b), 0 < d && this.negativeClip(a));
        0 == d && AmCharts.remove(a)
    },
    drawSmoothedGraph: function (a, b) {
        if (1 < a.length) {
            var d = this.set,
                e = this.container,
                f = e.set(),
                g = e.set();
            d.push(f);
            d.push(g);
            var h = this.lineAlpha,
                j = this.lineThickness,
                d = this.dashLength,
                k = this.fillAlphas,
                l = this.fillColors,
                m = this.negativeLineColor,
                o = this.negativeFillColors,
                p = this.negativeFillAlphas,
                n = this.baseCoord,
                q = new AmCharts.Bezier(e, a, b, this.lineColor, h, j, l, 0, d);
            f.push(q.path);
            void 0 != m && (h = new AmCharts.Bezier(e, a, b, m, h, j, l, 0, d), g.push(h.path));
            if (0 < k && (h = "", this.rotate ? (h += " L" + n + "," + b[b.length - 1], h += " L" + n + "," + b[0]) : (h += " L" + a[a.length - 1] + "," + n, h += " L" + a[0] + "," + n), h += " L" + a[0] + "," + b[0], l = new AmCharts.Bezier(e, a, b, NaN, 0, 0, l, k, d, h), f.push(l.path), o || void 0 != m)) p || (p = k), o || (o = m), e = new AmCharts.Bezier(e, a, b, NaN, 0, 0, o, p, d, h), g.push(e.path);
            this.applyMask(g, f)
        }
    },
    launchAnimation: function () {
        var a = this;
        if (0 < a.sDur && !a.animationPlayed) {
            var b = a.set,
                d = a.bulletSet;
            AmCharts.VML || (b.attr({
                opacity: a.startAlpha
            }), d.attr({
                opacity: a.startAlpha
            }));
            b.hide();
            d.hide();
            a.seqAn ? (b = setTimeout(function () {
                a.animateGraphs.call(a)
            }, 1E3 * a.index * a.sDur), a.timeOuts.push(b)) : a.animateGraphs()
        }
    },
    animateGraphs: function () {
        var a = this.set,
            b = this.bulletSet,
            d = this.x,
            e = this.y;
        a.show();
        b.show();
        a && (this.rotate ? (a.translate(-1E3, e), b.translate(-1E3, e)) : (a.translate(d, -1E3), b.translate(d, -1E3)), a.animate({
            opacity: 1,
            translate: d + "," + e
        }, this.sDur, this.sEff), b.animate({
            opacity: 1,
            translate: d + "," + e
        }, this.sDur, this.sEff))
    },
    animate: function (a) {
        var b = this.animationArray;
        !a && 0 < b.length && (a = b[0], b.shift());
        a && (this.rotate ? a.animateWidth(this.sDur, this.container.easeOutElastic) : a.animateHeight(this.sDur, this.container.easeOutElastic), a.set.show())
    },
    legendKeyColor: function () {
        var a = this.legendColor,
            b = this.lineAlpha;
        void 0 == a && (a = this.lineColor, 0 == b && (b = this.fillColors) && (a = "object" == typeof b ? b[0] : b));
        return a
    },
    legendKeyAlpha: function () {
        var a = this.legendAlpha;
        void 0 == a && (a = this.lineAlpha, 0 == a && this.fillAlphas && (a = this.fillAlphas), 0 == a && (a = this.bulletAlpha), 0 == a && (a = 1));
        return a
    },
    createBullet: function (a, b, d) {
        var e = this.container,
            f = this.bulletOffset,
            g = this.bulletSize;
        isNaN(a.bulletSize) || (g = a.bulletSize);
        if (!isNaN(this.maxValue)) {
            var h = a.values.value;
            isNaN(h) || (g = h / this.maxValue * this.maxBulletSize)
        }
        g < this.minBulletSize && (g = this.minBulletSize);
        this.rotate ? b += f : d -= f;
        var j;
        if ("none" != this.bullet || a.bullet) {
            var k = this.bulletColor;
            a.isNegative && void 0 != this.bulletColorNegative && (k = this.bulletColorNegative);
            void 0 != a.color && (k = a.color);
            f = this.bullet;
            a.bullet && (f = a.bullet);
            var h = this.bulletBorderThickness,
                l = this.bulletBorderColor,
                m = this.bulletBorderAlpha,
                o = this.bulletAlpha;
            switch (f) {
            case "round":
                j = AmCharts.circle(e, g / 2, k, o, h, l, m);
                break;
            case "square":
                j = AmCharts.polygon(e, [0, g, g, 0], [0, 0, g, g], k, o, h, l, m);
                b -= g / 2;
                d -= g / 2;
                break;
            case "triangleUp":
                j = AmCharts.triangle(e, g, 0, k, o, h, l, m);
                break;
            case "triangleDown":
                j = AmCharts.triangle(e, g, 180, k, o, h, l, m);
                break;
            case "triangleLeft":
                j = AmCharts.triangle(e, g, 270, k, o, h, l, m);
                break;
            case "triangleRight":
                j = AmCharts.triangle(e, g, 90, k, o, h, l, m);
                break;
            case "bubble":
                j = AmCharts.circle(e, g / 2, k, o, h, l, m, !0)
            }
        }
        if (this.customBullet || a.customBullet) if (f = this.customBullet, a.customBullet && (f = a.customBullet), f) j && j.remove(), "function" == typeof f ? (j = new f, j.chart = this.chart, a.bulletConfig && (j.availableSpace = d, j.graph = this, a.bulletConfig.minCoord = this.minCoord - d, j.bulletConfig = a.bulletConfig), j.write(e), j = j.set) : (this.chart.path && (f = this.chart.path + f), j = e.image(f, 0, 0, g, g).attr({
            preserveAspectRatio: !0
        }), this.centerCustomBullets && (b -= g / 2, d -= g / 2));
        if (j) {
            this.allBullets.push(j);
            if ("serial" == this.chartType && (0 > b || b > this.width || d < -g / 2 || d > this.height)) j.remove(), j = null;
            j && (this.bulletSet.push(j), j.translate(b, d), this.addListeners(j, a))
        }
        return g
    },
    showBullets: function () {
        for (var a = 0; a < this.allBullets.length; a++) this.allBullets[a].show()
    },
    hideBullets: function () {
        for (var a = 0; a < this.allBullets.length; a++) this.allBullets[a].hide()
    },
    addListeners: function (a, b) {
        var d = this;
        a.mouseover(function () {
            d.handleRollOver(b)
        }).mouseout(function () {
            d.handleRollOut(b)
        }).click(function () {
            d.handleClick(b)
        }).dblclick(function () {
            d.handleDoubleClick(b)
        })
    },
    handleRollOver: function (a) {
        if (this.showBalloon && a) {
            var b = this.chart,
                d = {
                    type: "rollOverGraphItem",
                    item: a,
                    index: a.index,
                    graph: this
                };
            this.fire("rollOverGraphItem", d);
            b.fire("rollOverGraphItem", d);
            clearTimeout(b.hoverInt);
            d = !0;
            b.chartCursor && "serial" == this.chartType && (d = !1, b.chartCursor.valueBalloonsEnabled || (d = !0));
            d && (d = b.formatString(this.balloonText, a, a.graph), d = AmCharts.cleanFromEmpty(d), a = b.getBalloonColor(this, a), b.balloon.showBullet = !1, b.balloon.pointerOrientation = "V", b.showBalloon(d, a, !0))
        }
    },
    handleRollOut: function (a) {
        this.chart.hideBalloon();
        a && (a = {
            type: "rollOutGraphItem",
            item: a,
            index: a.index,
            graph: this
        }, this.fire("rollOutGraphItem", a), this.chart.fire("rollOutGraphItem", a))
    },
    handleClick: function (a) {
        if (a) {
            var b = {
                type: "clickGraphItem",
                item: a,
                index: a.index,
                graph: this
            };
            this.fire("clickGraphItem", b);
            this.chart.fire("clickGraphItem", b);
            a = a.url;
            b = this.urlTarget;
            a && ("_self" == b || !b ? window.location.href = a : (b = document.getElementsByName(b)[0]) ? b.src = a : window.open(a))
        }
    },
    handleDoubleClick: function (a) {
        a && (a = {
            type: "doubleClickGraphItem",
            item: a,
            index: a.index,
            graph: this
        }, this.fire("doubleClickGraphItem", a), this.chart.fire("doubleClickGraphItem", a))
    },
    zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.draw()
    },
    changeOpacity: function (a) {
        this.set && this.set.attr({
            opacity: a
        })
    },
    destroy: function () {
        AmCharts.remove(this.set);
        AmCharts.remove(this.bulletSet);
        var a = this.timeOuts;
        if (a) for (var b = 0; b < a.length; b++) clearTimeout(a[b]);
        this.timeOuts = []
    }
});
AmCharts.ChartCursor = AmCharts.Class({
    construct: function () {
        this.createEvents("changed", "zoomed", "onHideCursor", "draw");
        this.enabled = !0;
        this.cursorAlpha = 1;
        this.selectionAlpha = 0.2;
        this.cursorColor = "#CC0000";
        this.categoryBalloonAlpha = 1;
        this.color = "#FFFFFF";
        this.type = "cursor";
        this.zoomed = !1;
        this.zoomable = !0;
        this.pan = !1;
        this.animate = !0;
        this.categoryBalloonDateFormat = "MMM DD, YYYY";
        this.categoryBalloonEnabled = this.valueBalloonsEnabled = !0;
        this.rolledOver = !1;
        this.cursorPosition = "middle";
        this.bulletsEnabled = this.skipZoomDispatch = !1;
        this.bulletSize = 8;
        this.oneBalloonOnly = !1
    },
    draw: function () {
        var a = this;
        a.destroy();
        var b = a.chart,
            d = b.container;
        a.rotate = b.rotate;
        a.container = d;
        var e = d.set();
        e.translate(a.x, a.y);
        a.set = e;
        d = d.set();
        e.push(d);
        a.allBullets = d;
        b.cursorSet.push(e);
        e = new AmCharts.AmBalloon;
        e.chart = b;
        a.categoryBalloon = e;
        e.cornerRadius = 0;
        e.borderThickness = 0;
        e.borderAlpha = 0;
        e.showBullet = !1;
        b = a.categoryBalloonColor;
        void 0 == b && (b = a.cursorColor);
        e.fillColor = b;
        e.fillAlpha = a.categoryBalloonAlpha;
        e.borderColor = b;
        e.color = a.color;
        a.rotate && (e.pointerOrientation = "H");
        "cursor" == a.type ? a.createCursor() : a.createCrosshair();
        a.interval = setInterval(function () {
            a.detectMovement.call(a)
        }, 40)
    },
    updateData: function () {
        var a = this.chart.chartData;
        this.data = a;
        AmCharts.ifArray(a) && (this.firstTime = a[0].time, this.lastTime = a[a.length - 1].time)
    },
    createCursor: function () {
        var a = this.chart,
            b = this.cursorAlpha,
            d = a.categoryAxis,
            e = d.position,
            f = d.inside,
            g = d.axisThickness,
            h = this.categoryBalloon,
            j, k, l = a.dx,
            m = a.dy,
            o = this.x,
            p = this.y,
            n = this.width,
            q = this.height,
            a = a.rotate,
            r = d.tickLength;
        h.pointerWidth = r;
        a ? (j = [0, n, n + l], k = [0, 0, m]) : (j = [l, 0, 0], k = [m, 0, q - 1]);
        this.line = b = AmCharts.line(this.container, j, k, this.cursorColor, b, 1);
        this.set.push(b);
        a ? (f && (h.pointerWidth = 0), "right" == e ? f ? h.setBounds(o, p + m, o + n + l, p + q + m) : h.setBounds(o + n + l + g, p + m, o + n + 1E3, p + q + m) : f ? h.setBounds(o, p, n + o, q + p) : h.setBounds(-1E3, -1E3, o - r - g, p + q + 15)) : (h.maxWidth = n, d.parseDates && (r = 0, h.pointerWidth = 0), "top" == e ? f ? h.setBounds(o + l, p + m, n + l + o, q + p) : h.setBounds(o + l, -1E3, n + l + o, p + m - r - g) : f ? h.setBounds(o, p, n + o, q + p - r) : h.setBounds(o, p + q + r + g - 1, o + n, p + q + r + g));
        this.hideCursor()
    },
    createCrosshair: function () {
        var a = this.cursorAlpha,
            b = this.container,
            d = AmCharts.line(b, [0, 0], [0, this.height], this.cursorColor, a, 1),
            a = AmCharts.line(b, [0, this.width], [0, 0], this.cursorColor, a, 1);
        this.set.push(d);
        this.set.push(a);
        this.vLine = d;
        this.hLine = a;
        this.hideCursor()
    },
    detectMovement: function () {
        var a = this.chart;
        if (a.mouseIsOver) {
            var b = a.mouseX - this.x,
                d = a.mouseY - this.y;
            0 < b && b < this.width && 0 < d && d < this.height ? (this.drawing ? this.rolledOver || a.setMouseCursor("crosshair") : this.pan && (this.rolledOver || a.setMouseCursor("move")), this.rolledOver = !0, this.setPosition()) : this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
        } else this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
    },
    getMousePosition: function () {
        var a, b = this.width,
            d = this.height;
        a = this.chart;
        this.rotate ? (a = a.mouseY - this.y, 0 > a && (a = 0), a > d && (a = d)) : (a = a.mouseX - this.x, 0 > a && (a = 0), a > b && (a = b));
        return a
    },
    updateCrosshair: function () {
        var a = this.chart,
            b = a.mouseX - this.x,
            d = a.mouseY - this.y,
            e = this.vLine,
            f = this.hLine,
            b = AmCharts.fitToBounds(b, 0, this.width),
            d = AmCharts.fitToBounds(d, 0, this.height);
        0 < this.cursorAlpha && (e.show(), f.show(), e.translate(b, 0), f.translate(0, d));
        this.zooming && this.updateSelectionSize(b, d);
        !a.mouseIsOver && !this.zooming && this.hideCursor()
    },
    updateSelectionSize: function (a, b) {
        AmCharts.remove(this.selection);
        var d = this.selectionPosX,
            e = this.selectionPosY,
            f = 0,
            g = 0,
            h = this.width,
            j = this.height;
        if (!isNaN(a) && (d > a && (f = a, h = d - a), d < a && (f = d, h = a - d), d == a)) f = a, h = 0;
        if (!isNaN(b) && (e > b && (g = b, j = e - b), e < b && (g = e, j = b - e), e == b)) g = b, j = 0;
        0 < h && 0 < j && (d = AmCharts.rect(this.container, h, j, this.cursorColor, this.selectionAlpha), d.translate(f + this.x, g + this.y), this.selection = d)
    },
    arrangeBalloons: function () {
        var a = this.valueBalloons,
            b = this.x,
            d = this.y,
            e = this.height + d;
        a.sort(this.compareY);
        for (var f = 0; f < a.length; f++) {
            var g = a[f].balloon;
            g.setBounds(b, d, b + this.width, e);
            g.draw();
            e = g.yPos - 3
        }
        this.arrangeBalloons2()
    },
    compareY: function (a, b) {
        return a.yy < b.yy ? 1 : -1
    },
    arrangeBalloons2: function () {
        var a = this.valueBalloons;
        a.reverse();
        for (var b, d = this.x, e, f = 0; f < a.length; f++) {
            var g = a[f].balloon;
            b = g.bottom;
            var h = g.bottom - g.yPos;
            0 < f && b - h < e + 3 && (g.setBounds(d, e + 3, d + this.width, e + h + 3), g.draw());
            g.set && g.set.show();
            e = g.bottom
        }
    },
    showBullets: function () {
        AmCharts.remove(this.allBullets);
        for (var a = this.chart.graphs, b = 0; b < a.length; b++) {
            var d = a[b];
            if (d.showBalloon && !d.hidden && d.balloonText) {
                var e = this.data[this.index].axes[d.valueAxis.id].graphs[d.id],
                    f = e.y;
                if (!isNaN(f)) {
                    var g, h;
                    g = e.x;
                    this.rotate ? (h = f, f = g) : h = g;
                    d = AmCharts.circle(this.container, this.bulletSize / 2, this.chart.getBalloonColor(d, e), d.cursorBulletAlpha);
                    d.translate(h, f);
                    this.allBullets.push(d)
                }
            }
        }
    },
    destroy: function () {
        this.clear();
        AmCharts.remove(this.selection);
        this.selection = null;
        var a = this.categoryBalloon;
        a && a.destroy();
        this.destroyValueBalloons();
        AmCharts.remove(this.set);
        AmCharts.remove(this.allBullets)
    },
    clear: function () {
        clearInterval(this.interval)
    },
    destroyValueBalloons: function () {
        var a = this.valueBalloons;
        if (a) for (var b = 0; b < a.length; b++) a[b].balloon.destroy()
    },
    zoom: function (a, b, d, e) {
        var f = this.chart;
        this.destroyValueBalloons();
        this.zooming = !1;
        var g;
        this.rotate ? this.selectionPosY = g = f.mouseY : this.selectionPosX = g = f.mouseX;
        this.start = a;
        this.end = b;
        this.startTime = d;
        this.endTime = e;
        this.zoomed = !0;
        var h = f.categoryAxis,
            f = this.rotate;
        g = this.width;
        var j = this.height;
        h.parseDates && !h.equalSpacing ? (a = e - d + h.minDuration(), a = f ? j / a : g / a) : a = f ? j / (b - a) : g / (b - a);
        this.stepWidth = a;
        this.setPosition();
        this.hideCursor()
    },
    hideObj: function (a) {
        a && a.hide()
    },
    hideCursor: function (a) {
        void 0 == a && (a = !0);
        this.hideObj(this.set);
        this.hideObj(this.categoryBalloon);
        this.hideObj(this.line);
        this.hideObj(this.vLine);
        this.hideObj(this.hLine);
        this.destroyValueBalloons();
        AmCharts.remove(this.allBullets);
        AmCharts.remove(this.selection);
        this.previousIndex = NaN;
        a && this.fire("onHideCursor", {
            type: "onHideCursor",
            chart: this.chart,
            target: this
        });
        this.chart.setMouseCursor("auto")
    },
    setPosition: function (a, b) {
        void 0 == b && (b = !0);
        if ("cursor" == this.type) {
            if (AmCharts.ifArray(this.data)) {
                a || (a = this.getMousePosition());
                if ((a != this.previousMousePosition || !0 == this.zoomed || this.oneBalloonOnly) && !isNaN(a)) {
                    var d = this.chart.categoryAxis.xToIndex(a);
                    if (d != this.previousIndex || this.zoomed || "mouse" == this.cursorPosition || this.oneBalloonOnly) this.updateCursor(d, b), this.zoomed = !1
                }
                this.previousMousePosition = a
            }
        } else this.updateCrosshair()
    },
    updateCursor: function (a, b) {
        var d = this.chart,
            e = d.mouseX - this.x,
            f = d.mouseY - this.y;
        this.drawingNow && (AmCharts.remove(this.drawingLine), this.drawingLine = AmCharts.line(this.container, [this.drawStartX, e], [this.drawStartY, f], this.cursorColor, 1, 1));
        if (this.enabled) {
            void 0 == b && (b = !0);
            this.index = a;
            var g = d.categoryAxis,
                h = d.dx,
                j = d.dy,
                k = this.x,
                l = this.y,
                m = this.width,
                o = this.height,
                p = this.data[a],
                n = p.x[g.id],
                q = d.rotate,
                r = g.inside,
                s = this.stepWidth,
                t = this.categoryBalloon,
                u = this.firstTime,
                w = this.lastTime,
                A = this.cursorPosition,
                C = g.position,
                v = this.zooming,
                D = this.panning,
                O = d.graphs,
                G = g.axisThickness;
            if (d.mouseIsOver || v || D || this.forceShow) if (this.forceShow = !1, D) {
                m = this.panClickPos;
                d = this.panClickEndTime;
                v = this.panClickStartTime;
                k = this.panClickEnd;
                l = this.panClickStart;
                e = (q ? m - f : m - e) / s;
                if (!g.parseDates || g.equalSpacing) e = Math.round(e);
                0 != e && (g.parseDates && !g.equalSpacing ? (d + e > w && (e = w - d), v + e < u && (e = u - v), m = {
                    type: "zoomed"
                }, m.start = v + e, m.end = d + e, m.target = this, this.fire("zoomed", m)) : k + e >= this.data.length || 0 > l + e || (m = {
                    type: "zoomed"
                }, m.start = l + e, m.end = k + e, m.target = this, this.fire(m.type, m)))
            } else {
                "start" == A && (n -= g.cellWidth / 2);
                "mouse" == A && (n = q ? f - 2 : e - 2);
                if (q) {
                    if (0 > n) if (v) n = 0;
                    else {
                        this.hideCursor();
                        return
                    }
                    if (n > o + 1) if (v) n = o + 1;
                    else {
                        this.hideCursor();
                        return
                    }
                } else {
                    if (0 > n) if (v) n = 0;
                    else {
                        this.hideCursor();
                        return
                    }
                    if (n > m) if (v) n = m;
                    else {
                        this.hideCursor();
                        return
                    }
                }
                0 < this.cursorAlpha && (u = this.line, q ? u.translate(0, n + j) : u.translate(n, 0), u.show());
                this.linePos = q ? n + j : n;
                v && (q ? this.updateSelectionSize(NaN, n) : this.updateSelectionSize(n, NaN));
                u = !0;
                v && (u = !1);
                this.categoryBalloonEnabled && u ? (q ? (r && ("right" == C ? t.setBounds(k, l + j, k + m + h, l + n + j) : t.setBounds(k, l + j, k + m + h, l + n)), "right" == C ? r ? t.setPosition(k + m + h, l + n + j) : t.setPosition(k + m + h + G, l + n + j) : r ? t.setPosition(k, l + n) : t.setPosition(k - G, l + n)) : "top" == C ? r ? t.setPosition(k + n + h, l + j) : t.setPosition(k + n + h, l + j - G + 1) : r ? t.setPosition(k + n, l + o) : t.setPosition(k + n, l + o + G - 1), g.parseDates) ? (g = AmCharts.formatDate(p.category, this.categoryBalloonDateFormat), -1 != g.indexOf("fff") && (g = AmCharts.formatMilliseconds(g, p.category)), t.showBalloon(g)) : t.showBalloon(p.category) : t.hide();
                O && this.bulletsEnabled && this.showBullets();
                this.destroyValueBalloons();
                if (O && this.valueBalloonsEnabled && u && d.balloon.enabled) {
                    this.valueBalloons = g = [];
                    if (this.oneBalloonOnly) for (var h = Infinity, U, u = 0; u < O.length; u++) s = O[u], s.showBalloon && !s.hidden && s.balloonText && (t = p.axes[s.valueAxis.id].graphs[s.id], w = t.y, isNaN(w) || (q ? Math.abs(e - w) < h && (h = Math.abs(e - w), U = s) : Math.abs(f - w) < h && (h = Math.abs(f - w), U = s)));
                    for (u = 0; u < O.length; u++) if (s = O[u], !(this.oneBalloonOnly && s != U) && s.showBalloon && !s.hidden && s.balloonText && (t = p.axes[s.valueAxis.id].graphs[s.id], w = t.y, !isNaN(w))) {
                        j = t.x;
                        n = !0;
                        if (q) {
                            if (h = w, 0 > j || j > o) n = !1
                        } else if (h = j, j = w, 0 > h || h > m) n = !1;
                        n && (r = d.getBalloonColor(s, t), n = new AmCharts.AmBalloon, n.chart = d, AmCharts.copyProperties(d.balloon, n), n.setBounds(k, l, k + m, l + o), n.pointerOrientation = "H", n.changeColor(r), void 0 != s.balloonAlpha && (n.fillAlpha = s.balloonAlpha), void 0 != s.balloonTextColor && (n.color = s.balloonTextColor), n.setPosition(h + k, j + l), s = d.formatString(s.balloonText, t, s), "" != s && n.showBalloon(s), !q && n.set && n.set.hide(), g.push({
                            yy: w,
                            balloon: n
                        }))
                    }
                    q || this.arrangeBalloons()
                }
                b ? (m = {
                    type: "changed"
                }, m.index = a, m.zooming = v, m.position = q ? f : e, m.target = this, d.fire("changed", m), this.fire("changed", m), this.skipZoomDispatch = !1) : (this.skipZoomDispatch = !0, d.updateLegendValues(a));
                this.previousIndex = a
            }
        } else this.hideCursor()
    },
    enableDrawing: function (a) {
        this.enabled = !a;
        this.hideCursor();
        this.rolledOver = !1;
        this.drawing = a
    },
    isZooming: function (a) {
        a && a != this.zooming && this.handleMouseDown("fake");
        !a && a != this.zooming && this.handleMouseUp()
    },
    handleMouseOut: function () {
        this.enabled && (this.zooming ? this.setPosition() : (this.index = void 0, this.fire("changed", {
            type: "changed",
            index: void 0,
            target: this
        }), this.hideCursor()))
    },
    handleReleaseOutside: function () {
        this.handleMouseUp()
    },
    handleMouseUp: function () {
        var a = this.chart,
            b = a.mouseX - this.x,
            a = a.mouseY - this.y;
        if (this.drawingNow) {
            this.drawingNow = !1;
            AmCharts.remove(this.drawingLine);
            var d = this.drawStartX,
                e = this.drawStartY;
            if (2 < Math.abs(d - b) || 2 < Math.abs(e - a)) d = {
                type: "draw",
                initialX: d,
                initialY: e,
                finalX: b,
                finalY: a
            }, this.fire(d.type, d)
        }
        if (this.enabled) {
            if (this.pan) this.rolledOver = !1;
            else if (this.zoomable && this.zooming) {
                if ("cursor" == this.type) {
                    if (this.rotate ? this.selectionPosY = b = a : this.selectionPosX = b, !(2 > Math.abs(b - this.initialMouse) && this.fromIndex == this.index)) if (d = {
                        type: "zoomed"
                    }, this.index < this.fromIndex ? (d.end = this.fromIndex, d.start = this.index) : (d.end = this.index, d.start = this.fromIndex), b = this.chart.categoryAxis, b.parseDates && !b.equalSpacing && (d.start = this.data[d.start].time, d.end = this.data[d.end].time), AmCharts.remove(this.allBullets), !this.skipZoomDispatch) d.target = this, this.fire("zoomed", d)
                } else {
                    var f = this.initialMouseX,
                        g = this.initialMouseY;
                    if (!(3 > Math.abs(b - f) && 3 > Math.abs(a - g))) {
                        var d = {
                            type: "zoomed"
                        },
                            e = Math.min(f, b),
                            h = Math.min(g, a),
                            b = Math.abs(f - b),
                            a = Math.abs(g - a);
                        d.selectionHeight = a;
                        d.selectionWidth = b;
                        d.selectionY = h;
                        d.selectionX = e;
                        this.skipZoomDispatch || (d.target = this, this.fire("zoomed", d))
                    }
                }
                AmCharts.remove(this.selection)
            }
            this.panning = this.zooming = this.skipZoomDispatch = !1
        }
    },
    handleMouseDown: function (a) {
        if (this.zoomable || this.pan || this.drawing) {
            var b = this.rotate,
                d = this.chart,
                e = d.mouseX - this.x,
                f = d.mouseY - this.y;
            if (0 < e && e < this.width && 0 < f && f < this.height || "fake" == a) this.setPosition(), this.drawing ? (this.drawStartY = f, this.drawStartX = e, this.drawingNow = !0) : this.pan ? (this.zoomable = !1, d.setMouseCursor("move"), this.panning = !0, this.hideCursor(!0), this.panClickPos = b ? f : e, this.panClickStart = this.start, this.panClickEnd = this.end, this.panClickStartTime = this.startTime, this.panClickEndTime = this.endTime) : this.zoomable && ("cursor" == this.type ? (this.fromIndex = this.index, b ? (this.initialMouse = f, this.selectionPosY = this.linePos) : (this.initialMouse = e, this.selectionPosX = this.linePos)) : (this.initialMouseX = e, this.initialMouseY = f, this.selectionPosX = e, this.selectionPosY = f), this.zooming = !0)
        }
    }
});
AmCharts.SimpleChartScrollbar = AmCharts.Class({
    construct: function () {
        this.createEvents("zoomed");
        this.backgroundColor = "#D4D4D4";
        this.backgroundAlpha = 1;
        this.selectedBackgroundColor = "#EFEFEF";
        this.scrollDuration = this.selectedBackgroundAlpha = 1;
        this.resizeEnabled = !0;
        this.hideResizeGrips = !1;
        this.scrollbarHeight = 20;
        this.updateOnReleaseOnly = !1;
        9 > document.documentMode && (this.updateOnReleaseOnly = !0);
        this.dragIconWidth = 11;
        this.dragIconHeight = 18
    },
    draw: function () {
        var a = this;
        a.destroy();
        a.interval = setInterval(function () {
            a.updateScrollbar.call(a)
        }, 40);
        var b = a.chart.container,
            d = a.rotate,
            e = a.chart,
            f = b.set();
        a.set = f;
        e.scrollbarsSet.push(f);
        var g, h;
        d ? (g = a.scrollbarHeight, h = e.plotAreaHeight) : (h = a.scrollbarHeight, g = e.plotAreaWidth);
        a.width = g;
        if ((a.height = h) && g) {
            var j = AmCharts.rect(b, g, h, a.backgroundColor, a.backgroundAlpha);
            a.bg = j;
            f.push(j);
            j = AmCharts.rect(b, g, h, "#000", 0.005);
            f.push(j);
            a.invisibleBg = j;
            j.click(function () {
                a.handleBgClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            }).touchend(function () {
                a.handleBgClick()
            });
            j = AmCharts.rect(b, g, h, a.selectedBackgroundColor, a.selectedBackgroundAlpha);
            a.selectedBG = j;
            f.push(j);
            g = AmCharts.rect(b, g, h, "#000", 0.005);
            a.dragger = g;
            f.push(g);
            g.mousedown(function (b) {
                a.handleDragStart(b)
            }).mouseup(function () {
                a.handleDragStop()
            }).mouseover(function () {
                a.handleDraggerOver()
            }).mouseout(function () {
                a.handleMouseOut()
            }).touchstart(function (b) {
                a.handleDragStart(b)
            }).touchend(function () {
                a.handleDragStop()
            });
            g = e.pathToImages;
            d ? (j = g + "dragIconH.gif", h = a.dragIconWidth, g = a.dragIconHeight) : (j = g + "dragIcon.gif", g = a.dragIconWidth, h = a.dragIconHeight);
            d = b.image(j, 0, 0, g, h);
            g = b.image(j, 0, 0, g, h);
            h = AmCharts.rect(b, 10, 20, "#000", 0.005);
            j = AmCharts.rect(b, 10, 20, "#000", 0.005);
            d = b.set([d, j]);
            b = b.set([g, h]);
            a.iconLeft = d;
            f.push(a.iconLeft);
            a.iconRight = b;
            f.push(b);
            d.mousedown(function () {
                a.leftDragStart()
            }).mouseup(function () {
                a.leftDragStop()
            }).mouseover(function () {
                a.iconRollOver()
            }).mouseout(function () {
                a.iconRollOut()
            }).touchstart(function () {
                a.leftDragStart()
            }).touchend(function () {
                a.leftDragStop()
            });
            b.mousedown(function () {
                a.rightDragStart()
            }).mouseup(function () {
                a.rightDragStop()
            }).mouseover(function () {
                a.iconRollOver()
            }).mouseout(function () {
                a.iconRollOut()
            }).touchstart(function () {
                a.rightDragStart()
            }).touchend(function () {
                a.rightDragStop()
            });
            AmCharts.ifArray(e.chartData) ? f.show() : f.hide();
            a.hideDragIcons()
        }
        f.translate(a.x, a.y);
        a.clipDragger(!1)
    },
    updateScrollbarSize: function (a, b) {
        var d = this.dragger,
            e, f, g, h;
        this.rotate ? (e = 0, f = a, g = this.width + 1, h = b - a, d.setAttr("height", b - a), d.setAttr("y", f)) : (e = a, f = 0, g = b - a, h = this.height + 1, d.setAttr("width", b - a), d.setAttr("x", e));
        this.clipAndUpdate(e, f, g, h)
    },
    updateScrollbar: function () {
        var a, b = !1,
            d, e, f = this.x,
            g = this.y,
            h = this.dragger,
            j = this.getDBox();
        d = j.x + f;
        e = j.y + g;
        var k = j.width,
            j = j.height,
            l = this.rotate,
            m = this.chart,
            o = this.width,
            p = this.height,
            n = m.mouseX,
            q = m.mouseY;
        a = this.initialMouse;
        m.mouseIsOver && (this.dragging && (m = this.initialCoord, l ? (a = m + (q - a), 0 > a && (a = 0), m = p - j, a > m && (a = m), h.setAttr("y", a)) : (a = m + (n - a), 0 > a && (a = 0), m = o - k, a > m && (a = m), h.setAttr("x", a))), this.resizingRight && (l ? (a = q - e, a + e > p + g && (a = p - e + g), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 == a && (a = 0.1), h.setAttr("height", a))) : (a = n - d, a + d > o + f && (a = o - d + f), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 == a && (a = 0.1), h.setAttr("width", a)))), this.resizingLeft && (l ? (d = e, e = q, e < g && (e = g), e > p + g && (e = p + g), a = !0 == b ? d - e : j + d - e, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, h.setAttr("y", d + j - g)) : (0 == a && (a = 0.1), h.setAttr("y", e - g), h.setAttr("height", a))) : (e = n, e < f && (e = f), e > o + f && (e = o + f), a = !0 == b ? d - e : k + d - e, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, h.setAttr("x", d + k - f)) : (0 == a && (a = 0.1), h.setAttr("x", e - f), h.setAttr("width", a)))), this.clipDragger(!0))
    },
    clipDragger: function (a) {
        var b = this.getDBox(),
            d = b.x,
            e = b.y,
            f = b.width,
            b = b.height,
            g = !1;
        if (this.rotate) {
            if (d = 0, f = this.width + 1, this.clipY != e || this.clipH != b) g = !0
        } else if (e = 0, b = this.height + 1, this.clipX != d || this.clipW != f) g = !0;
        g && (this.clipAndUpdate(d, e, f, b), a && (this.updateOnReleaseOnly || this.dispatchScrollbarEvent()))
    },
    maskGraphs: function () {},
    clipAndUpdate: function (a, b, d, e) {
        this.clipX = a;
        this.clipY = b;
        this.clipW = d;
        this.clipH = e;
        this.selectedBG.clipRect(a, b, d, e);
        this.updateDragIconPositions();
        this.maskGraphs(a, b, d, e)
    },
    dispatchScrollbarEvent: function () {
        if (this.skipEvent) this.skipEvent = !1;
        else {
            this.chart.hideBalloon();
            var a = this.getDBox(),
                b = a.x,
                d = a.y,
                e = a.width,
                a = a.height;
            this.rotate ? (b = d, e = this.height / a) : e = this.width / e;
            e = {
                type: "zoomed",
                position: b,
                multiplyer: e
            };
            this.fire(e.type, e)
        }
    },
    updateDragIconPositions: function () {
        var a = this.getDBox(),
            b = a.x,
            d = a.y,
            e = this.iconLeft,
            f = this.iconRight,
            g, h, j = this.scrollbarHeight;
        this.rotate ? (g = this.dragIconWidth, h = this.dragIconHeight, e.translate((j - h) / 2, d - g / 2), f.translate((j - h) / 2, d + a.height - g / 2)) : (g = this.dragIconHeight, h = this.dragIconWidth, e.translate(b - h / 2, (j - g) / 2), f.translate(b + -h / 2 + a.width, (j - g) / 2))
    },
    showDragIcons: function () {
        this.resizeEnabled && (this.iconLeft.show(), this.iconRight.show())
    },
    hideDragIcons: function () {
        !this.resizingLeft && !this.resizingRight && !this.dragging && (this.hideResizeGrips && (this.iconLeft.hide(), this.iconRight.hide()), this.removeCursors())
    },
    removeCursors: function () {
        this.chart.setMouseCursor("auto")
    },
    relativeZoom: function (a, b) {
        this.dragger.stop();
        this.multiplyer = a;
        this.position = b;
        this.updateScrollbarSize(b, this.rotate ? b + this.height / a : b + this.width / a)
    },
    destroy: function () {
        this.clear();
        AmCharts.remove(this.set)
    },
    clear: function () {
        clearInterval(this.interval)
    },
    handleDragStart: function () {
        var a = this.chart;
        this.dragger.stop();
        this.removeCursors();
        this.dragging = !0;
        var b = this.getDBox();
        this.rotate ? (this.initialCoord = b.y, this.initialMouse = a.mouseY) : (this.initialCoord = b.x, this.initialMouse = a.mouseX)
    },
    handleDragStop: function () {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent());
        this.dragging = !1;
        this.mouseIsOver && this.removeCursors();
        this.updateScrollbar()
    },
    handleDraggerOver: function () {
        this.handleMouseOver()
    },
    leftDragStart: function () {
        this.dragger.stop();
        this.resizingLeft = !0
    },
    leftDragStop: function () {
        this.resizingLeft = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    },
    rightDragStart: function () {
        this.dragger.stop();
        this.resizingRight = !0
    },
    rightDragStop: function () {
        this.resizingRight = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    },
    iconRollOut: function () {
        this.removeCursors()
    },
    iconRollOver: function () {
        this.rotate ? this.chart.setMouseCursor("n-resize") : this.chart.setMouseCursor("e-resize");
        this.handleMouseOver()
    },
    getDBox: function () {
        return this.dragger.getBBox()
    },
    handleBgClick: function () {
        if (!this.resizingRight && !this.resizingLeft) {
            this.zooming = !0;
            var a, b, d = this.scrollDuration,
                e = this.dragger;
            a = this.getDBox();
            var f = a.height,
                g = a.width;
            b = this.chart;
            var h = this.y,
                j = this.x,
                k = this.rotate;
            k ? (a = "y", b = b.mouseY - f / 2 - h, b = AmCharts.fitToBounds(b, 0, this.height - f)) : (a = "x", b = b.mouseX - g / 2 - j, b = AmCharts.fitToBounds(b, 0, this.width - g));
            this.updateOnReleaseOnly ? (this.skipEvent = !1, e.setAttr(a, b), this.dispatchScrollbarEvent(), this.clipDragger()) : (b = Math.round(b), k ? e.animate({
                y: b
            }, d, ">") : e.animate({
                x: b
            }, d, ">"))
        }
    },
    updateOnRelease: function () {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent())
    },
    handleReleaseOutside: function () {
        if (this.set) {
            if (this.resizingLeft || this.resizingRight || this.dragging) this.updateOnRelease(), this.removeCursors();
            this.mouseIsOver = this.dragging = this.resizingRight = this.resizingLeft = !1;
            this.hideDragIcons();
            this.updateScrollbar()
        }
    },
    handleMouseOver: function () {
        this.mouseIsOver = !0;
        this.showDragIcons()
    },
    handleMouseOut: function () {
        this.mouseIsOver = !1;
        this.hideDragIcons()
    }
});
AmCharts.ChartScrollbar = AmCharts.Class({
    inherits: AmCharts.SimpleChartScrollbar,
    construct: function () {
        AmCharts.ChartScrollbar.base.construct.call(this);
        this.graphLineColor = "#BBBBBB";
        this.graphLineAlpha = 0;
        this.graphFillColor = "#BBBBBB";
        this.graphFillAlpha = 1;
        this.selectedGraphLineColor = "#888888";
        this.selectedGraphLineAlpha = 0;
        this.selectedGraphFillColor = "#888888";
        this.selectedGraphFillAlpha = 1;
        this.gridCount = 0;
        this.gridColor = "#FFFFFF";
        this.gridAlpha = 0.7;
        this.skipEvent = this.autoGridCount = !1;
        this.color = "#FFFFFF";
        this.scrollbarCreated = !1
    },
    init: function () {
        var a = this.categoryAxis,
            b = this.chart;
        a || (this.categoryAxis = a = new AmCharts.CategoryAxis);
        a.chart = b;
        a.id = "scrollbar";
        a.dateFormats = b.categoryAxis.dateFormats;
        a.axisItemRenderer = AmCharts.RecItem;
        a.axisRenderer = AmCharts.RecAxis;
        a.guideFillRenderer = AmCharts.RecFill;
        a.inside = !0;
        a.fontSize = this.fontSize;
        a.tickLength = 0;
        a.axisAlpha = 0;
        if (this.graph && (a = this.valueAxis, a || (this.valueAxis = a = new AmCharts.ValueAxis, a.visible = !1, a.scrollbar = !0, a.axisItemRenderer = AmCharts.RecItem, a.axisRenderer = AmCharts.RecAxis, a.guideFillRenderer = AmCharts.RecFill, a.labelsEnabled = !1, a.chart = b), b = this.unselectedGraph, b || (b = new AmCharts.AmGraph, b.scrollbar = !0, this.unselectedGraph = b), b = this.selectedGraph, !b)) b = new AmCharts.AmGraph, b.scrollbar = !0, this.selectedGraph = b;
        this.scrollbarCreated = !0
    },
    draw: function () {
        var a = this;
        AmCharts.ChartScrollbar.base.draw.call(a);
        a.scrollbarCreated || a.init();
        var b = a.chart,
            d = b.chartData,
            e = a.categoryAxis,
            f = a.rotate,
            g = a.x,
            h = a.y,
            j = a.width,
            k = a.height,
            l = b.categoryAxis,
            m = a.set;
        e.setOrientation(!f);
        e.parseDates = l.parseDates;
        e.rotate = f;
        e.equalSpacing = l.equalSpacing;
        e.minPeriod = l.minPeriod;
        e.startOnAxis = l.startOnAxis;
        e.viW = j;
        e.viH = k;
        e.width = j;
        e.height = k;
        e.gridCount = a.gridCount;
        e.gridColor = a.gridColor;
        e.gridAlpha = a.gridAlpha;
        e.color = a.color;
        e.autoGridCount = a.autoGridCount;
        e.parseDates && !e.equalSpacing && e.timeZoom(d[0].time, d[d.length - 1].time);
        e.zoom(0, d.length - 1);
        if (l = a.graph) {
            var o = a.valueAxis,
                p = l.valueAxis;
            o.id = p.id;
            o.rotate = f;
            o.setOrientation(f);
            o.width = j;
            o.height = k;
            o.viW = j;
            o.viH = k;
            o.dataProvider = d;
            o.reversed = p.reversed;
            o.logarithmic = p.logarithmic;
            o.gridAlpha = 0;
            o.axisAlpha = 0;
            m.push(o.set);
            f ? o.y = h : o.x = g;
            for (var g = Infinity, h = -Infinity, n = 0; n < d.length; n++) {
                var q = d[n].axes[p.id].graphs[l.id].values,
                    r;
                for (r in q) if ("percents" != r && "total" != r) {
                    var s = q[r];
                    s < g && (g = s);
                    s > h && (h = s)
                }
            }
            Infinity != g && (o.minimum = g); - Infinity != h && (o.maximum = h + 0.1 * (h - g));
            g == h && (o.minimum -= 1, o.maximum += 1);
            o.zoom(0, d.length - 1);
            r = a.unselectedGraph;
            r.id = l.id;
            r.rotate = f;
            r.chart = b;
            r.chartType = b.chartType;
            r.data = d;
            r.valueAxis = o;
            r.chart = l.chart;
            r.categoryAxis = a.categoryAxis;
            r.valueField = l.valueField;
            r.openField = l.openField;
            r.closeField = l.closeField;
            r.highField = l.highField;
            r.lowField = l.lowField;
            r.lineAlpha = a.graphLineAlpha;
            r.lineColor = a.graphLineColor;
            r.fillAlphas = a.graphFillAlpha;
            r.fillColors = a.graphFillColor;
            r.connect = l.connect;
            r.hidden = l.hidden;
            r.width = j;
            r.height = k;
            p = a.selectedGraph;
            p.id = l.id;
            p.rotate = f;
            p.chart = b;
            p.chartType = b.chartType;
            p.data = d;
            p.valueAxis = o;
            p.chart = l.chart;
            p.categoryAxis = e;
            p.valueField = l.valueField;
            p.openField = l.openField;
            p.closeField = l.closeField;
            p.highField = l.highField;
            p.lowField = l.lowField;
            p.lineAlpha = a.selectedGraphLineAlpha;
            p.lineColor = a.selectedGraphLineColor;
            p.fillAlphas = a.selectedGraphFillAlpha;
            p.fillColors = a.selectedGraphFillColor;
            p.connect = l.connect;
            p.hidden = l.hidden;
            p.width = j;
            p.height = k;
            b = a.graphType;
            b || (b = l.type);
            r.type = b;
            p.type = b;
            d = d.length - 1;
            r.zoom(0, d);
            p.zoom(0, d);
            p.set.click(function () {
                a.handleBackgroundClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            });
            r.set.click(function () {
                a.handleBackgroundClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            });
            m.push(r.set);
            m.push(p.set)
        }
        m.push(e.set);
        m.push(e.labelsSet);
        a.bg.toBack();
        a.invisibleBg.toFront();
        a.dragger.toFront();
        a.iconLeft.toFront();
        a.iconRight.toFront()
    },
    timeZoom: function (a, b) {
        this.startTime = a;
        this.endTime = b;
        this.timeDifference = b - a;
        this.skipEvent = !0;
        this.zoomScrollbar()
    },
    zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.skipEvent = !0;
        this.zoomScrollbar()
    },
    dispatchScrollbarEvent: function () {
        if (this.skipEvent) this.skipEvent = !1;
        else {
            var a = this.chart.chartData,
                b, d, e = this.dragger.getBBox();
            b = e.x + this.x;
            var f = e.y + this.y;
            d = e.width;
            e = e.height;
            this.rotate && (b = f, d = e);
            f = this.categoryAxis;
            e = this.stepWidth;
            if (f.parseDates && !f.equalSpacing) {
                a = a[0].time;
                b = this.rotate ? b - this.y : b - this.x;
                var g = f.minDuration(),
                    f = Math.round(b / e) + a,
                    a = this.dragging ? f + this.timeDifference : Math.round((b + d) / e) + a - g;
                f > a && (f = a);
                if (f != this.startTime || a != this.endTime) this.startTime = f, this.endTime = a, b = {
                    type: "zoomed",
                    start: f,
                    end: a,
                    startDate: new Date(f),
                    endDate: new Date(a)
                }, this.fire(b.type, b)
            } else if (f.startOnAxis || (b += e / 2), d -= this.stepWidth / 2, e = f.xToIndex(b), b = f.xToIndex(b + d), e != this.start || this.end != b) {
                f.startOnAxis && (this.resizingRight && e == b && b++, this.resizingLeft && e == b && (0 < e ? e-- : b = 1));
                this.start = e;
                this.end = this.dragging ? this.start + this.difference : b;
                b = {
                    type: "zoomed",
                    start: this.start,
                    end: this.end
                };
                if (f.parseDates && (a[this.start] && (b.startDate = new Date(a[this.start].time)), a[this.end])) b.endDate = new Date(a[this.end].time);
                this.fire(b.type, b)
            }
        }
    },
    zoomScrollbar: function () {
        var a, b;
        b = this.chart.chartData;
        var d = this.categoryAxis,
            e;
        d.parseDates && !d.equalSpacing ? (e = d.stepWidth, b = b[0].time, a = e * (this.startTime - b), b = e * (this.endTime - b + d.minDuration())) : (a = b[this.start].x[d.id], b = b[this.end].x[d.id], e = d.stepWidth, d.startOnAxis || (d = e / 2, a -= d, b += d));
        this.stepWidth = e;
        this.updateScrollbarSize(a, b)
    },
    maskGraphs: function (a, b, d, e) {
        var f = this.selectedGraph;
        f && f.set.clipRect(a, b, d, e)
    },
    handleDragStart: function () {
        AmCharts.ChartScrollbar.base.handleDragStart.call(this);
        this.difference = this.end - this.start;
        this.timeDifference = this.endTime - this.startTime;
        0 > this.timeDifference && (this.timeDifference = 0)
    },
    handleBackgroundClick: function () {
        AmCharts.ChartScrollbar.base.handleBackgroundClick.call(this);
        this.dragging || (this.difference = this.end - this.start, this.timeDifference = this.endTime - this.startTime, 0 > this.timeDifference && (this.timeDifference = 0))
    }
});
AmCharts.circle = function (a, b, d, e, f, g, h, j) {
    if (void 0 == f || 0 == f) f = 1;
    void 0 == g && (g = "#000000");
    void 0 == h && (h = 0);
    e = {
        fill: d,
        stroke: g,
        "fill-opacity": e,
        "stroke-width": f,
        "stroke-opacity": h
    };
    a = a.circle(0, 0, b).attr(e);
    j && a.gradient("radialGradient", [d, AmCharts.adjustLuminosity(d, -0.6)]);
    return a
};
AmCharts.text = function (a, b, d, e, f, g, h, j) {
    g || (g = "middle");
    d = {
        fill: d,
        "font-family": e,
        "font-size": f,
        opacity: j
    };
    !0 == h && (d["font-weight"] = "bold");
    d["text-anchor"] = g;
    return a.text(b, d)
};
AmCharts.polygon = function (a, b, d, e, f, g, h, j, k) {
    isNaN(g) && (g = 0);
    isNaN(j) && (j = f);
    var l = e,
        m = !1;
    "object" == typeof l && (l = l[0], m = !0);
    void 0 == h && (h = l);
    for (var f = {
        fill: l,
        stroke: h,
        "fill-opacity": f,
        "stroke-width": g,
        "stroke-opacity": j
    }, g = AmCharts.dx, h = AmCharts.dy, j = Math.round, l = "M" + (j(b[0]) + g) + "," + (j(d[0]) + h), o = 1; o < b.length; o++) l += " L" + (j(b[o]) + g) + "," + (j(d[o]) + h);
    a = a.path(l + " Z").attr(f);
    m && a.gradient("linearGradient", e, k);
    return a
};
AmCharts.rect = function (a, b, d, e, f, g, h, j, k, l) {
    isNaN(g) && (g = 0);
    void 0 == k && (k = 0);
    void 0 == l && (l = 270);
    isNaN(f) && (f = 0);
    var m = e,
        o = !1;
    "object" == typeof m && (m = m[0], o = !0);
    void 0 == h && (h = m);
    void 0 == j && (j = f);
    var b = Math.round(b),
        d = Math.round(d),
        p = 0,
        n = 0;
    0 > b && (b = Math.abs(b), p = -b);
    0 > d && (d = Math.abs(d), n = -d);
    p += AmCharts.dx;
    n += AmCharts.dy;
    f = {
        fill: m,
        stroke: h,
        "fill-opacity": f,
        "stroke-opacity": j
    };
    a = a.rect(p, n, b, d, k, g).attr(f);
    o && a.gradient("linearGradient", e, l);
    return a
};
AmCharts.triangle = function (a, b, d, e, f, g, h, j) {
    if (void 0 == g || 0 == g) g = 1;
    void 0 == h && (h = "#000");
    void 0 == j && (j = 0);
    var e = {
        fill: e,
        stroke: h,
        "fill-opacity": f,
        "stroke-width": g,
        "stroke-opacity": j
    },
        b = b / 2,
        k;
    0 == d && (k = " M" + -b + "," + b + " L0," + -b + " L" + b + "," + b + " Z");
    180 == d && (k = " M" + -b + "," + -b + " L0," + b + " L" + b + "," + -b + " Z");
    90 == d && (k = " M" + -b + "," + -b + " L" + b + ",0 L" + -b + "," + b + " Z");
    270 == d && (k = " M" + -b + ",0 L" + b + "," + b + " L" + b + "," + -b + " Z");
    return a.path(k).attr(e)
};
AmCharts.line = function (a, b, d, e, f, g, h) {
    var j = "none";
    void 0 != h && (j = h);
    g = {
        fill: "none",
        "stroke-dasharray": (j || "none"),
        "stroke-width": g
    };
    isNaN(f) || (g["stroke-opacity"] = f);
    e && (g.stroke = e);
    for (var e = Math.round, f = AmCharts.dx, h = AmCharts.dy, j = "M" + (e(b[0]) + f) + "," + (e(d[0]) + h), k = 1; k < b.length; k++) j += " L" + (e(b[k]) + f) + "," + (e(d[k]) + h);
    return a.path(j).attr(g)
};
AmCharts.wedge = function (a, b, d, e, f, g, h, j, k, l) {
    var m = Math.round,
        g = m(g),
        h = m(h),
        j = m(j),
        o = m(h / g * j); - 359.99 >= f && (f = -359.99);
    var p = 1 / 180 * Math.PI,
        n = b + Math.cos(e * p) * j,
        q = d + Math.sin(-e * p) * o,
        r = b + Math.cos(e * p) * g,
        s = d + Math.sin(-e * p) * h,
        t = b + Math.cos((e + f) * p) * g,
        u = d + Math.sin((-e - f) * p) * h,
        w = b + Math.cos((e + f) * p) * j,
        p = d + Math.sin((-e - f) * p) * o,
        A = {
            fill: AmCharts.adjustLuminosity(l.fill, -0.2),
            "stroke-opacity": 0
        },
        C = 0;
    180 < Math.abs(f) && (C = 1);
    var e = a.set(),
        v;
    AmCharts.VML && (n = m(n), r = m(r), t = m(t), w = m(w), q = m(q), s = m(s), u = m(u), p = m(p), b = m(b), k = m(k), d = m(d), 1 > Math.abs(f) && 1 >= Math.abs(t - r) && 1 >= Math.abs(u - s) && (v = !0));
    if (0 < k) {
        var D;
        AmCharts.VML ? (path = " M" + n + "," + (q + k) + " L" + r + "," + (s + k), v || (path += " A" + (b - g) + "," + (k + d - h) + "," + (b + g) + "," + (k + d + h) + "," + r + "," + (s + k) + "," + t + "," + (u + k)), path += " L" + w + "," + (p + k), 0 < j && (path += " B" + (b - j) + "," + (k + d - o) + "," + (b + j) + "," + (k + d + o) + "," + w + "," + (k + p) + "," + n + "," + (k + q))) : (path = " M" + n + "," + (q + k) + " L" + r + "," + (s + k), path += " A" + g + "," + h + ",0," + C + ",1," + t + "," + (u + k) + " L" + w + "," + (p + k), 0 < j && (path += " A" + j + "," + o + ",0," + C + ",0," + n + "," + (q + k)));
        path += " Z";
        c = a.path(path).attr(A);
        e.push(c);
        f = a.path(" M" + n + "," + q + " L" + n + "," + (q + k) + " L" + r + "," + (s + k) + " L" + r + "," + s + " L" + n + "," + q + " Z").attr(A);
        k = a.path(" M" + t + "," + u + " L" + t + "," + (u + k) + " L" + w + "," + (p + k) + " L" + w + "," + p + " L" + t + "," + u + " Z").attr(A);
        e.push(f);
        e.push(k)
    }
    AmCharts.VML ? (v || (D = " A" + m(b - g) + "," + m(d - h) + "," + m(b + g) + "," + m(d + h) + "," + m(r) + "," + m(s) + "," + m(t) + "," + m(u)), g = " M" + m(n) + "," + m(q) + " L" + m(r) + "," + m(s) + D + " L" + m(w) + "," + m(p)) : g = " M" + n + "," + q + " L" + r + "," + s + (" A" + g + "," + h + ",0," + C + ",1," + t + "," + u) + " L" + w + "," + p;
    0 < j && (AmCharts.VML ? v || (g += " B" + (b - j) + "," + (d - o) + "," + (b + j) + "," + (d + o) + "," + w + "," + p + "," + n + "," + q) : g += " A" + j + "," + o + ",0," + C + ",0," + n + "," + q);
    a = a.path(g + " Z").attr(l);
    e.push(a);
    return e
};
AmCharts.adjustLuminosity = function (a, b) {
    a = ("" + a).replace(/[^0-9a-f]/gi, "");
    6 > a.length && (a = a[0] + a[0] + a[1] + a[1] + a[2] + a[2]);
    var b = b || 0,
        d = "#",
        e, f;
    for (f = 0; 3 > f; f++) e = parseInt(a.substr(2 * f, 2), 16), e = Math.round(Math.min(Math.max(0, e + e * b), 255)).toString(16), d += ("00" + e).substr(e.length);
    return d
};
AmCharts.AmPieChart = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function () {
        this.createEvents("rollOverSlice", "rollOutSlice", "clickSlice", "pullOutSlice", "pullInSlice");
        AmCharts.AmPieChart.base.construct.call(this);
        this.colors = "#FF0F00,#FF6600,#FF9E01,#FCD202,#F8FF01,#B0DE09,#04D215,#0D8ECF,#0D52D1,#2A0CD0,#8A0CCF,#CD0D74,#754DEB,#DDDDDD,#999999,#333333,#000000,#57032A,#CA9726,#990000,#4B0C25".split(",");
        this.pieAlpha = 1;
        this.pieBaseColor;
        this.pieBrightnessStep = 30;
        this.groupPercent = 0;
        this.groupedTitle = "Other";
        this.groupedPulled = !1;
        this.groupedAlpha = 1;
        this.marginLeft = 0;
        this.marginBottom = this.marginTop = 10;
        this.marginRight = 0;
        this.minRadius = 10;
        this.hoverAlpha = 1;
        this.depth3D = 0;
        this.startAngle = 90;
        this.angle = this.innerRadius = 0;
        this.outlineColor = "#FFFFFF";
        this.outlineAlpha = 0;
        this.outlineThickness = 1;
        this.startRadius = "500%";
        this.startAlpha = 0;
        this.startDuration = 1;
        this.startEffect = "bounce";
        this.sequencedAnimation = !1;
        this.pullOutRadius = "20%";
        this.pullOutDuration = 1;
        this.pullOutEffect = "bounce";
        this.pullOnHover = this.pullOutOnlyOne = !1;
        this.labelsEnabled = !0;
        this.labelRadius = 30;
        this.labelTickColor = "#000000";
        this.labelTickAlpha = 0.2;
        this.labelText = "[[title]]: [[percents]]%";
        this.hideLabelsPercent = 0;
        this.balloonText = "[[title]]: [[percents]]% ([[value]])\n[[description]]";
        this.dataProvider;
        this.urlTarget = "_self";
        this.previousScale = 1;
        this.autoMarginOffset = 10
    },
    initChart: function () {
        AmCharts.AmPieChart.base.initChart.call(this);
        this.dataChanged && (this.parseData(), this.dispatchDataUpdated = !0, this.dataChanged = !1, this.legend && this.legend.setData(this.chartData));
        this.drawChart()
    },
    handleLegendEvent: function (a) {
        var b = a.type;
        if (a = a.dataItem) {
            var d = a.hidden;
            switch (b) {
            case "clickMarker":
                d || this.clickSlice(a);
                break;
            case "clickLabel":
                d || this.clickSlice(a);
                break;
            case "rollOverItem":
                d || this.rollOverSlice(a, !1);
                break;
            case "rollOutItem":
                d || this.rollOutSlice(a);
                break;
            case "hideItem":
                this.hideSlice(a);
                break;
            case "showItem":
                this.showSlice(a)
            }
        }
    },
    invalidateVisibility: function () {
        this.recalculatePercents();
        this.initChart();
        var a = this.legend;
        a && a.invalidateSize()
    },
    drawChart: function () {
        var a = this;
        AmCharts.AmPieChart.base.drawChart.call(a);
        var b = a.chartData;
        if (AmCharts.ifArray(b)) {
            var d = a.startDuration,
                e = a.container,
                f = a.updateWidth();
            a.realWidth = f;
            var g = a.updateHeight();
            a.realHeight = g;
            var h = AmCharts.toCoordinate,
                j = h(a.marginLeft, f),
                k = h(a.marginRight, f),
                l = h(a.marginTop, g) + a.getTitleHeight(),
                m = h(a.marginBottom, g);
            a.chartDataLabels = [];
            a.ticks = [];
            var o, p, n, q = AmCharts.toNumber(a.labelRadius),
                r = a.measureMaxLabel();
            if (!a.labelText || !a.labelsEnabled) q = r = 0;
            o = void 0 == a.pieX ? (f - j - k) / 2 + j : h(a.pieX, a.realWidth);
            p = void 0 == a.pieY ? (g - l - m) / 2 + l : h(a.pieY, g);
            n = h(a.radius, f, g);
            a.pullOutRadiusReal = AmCharts.toCoordinate(a.pullOutRadius, n);
            n || (f = 0 <= q ? f - j - k - 2 * r : f - j - k, g = g - l - m, n = Math.min(f, g), g < f && (n /= 1 - a.angle / 90, n > f && (n = f)), a.pullOutRadiusReal = AmCharts.toCoordinate(a.pullOutRadius, n), n = 0 <= q ? n - 1.8 * (q + a.pullOutRadiusReal) : n - 1.8 * a.pullOutRadiusReal, n /= 2);
            n < a.minRadius && (n = a.minRadius);
            a.pullOutRadiusReal = h(a.pullOutRadius, n);
            h = h(a.innerRadius, n);
            h >= n && (h = n - 1);
            g = AmCharts.fitToBounds(a.startAngle, 0, 360);
            0 < a.depth3D && (g = 270 <= g ? 270 : 90);
            l = n - n * a.angle / 90;
            for (m = 0; m < b.length; m++) if (f = b[m], !0 != f.hidden && 0 < f.percents) {
                var s = 360 * -f.percents / 100,
                    k = Math.cos((g + s / 2) / 180 * Math.PI),
                    r = Math.sin((-g - s / 2) / 180 * Math.PI) * (l / n),
                    j = AmCharts.wedge(e, o, p, g, s, n, l, h, a.depth3D, {
                        fill: f.color,
                        stroke: a.outlineColor,
                        "stroke-width": a.outlineThickness,
                        "stroke-opacity": a.outlineAlpha
                    });
                a.addEventListeners(j, f);
                f.startAngle = g;
                b[m].wedge = j;
                if (0 < d) {
                    var t = a.startAlpha;
                    a.chartCreated && (t = f.alpha);
                    j.setAttr("opacity", t)
                }
                f.ix = k;
                f.iy = r;
                f.wedge = j;
                f.index = m;
                if (a.labelsEnabled && a.labelText && f.percents >= a.hideLabelsPercent) {
                    s = g + s / 2;
                    0 >= s && (s += 360);
                    var k = o + k * (n + q),
                        t = p + r * (n + q),
                        u, r = 0;
                    if (0 <= q) {
                        var w;
                        90 >= s && 0 <= s ? (w = 0, u = "start", r = 8) : 360 >= s && 270 < s ? (w = 1, u = "start", r = 8) : 270 >= s && 180 < s ? (w = 2, u = "end", r = -8) : 180 >= s && 90 < s && (w = 3, u = "end", r = -8);
                        f.labelQuarter = w
                    } else u = "middle";
                    s = a.formatString(a.labelText, f);
                    s = AmCharts.text(e, s, a.color, a.fontFamily, a.fontSize, u);
                    s.translate(k + 1.5 * r, t);
                    f.tx = k + 1.5 * r;
                    f.ty = t;
                    t = setTimeout(function () {
                        a.showLabels.call(a)
                    }, 1E3 * d);
                    a.timeOuts.push(t);
                    j.push(s);
                    f.label = s;
                    a.chartDataLabels[m] = s;
                    f.tx = k;
                    f.tx2 = k + r
                }
                a.set.push(j);
                (0 == f.alpha || 0 < d && !a.chartCreated) && j.hide();
                g -= 360 * f.percents / 100;
                0 >= g && (g += 360)
            }
            0 < q && a.arrangeLabels();
            a.pieXReal = o;
            a.pieYReal = p;
            a.radiusReal = n;
            a.innerRadiusReal = h;
            0 < q && a.drawTicks();
            a = this;
            a.chartCreated ? a.pullSlices(!0) : (t = setTimeout(function () {
                a.pullSlices.call(a)
            }, 1200 * d), a.timeOuts.push(t));
            a.chartCreated || a.startSlices();
            a.chartCreated = !0;
            a.dispDUpd()
        }
        a.setDepths()
    },
    setDepths: function () {
        for (var a = this.chartData, b = 0; b < a.length; b++) {
            var d = a[b],
                e = d.wedge,
                d = d.startAngle;
            90 >= d && 0 <= d || 360 >= d && 270 < d ? e.toFront() : (270 >= d && 180 < d || 180 >= d && 90 < d) && e.toBack()
        }
    },
    addEventListeners: function (a, b) {
        var d = this;
        a.mouseover(function () {
            d.rollOverSlice(b, !0)
        }).mouseout(function () {
            d.rollOutSlice(b)
        }).click(function () {
            d.clickSlice(b)
        })
    },
    formatString: function (a, b) {
        a = AmCharts.formatValue(a, b, ["value"], this.numberFormatter, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        a = AmCharts.formatValue(a, b, ["percents"], this.percentFormatter);
        a = AmCharts.massReplace(a, {
            "[[title]]": b.title,
            "[[description]]": b.description,
            "<br>": "\n"
        });
        return a = AmCharts.cleanFromEmpty(a)
    },
    drawTicks: function () {
        for (var a = this.chartData, b = 0; b < a.length; b++) if (this.chartDataLabels[b]) {
            var d = a[b],
                e = d.ty,
                f = this.radiusReal,
                e = AmCharts.line(this.container, [this.pieXReal + d.ix * f, d.tx, d.tx2], [this.pieYReal + d.iy * f, e, e], this.labelTickColor, this.labelTickAlpha);
            d.wedge.push(e);
            this.ticks[b] = e
        }
    },
    arrangeLabels: function () {
        for (var a = this.chartData, b = a.length, d, e = b - 1; 0 <= e; e--) d = a[e], 0 == d.labelQuarter && !d.hidden && this.checkOverlapping(e, d, 0, !0, 0);
        for (e = 0; e < b; e++) d = a[e], 1 == d.labelQuarter && !d.hidden && this.checkOverlapping(e, d, 1, !1, 0);
        for (e = b - 1; 0 <= e; e--) d = a[e], 2 == d.labelQuarter && !d.hidden && this.checkOverlapping(e, d, 2, !0, 0);
        for (e = 0; e < b; e++) d = a[e], 3 == d.labelQuarter && !d.hidden && this.checkOverlapping(e, d, 3, !1, 0)
    },
    checkOverlapping: function (a, b, d, e, f) {
        var g, h, j = this.chartData,
            k = j.length,
            l = b.label;
        if (l) {
            if (!0 == e) for (h = a + 1; h < k; h++)(g = this.checkOverlappingReal(b, j[h], d)) && (h = k);
            else for (h = a - 1; 0 <= h; h--)(g = this.checkOverlappingReal(b, j[h], d)) && (h = 0);
            !0 == g && 100 > f && (g = b.ty + 3 * b.iy, b.ty = g, l.translate(b.tx2, g), this.checkOverlapping(a, b, d, e, f + 1))
        }
    },
    checkOverlappingReal: function (a, b, d) {
        var e = !1,
            f = a.label,
            g = b.label;
        a.labelQuarter == d && !a.hidden && !b.hidden && g && (f = f.getBBox(), d = {}, d.width = f.width, d.height = f.height, d.y = a.ty, d.x = a.tx, a = g.getBBox(), g = {}, g.width = a.width, g.height = a.height, g.y = b.ty, g.x = b.tx, AmCharts.hitTest(d, g) && (e = !0));
        return e
    },
    startSlices: function () {
        for (var a = this, b = 500 * (a.startDuration / a.chartData.length), d = 0; d < a.chartData.length; d++) if (0 < a.startDuration && a.sequencedAnimation) {
            var e = setTimeout(function () {
                a.startSequenced.call(a)
            }, b * d);
            a.timeOuts.push(e)
        } else a.startSlice(a.chartData[d])
    },
    pullSlices: function (a) {
        for (var b = this.chartData, d = 0; d < b.length; d++) {
            var e = b[d];
            e.pulled && this.pullSlice(e, 1, a)
        }
    },
    startSequenced: function () {
        for (var a = this.chartData, b = 0; b < a.length; b++) if (!a[b].started) {
            this.startSlice(this.chartData[b]);
            break
        }
    },
    startSlice: function (a) {
        a.started = !0;
        var b = a.wedge,
            d = this.startDuration;
        if (b && 0 < d) {
            0 < a.alpha && b.show();
            var e = AmCharts.toCoordinate(this.startRadius, this.radiusReal);
            b.translate(Math.round(a.ix * e), Math.round(a.iy * e));
            b.animate({
                opacity: 1,
                translate: "0,0"
            }, d, this.startEffect)
        }
    },
    showLabels: function () {
        for (var a = this.chartData, b = 0; b < a.length; b++) if (0 < a[b].alpha) {
            var d = this.chartDataLabels[b];
            d && d.show();
            (d = this.ticks[b]) && d.show()
        }
    },
    showSlice: function (a) {
        isNaN(a) ? a.hidden = !1 : this.chartData[a].hidden = !1;
        this.hideBalloon();
        this.invalidateVisibility()
    },
    hideSlice: function (a) {
        isNaN(a) ? a.hidden = !0 : this.chartData[a].hidden = !0;
        this.hideBalloon();
        this.invalidateVisibility()
    },
    rollOverSlice: function (a, b) {
        isNaN(a) || (a = this.chartData[a]);
        clearTimeout(this.hoverInt);
        this.pullOnHover && this.pullSlice(a, 1);
        var d = this.innerRadiusReal + (this.radiusReal - this.innerRadiusReal) / 2;
        a.pulled && (d += this.pullOutRadiusReal);
        1 > this.hoverAlpha && a.wedge && a.wedge.attr({
            opacity: this.hoverAlpha
        });
        var e;
        e = a.ix * d + this.pieXReal;
        var d = a.iy * d + this.pieYReal,
            f = this.formatString(this.balloonText, a),
            g = AmCharts.adjustLuminosity(a.color, -0.15);
        this.showBalloon(f, g, b, e, d);
        e = {
            type: "rollOverSlice",
            dataItem: a
        };
        this.fire(e.type, e)
    },
    rollOutSlice: function (a) {
        isNaN(a) || (a = this.chartData[a]);
        a.wedge && a.wedge.attr({
            opacity: a.alpha
        });
        this.hideBalloon();
        a = {
            type: "rollOutSlice",
            dataItem: a
        };
        this.fire(a.type, a)
    },
    clickSlice: function (a) {
        isNaN(a) || (a = this.chartData[a]);
        this.hideBalloon();
        a.pulled ? this.pullSlice(a, 0) : this.pullSlice(a, 1);
        var b = a.url,
            d = this.urlTarget;
        b && ("_self" == d || !d ? window.location.href = b : (d = document.getElementsByName(d)[0]) ? d.src = b : window.open(b));
        a = {
            type: "clickSlice",
            dataItem: a
        };
        this.fire(a.type, a)
    },
    pullSlice: function (a, b, d) {
        var e = a.ix,
            f = a.iy,
            g = this.pullOutDuration;
        !0 === d && (g = 0);
        var d = a.wedge,
            h = this.pullOutRadiusReal;
        d && d.animate({
            translate: b * e * h + "," + b * f * h
        }, g, this.pullOutEffect);
        1 == b ? (a.pulled = !0, this.pullOutOnlyOne && this.pullInAll(a.index), a = {
            type: "pullOutSlice",
            dataItem: a
        }) : (a.pulled = !1, a = {
            type: "pullInSlice",
            dataItem: a
        });
        this.fire(a.type, a)
    },
    pullInAll: function (a) {
        for (var b = this.chartData, d = 0; d < this.chartData.length; d++) d != a && b[d].pulled && this.pullSlice(b[d], 0)
    },
    pullOutAll: function () {
        for (var a = this.chartData, b = 0; b < a.length; b++) a[b].pulled || this.pullSlice(a[b], 1)
    },
    parseData: function () {
        var a = [];
        this.chartData = a;
        var b = this.dataProvider;
        if (void 0 != b) {
            for (var d = b.length, e = 0, f = 0; f < d; f++) {
                var g = {},
                    h = b[f];
                g.dataContext = h;
                g.value = Number(h[this.valueField]);
                var j = h[this.titleField];
                j || (j = "");
                g.title = j;
                g.pulled = AmCharts.toBoolean(h[this.pulledField], !1);
                (j = h[this.descriptionField]) || (j = "");
                g.description = j;
                g.url = h[this.urlField];
                g.visibleInLegend = AmCharts.toBoolean(h[this.visibleInLegendField], !0);
                j = h[this.alphaField];
                g.alpha = void 0 != j ? Number(j) : this.pieAlpha;
                h = h[this.colorField];
                void 0 != h && (g.color = AmCharts.toColor(h));
                e += g.value;
                g.hidden = !1;
                a[f] = g
            }
            for (f = b = 0; f < d; f++) g = a[f], g.percents = 100 * (g.value / e), g.percents < this.groupPercent && b++;
            1 < b && (this.groupValue = 0, this.removeSmallSlices(), a.push({
                title: this.groupedTitle,
                value: this.groupValue,
                percents: 100 * (this.groupValue / e),
                pulled: this.groupedPulled,
                color: this.groupedColor,
                url: this.groupedUrl,
                description: this.groupedDescription,
                alpha: this.groupedAlpha
            }));
            for (f = 0; f < a.length; f++) if (this.pieBaseColor ? h = AmCharts.adjustLuminosity(this.pieBaseColor, f * this.pieBrightnessStep / 100) : (h = this.colors[f], void 0 == h && (h = AmCharts.randomColor())), void 0 == a[f].color) a[f].color = h;
            this.recalculatePercents()
        }
    },
    recalculatePercents: function () {
        for (var a = this.chartData, b = 0, d = 0; d < a.length; d++) {
            var e = a[d];
            !e.hidden && 0 < e.value && (b += e.value)
        }
        for (d = 0; d < a.length; d++) e = this.chartData[d], e.percents = !e.hidden && 0 < e.value ? 100 * e.value / b : 0
    },
    removeSmallSlices: function () {
        for (var a = this.chartData, b = a.length - 1; 0 <= b; b--) a[b].percents < this.groupPercent && (this.groupValue += a[b].value, a.splice(b, 1))
    },
    animateAgain: function () {
        var a = this;
        a.startSlices();
        var b = setTimeout(function () {
            a.pullSlices.call(a)
        }, 1200 * a.startDuration);
        a.timeOuts.push(b)
    },
    measureMaxLabel: function () {
        for (var a = this.chartData, b = 0, d = 0; d < a.length; d++) {
            var e = this.formatString(this.labelText, a[d]),
                e = AmCharts.text(this.container, e, this.color, this.fontFamily, this.fontSize),
                f = e.getBBox().width;
            f > b && (b = f);
            e.remove()
        }
        return b
    }
});
AmCharts.AmXYChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart,
    construct: function () {
        AmCharts.AmXYChart.base.construct.call(this);
        this.createEvents("zoomed");
        this.xAxes;
        this.yAxes;
        this.scrollbarV;
        this.scrollbarH;
        this.maxZoomFactor = 20;
        this.chartType = "xy"
    },
    initChart: function () {
        AmCharts.AmXYChart.base.initChart.call(this);
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.updateScrollbar = !0;
        this.drawChart();
        this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins());
        var a = this.marginLeftReal,
            b = this.marginTopReal,
            d = this.plotAreaWidth,
            e = this.plotAreaHeight;
        this.graphsSet.clipRect(a, b, d, e);
        this.bulletSet.clipRect(a, b, d, e);
        this.trendLinesSet.clipRect(a, b, d, e)
    },
    createValueAxes: function () {
        var a = [],
            b = [];
        this.xAxes = a;
        this.yAxes = b;
        for (var d = this.valueAxes, e = 0; e < d.length; e++) {
            var f = d[e],
                g = f.position;
            if ("top" == g || "bottom" == g) f.rotate = !0;
            f.setOrientation(f.rotate);
            g = f.orientation;
            "V" == g && b.push(f);
            "H" == g && a.push(f)
        }
        0 == b.length && (f = new AmCharts.ValueAxis, f.rotate = !1, f.setOrientation(!1), d.push(f), b.push(f));
        0 == a.length && (f = new AmCharts.ValueAxis, f.rotate = !0, f.setOrientation(!0), d.push(f), a.push(f));
        for (e = 0; e < d.length; e++) this.processValueAxis(d[e], e);
        a = this.graphs;
        for (e = 0; e < a.length; e++) this.processGraph(a[e], e)
    },
    drawChart: function () {
        AmCharts.AmXYChart.base.drawChart.call(this);
        AmCharts.ifArray(this.chartData) ? (this.chartScrollbar && (this.updateScrollbars(), this.scrollbarH.draw(), this.scrollbarV.draw()), this.zoomChart()) : this.cleanChart();
        this.chartCreated = !0;
        this.dispDUpd()
    },
    cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.scrollbarV, this.scrollbarH, this.chartCursor])
    },
    zoomChart: function () {
        this.toggleZoomOutButton();
        this.zoomObjects(this.valueAxes);
        this.zoomObjects(this.graphs);
        this.zoomTrendLines();
        this.dispatchAxisZoom()
    },
    toggleZoomOutButton: function () {
        1 == this.heightMultiplyer && 1 == this.widthMultiplyer ? this.showZB(!1) : this.showZB(!0)
    },
    dispatchAxisZoom: function () {
        for (var a = this.valueAxes, b = 0; b < a.length; b++) {
            var d = a[b];
            if (!isNaN(d.min) && !isNaN(d.max)) {
                var e, f;
                "V" == d.orientation ? (e = d.coordinateToValue(-this.verticalPosition), f = d.coordinateToValue(-this.verticalPosition + this.plotAreaHeight)) : (e = d.coordinateToValue(-this.horizontalPosition), f = d.coordinateToValue(-this.horizontalPosition + this.plotAreaWidth));
                if (!isNaN(e) && !isNaN(f)) {
                    if (e > f) {
                        var g = f;
                        f = e;
                        e = g
                    }
                    d.dispatchZoomEvent(e, f)
                }
            }
        }
    },
    zoomObjects: function (a) {
        for (var b = a.length, d = 0; d < b; d++) {
            var e = a[d];
            this.updateObjectSize(e);
            e.zoom(0, this.chartData.length - 1)
        }
    },
    updateData: function () {
        this.parseData();
        for (var a = this.chartData, b = a.length - 1, d = this.graphs, e = this.dataProvider, f = 0; f < d.length; f++) {
            var g = d[f];
            g.data = a;
            g.zoom(0, b);
            var h = g.valueField,
                j = 0;
            if (h) for (var k = 0; k < e.length; k++) {
                var l = e[k][h];
                l > j && (j = l)
            }
            g.maxValue = j
        }
        if (a = this.chartCursor) a.updateData(), a.type = "crosshair", a.valueBalloonsEnabled = !1
    },
    zoomOut: function () {
        this.verticalPosition = this.horizontalPosition = 0;
        this.heightMultiplyer = this.widthMultiplyer = 1;
        this.zoomChart();
        this.zoomScrollbars()
    },
    processValueAxis: function (a) {
        a.chart = this;
        a.minMaxField = "H" == a.orientation ? "x" : "y";
        a.minTemp = NaN;
        a.maxTemp = NaN;
        this.listenTo(a, "axisSelfZoomed", this.handleAxisSelfZoom)
    },
    processGraph: function (a) {
        a.xAxis || (a.xAxis = this.xAxes[0]);
        a.yAxis || (a.yAxis = this.yAxes[0])
    },
    parseData: function () {
        AmCharts.AmXYChart.base.parseData.call(this);
        this.chartData = [];
        for (var a = this.dataProvider, b = this.valueAxes, d = this.graphs, e = 0; e < a.length; e++) {
            for (var f = {
                axes: {},
                x: {},
                y: {}
            }, g = a[e], h = 0; h < b.length; h++) {
                var j = b[h].id;
                f.axes[j] = {};
                f.axes[j].graphs = {};
                for (var k = 0; k < d.length; k++) {
                    var l = d[k],
                        m = l.id;
                    if (l.xAxis.id == j || l.yAxis.id == j) {
                        var o = {};
                        o.serialDataItem = f;
                        o.index = e;
                        var p = {},
                            n = Number(g[l.valueField]);
                        isNaN(n) || (p.value = n);
                        n = Number(g[l.xField]);
                        isNaN(n) || (p.x = n);
                        n = Number(g[l.yField]);
                        isNaN(n) || (p.y = n);
                        o.values = p;
                        this.processFields(l, o, g);
                        o.serialDataItem = f;
                        o.graph = l;
                        f.axes[j].graphs[m] = o
                    }
                }
            }
            this.chartData[e] = f
        }
    },
    formatString: function (a, b) {
        var d = b.graph.numberFormatter;
        d || (d = this.numberFormatter);
        a = AmCharts.formatValue(a, b.values, ["value", "x", "y"], d);
        return a = AmCharts.AmSerialChart.base.formatString.call(this, a, b)
    },
    addChartScrollbar: function (a) {
        AmCharts.callMethod("destroy", [this.chartScrollbar, this.scrollbarH, this.scrollbarV]);
        if (a) {
            var b = new AmCharts.SimpleChartScrollbar,
                d = new AmCharts.SimpleChartScrollbar;
            b.skipEvent = !0;
            d.skipEvent = !0;
            b.chart = this;
            d.chart = this;
            this.listenTo(b, "zoomed", this.handleVSBZoom);
            this.listenTo(d, "zoomed", this.handleHSBZoom);
            var e = "backgroundColor,backgroundAlpha,selectedBackgroundColor,selectedBackgroundAlpha,scrollDuration,resizeEnabled,hideResizeGrips,scrollbarHeight,updateOnReleaseOnly".split(",");
            AmCharts.copyProperties(a, b, e);
            AmCharts.copyProperties(a, d, e);
            b.rotate = !0;
            d.rotate = !1;
            this.scrollbarHeight = a.scrollbarHeight;
            this.scrollbarH = d;
            this.scrollbarV = b;
            this.chartScrollbar = a
        }
    },
    updateTrendLines: function () {
        for (var a = this.trendLines, b = 0; b < a.length; b++) {
            var d = a[b];
            d.chart = this;
            d.valueAxis || (d.valueAxis = this.yAxes[0]);
            d.valueAxisX || (d.valueAxisX = this.xAxes[0])
        }
    },
    updateMargins: function () {
        AmCharts.AmXYChart.base.updateMargins.call(this);
        var a = this.scrollbarV;
        a && (this.getScrollbarPosition(a, !0, this.yAxes[0].position), this.adjustMargins(a, !0));
        if (a = this.scrollbarH) this.getScrollbarPosition(a, !1, this.xAxes[0].position), this.adjustMargins(a, !1)
    },
    updateScrollbars: function () {
        this.updateChartScrollbar(this.scrollbarV, !0);
        this.updateChartScrollbar(this.scrollbarH, !1)
    },
    zoomScrollbars: function () {
        var a = this.scrollbarH;
        a && a.relativeZoom(this.widthMultiplyer, -this.horizontalPosition / this.widthMultiplyer);
        (a = this.scrollbarV) && a.relativeZoom(this.heightMultiplyer, -this.verticalPosition / this.heightMultiplyer)
    },
    fitMultiplyer: function (a) {
        a > this.maxZoomFactor && (a = this.maxZoomFactor);
        return a
    },
    handleHSBZoom: function (a) {
        var b = this.fitMultiplyer(a.multiplyer),
            a = -a.position * b,
            d = -(this.plotAreaWidth * b - this.plotAreaWidth);
        a < d && (a = d);
        this.widthMultiplyer = b;
        this.horizontalPosition = a;
        this.zoomChart()
    },
    handleVSBZoom: function (a) {
        var b = this.fitMultiplyer(a.multiplyer),
            a = -a.position * b,
            d = -(this.plotAreaHeight * b - this.plotAreaHeight);
        a < d && (a = d);
        this.heightMultiplyer = b;
        this.verticalPosition = a;
        this.zoomChart()
    },
    handleCursorZoom: function (a) {
        var b = this.widthMultiplyer * this.plotAreaWidth / a.selectionWidth,
            d = this.heightMultiplyer * this.plotAreaHeight / a.selectionHeight,
            b = this.fitMultiplyer(b),
            d = this.fitMultiplyer(d);
        this.horizontalPosition = (this.horizontalPosition - a.selectionX) * b / this.widthMultiplyer;
        this.verticalPosition = (this.verticalPosition - a.selectionY) * d / this.heightMultiplyer;
        this.widthMultiplyer = b;
        this.heightMultiplyer = d;
        this.zoomChart();
        this.zoomScrollbars()
    },
    handleAxisSelfZoom: function (a) {
        if ("H" == a.valueAxis.orientation) {
            var b = this.fitMultiplyer(a.multiplyer),
                a = -a.position / this.widthMultiplyer * b,
                d = -(this.plotAreaWidth * b - this.plotAreaWidth);
            a < d && (a = d);
            this.horizontalPosition = a;
            this.widthMultiplyer = b
        } else b = this.fitMultiplyer(a.multiplyer), a = -a.position / this.heightMultiplyer * b, d = -(this.plotAreaHeight * b - this.plotAreaHeight), a < d && (a = d), this.verticalPosition = a, this.heightMultiplyer = b;
        this.zoomChart();
        this.zoomScrollbars()
    },
    removeChartScrollbar: function () {
        AmCharts.callMethod("destroy", [this.scrollbarH, this.scrollbarV]);
        this.scrollbarV = this.scrollbarH = null
    },
    handleReleaseOutside: function (a) {
        AmCharts.AmXYChart.base.handleReleaseOutside.call(this, a);
        AmCharts.callMethod("handleReleaseOutside", [this.scrollbarH, this.scrollbarV])
    }
});
AmCharts.AmDraw = AmCharts.Class({
    construct: function (a, b, d) {
        AmCharts.SVG_NS = "http://www.w3.org/2000/svg";
        AmCharts.SVG_XLINK = "http://www.w3.org/1999/xlink";
        AmCharts.hasSVG = !! document.createElementNS && !! document.createElementNS(AmCharts.SVG_NS, "svg").createSVGRect;
        1 > b && (b = 10);
        1 > d && (d = 10);
        this.div = a;
        this.width = b;
        this.height = d;
        this.rBin = document.createElement("div");
        if (AmCharts.hasSVG) {
            var e = this.createSvgElement("svg");
            e.style.position = "absolute";
            e.style.width = b + "px";
            e.style.height = d + "px";
            e.setAttribute("version", "1.1");
            e.setAttribute("xmlns", AmCharts.SVG_NS);
            a.appendChild(e);
            this.container = e;
            this.R = new AmCharts.SVGRenderer(this)
        } else AmCharts.isIE && (AmCharts.VML = !0, AmCharts.vmlStyleSheet || (document.namespaces.add("v", "urn:schemas-microsoft-com:vml"), b = document.createStyleSheet(), b.addRule("v\\:shape", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:polyline", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:roundrect", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:stroke", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:fill", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:oval", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:curve", "behavior:url(#default#VML); display:inline-block; antialias:true"), AmCharts.vmlStyleSheet = b), this.container = a, this.R = new AmCharts.VMLRenderer(this), this.R.disableSelection(a))
    },
    createSvgElement: function (a) {
        return document.createElementNS(AmCharts.SVG_NS, a)
    },
    circle: function (a, b, d, e) {
        var f = new AmCharts.AmDObject("circle", this);
        f.attr({
            r: d,
            cx: a,
            cy: b
        });
        this.addToContainer(f.node, e);
        return f
    },
    setSize: function () {},
    rect: function (a, b, d, e, f, g, h) {
        var j = new AmCharts.AmDObject("rect", this);
        this.R.svgPathToVml && (f = 100 * f / Math.min(d, e), d += 2 * g, e += 2 * g, j.bw = g, j.node.style.marginLeft = -g, j.node.style.marginTop = -g);
        1 > d && (d = 1);
        1 > e && (e = 1);
        j.attr({
            x: a,
            y: b,
            width: d,
            height: e,
            rx: f,
            ry: f,
            "stroke-width": g
        });
        this.addToContainer(j.node, h);
        return j
    },
    image: function (a, b, d, e, f, g) {
        var h = new AmCharts.AmDObject("image", this);
        h.attr({
            x: b,
            y: d,
            width: e,
            height: f
        });
        this.R.path(h, a);
        this.addToContainer(h.node, g);
        return h
    },
    addToContainer: function (a, b) {
        b || (b = this.container);
        b.appendChild(a)
    },
    text: function (a, b, d) {
        return this.R.text(a, b, d)
    },
    path: function (a, b) {
        var d = new AmCharts.AmDObject("path", this);
        d.attr({
            d: a
        });
        this.addToContainer(d.node, b);
        return d
    },
    set: function (a) {
        return this.R.set(a)
    },
    remove: function (a) {
        if (a) {
            var b = this.rBin;
            b.appendChild(a);
            b.innerHTML = ""
        }
    },
    bounce: function (a, b, d, e, f) {
        return (b /= f) < 1 / 2.75 ? e * 7.5625 * b * b + d : b < 2 / 2.75 ? e * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + d : b < 2.5 / 2.75 ? e * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + d : e * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + d
    },
    easeInSine: function (a, b, d, e, f) {
        return -e * Math.cos(b / f * (Math.PI / 2)) + e + d
    },
    easeOutSine: function (a, b, d, e, f) {
        return e * Math.sin(b / f * (Math.PI / 2)) + d
    },
    easeOutElastic: function (a, b, d, e, f) {
        var a = 1.70158,
            g = 0,
            h = e;
        if (0 == b) return d;
        if (1 == (b /= f)) return d + e;
        g || (g = 0.3 * f);
        h < Math.abs(e) ? (h = e, a = g / 4) : a = g / (2 * Math.PI) * Math.asin(e / h);
        return h * Math.pow(2, -10 * b) * Math.sin((b * f - a) * 2 * Math.PI / g) + e + d
    },
    renderFix: function () {
        var a = this.container,
            b = a.style;
        b.left = "0px";
        b.top = "0px";
        a = a.getScreenCTM() || a.createSVGMatrix();
        b.left = -(a.e - Math.floor(a.e)) + "px";
        b.top = -(a.f - Math.floor(a.f)) + "px"
    }
});
AmCharts.AmDObject = AmCharts.Class({
    construct: function (a, b) {
        this.D = b;
        this.R = b.R;
        this.node = this.R.create(this, a)
    },
    attr: function (a) {
        this.R.attr(this, a);
        return this
    },
    getAttr: function (a) {
        return this.node.getAttribute(a)
    },
    setAttr: function (a, b) {
        this.R.setAttr(this, a, b);
        return this
    },
    clipRect: function (a, b, d, e) {
        this.R.clipRect(this, a, b, d, e)
    },
    translate: function (a, b) {
        this.R.move(this, Math.round(a), Math.round(b))
    },
    rotate: function (a) {
        this.R.rotate(this, a)
    },
    animate: function (a, b, d) {
        for (var e in a) {
            var f = e,
                g = a[e];
            ">" == d && (d = "easeOutSine");
            "elastic" == d && (d = "easeOutElastic");
            this.R.animate(this, f, g, b, d)
        }
    },
    push: function (a) {
        if (a) {
            var b = this.node;
            b.appendChild(a.node);
            var d = a.clipPath;
            d && b.appendChild(d);
            (a = a.grad) && b.appendChild(a)
        }
    },
    text: function (a) {
        this.R.setText(this, a)
    },
    remove: function () {
        this.R.remove(this)
    },
    clear: function () {
        var a = this.node;
        if (a.hasChildNodes()) for (; 1 <= a.childNodes.length;) a.removeChild(a.firstChild)
    },
    hide: function () {
        this.setAttr("visibility", "hidden")
    },
    show: function () {
        this.setAttr("visibility", "visible")
    },
    getBBox: function () {
        return this.R.getBBox(this)
    },
    toFront: function () {
        var a = this.node;
        if (a) {
            var b = a.parentNode;
            b && b.appendChild(a)
        }
    },
    toBack: function () {
        var a = this.node;
        if (a) {
            var b = a.parentNode;
            if (b) {
                var d = b.firstChild;
                d && b.insertBefore(a, d)
            }
        }
    },
    mouseover: function (a) {
        this.R.addListener(this, "mouseover", a);
        return this
    },
    mouseout: function (a) {
        this.R.addListener(this, "mouseout", a);
        return this
    },
    click: function (a) {
        this.R.addListener(this, "click", a);
        return this
    },
    dblclick: function (a) {
        this.R.addListener(this, "dblclick", a);
        return this
    },
    mousedown: function (a) {
        this.R.addListener(this, "mousedown", a);
        return this
    },
    mouseup: function (a) {
        this.R.addListener(this, "mouseup", a);
        return this
    },
    touchstart: function (a) {
        this.R.addListener(this, "touchstart", a);
        return this
    },
    touchend: function (a) {
        this.R.addListener(this, "touchend", a);
        return this
    },
    stop: function () {
        var a = this.animationX;
        a && AmCharts.removeFromArray(this.R.animations, a);
        (a = this.animationY) && AmCharts.removeFromArray(this.R.animations, a)
    },
    length: function () {
        return this.node.childNodes.length
    },
    gradient: function (a, b, d) {
        this.R.gradient(this, a, b, d)
    }
});
AmCharts.VMLRenderer = AmCharts.Class({
    construct: function (a) {
        this.D = a;
        this.cNames = {
            circle: "oval",
            rect: "roundrect",
            path: "shape"
        };
        this.styleMap = {
            x: "left",
            y: "top",
            width: "width",
            height: "height",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            visibility: "visibility"
        };
        this.animations = []
    },
    create: function (a, b) {
        var d;
        if ("group" == b) d = document.createElement("div"), a.type = "div";
        else if ("text" == b) d = document.createElement("div"), a.type = "text";
        else if ("image" == b) d = document.createElement("img"), a.type = "image";
        else {
            a.type = "shape";
            a.shapeType = this.cNames[b];
            d = document.createElement("v:" + this.cNames[b]);
            var e = document.createElement("v:stroke");
            d.appendChild(e);
            a.stroke = e;
            e = document.createElement("v:fill");
            d.appendChild(e);
            a.fill = e
        }
        d.style.position = "absolute";
        d.style.top = 0;
        d.style.left = 0;
        return d
    },
    path: function (a, b) {
        a.node.setAttribute("src", b)
    },
    setAttr: function (a, b, d) {
        if (void 0 !== d) {
            if (8 === document.documentMode) var e = !0;
            var f = a.node,
                g = a.type,
                h = f.style;
            "r" == b && (h.width = 2 * d, h.height = 2 * d);
            if ("roundrect" == a.shapeType && ("width" == b || "height" == b)) d -= 1;
            "cx" == b && (h.left = d - this.removePx(h.width) / 2);
            "cy" == b && (h.top = d - this.removePx(h.height) / 2);
            var j = this.styleMap[b];
            void 0 != j && (h[j] = d);
            if ("text" == g) {
                if ("text-anchor" == b && (a.anchor = d, j = f.clientWidth, "end" == d && (h.marginLeft = -j + "px"), "middle" == d && (h.marginLeft = -(j / 2) + "px"), "start" == d)) h.marginLeft = "0px";
                "fill" == b && (h.color = d);
                "font-weight" == b && (h.fontWeight = d)
            }
            if ("shape" == g && ("d" == b && (f.setAttribute("coordsize", "100,100"), f.style.width = "100px", f.style.height = "100px", f.setAttribute("path", this.svgPathToVml(d))), g = a.stroke, a = a.fill, "stroke" == b && (e ? g.color = d : g.setAttribute("color", d)), "stroke-width" == b && (e ? g.weight = d : g.setAttribute("weight", d)), "stroke-opacity" == b && (e ? g.opacity = d : g.setAttribute("opacity", d)), "stroke-dasharray" == b && (h = "solid", 0 < d && 3 > d && (h = "dot"), 3 <= d && 6 >= d && (h = "dash"), 6 < d && (h = "longdash"), e ? g.dashstyle = h : g.setAttribute("dashstyle", h)), "fill-opacity" == b && (0 == d ? e ? a.on = !1 : a.setAttribute("on", !1) : e ? a.opacity = d : a.setAttribute("opacity", d)), "fill" == b && (e ? a.color = d : a.setAttribute("color", d)), "rx" == b)) e ? f.arcSize = d + "%" : f.setAttribute("arcsize", d + "%")
        }
    },
    attr: function (a, b) {
        for (var d in b) this.setAttr(a, d, b[d])
    },
    text: function (a, b, d) {
        var e = new AmCharts.AmDObject("text", this.D),
            f = e.node;
        f.style.whiteSpace = "nowrap";
        a = document.createTextNode(a);
        f.appendChild(a);
        this.D.addToContainer(f, d);
        this.attr(e, b);
        return e
    },
    getBBox: function (a) {
        return this.getBox(a.node)
    },
    getBox: function (a) {
        var b = a.offsetLeft,
            d = a.offsetTop,
            e = a.offsetWidth,
            f = a.offsetHeight,
            g;
        if (a.hasChildNodes()) {
            for (var h, j, k = 0; k < a.childNodes.length; k++) {
                g = this.getBox(a.childNodes[k]);
                var l = g.x;
                isNaN(l) || (isNaN(h) ? h = l : l < h && (h = l));
                var m = g.y;
                isNaN(m) || (isNaN(j) ? j = m : m < j && (j = m));
                l = g.width + l;
                isNaN(l) || (e = Math.max(e, l));
                g = g.height + m;
                isNaN(g) || (f = Math.max(f, g))
            }
            0 > h && (b += h);
            0 > j && (d += j)
        }
        return {
            x: b,
            y: d,
            width: e,
            height: f
        }
    },
    setText: function (a, b) {
        var d = a.node;
        d && (d.removeChild(d.firstChild), d.appendChild(document.createTextNode(b)));
        this.setAttr(a, "text-anchor", a.anchor)
    },
    addListener: function (a, b, d) {
        a.node["on" + b] = d
    },
    move: function (a, b, d) {
        var e = a.node,
            f = e.style;
        "text" == a.type && (d -= this.removePx(f.fontSize) / 2 - 1);
        "oval" == a.shapeType && (b -= this.removePx(f.width) / 2, d -= this.removePx(f.height) / 2);
        a = a.bw;
        isNaN(a) || (b -= a, d -= a);
        e.style.left = b;
        e.style.top = d
    },
    removePx: function (a) {
        return Number(a.substring(0, a.length - 2))
    },
    svgPathToVml: function (a) {
        for (var b = a.split(" "), a = "", d, e = Math.round, f = 0; f < b.length; f++) {
            var g = b[f],
                h = g.substring(0, 1),
                g = g.substring(1),
                j = g.split(","),
                k = e(j[0]) + "," + e(j[1]);
            "M" == h && (a += " m " + k);
            "L" == h && (a += " l " + k);
            "Z" == h && (a += " x e");
            if ("Q" == h) {
                var l = d.length,
                    m = d[l - 1],
                    o = j[0],
                    p = j[1],
                    k = j[2],
                    n = j[3];
                d = e(d[l - 2] / 3 + 2 / 3 * o);
                m = e(m / 3 + 2 / 3 * p);
                o = e(2 / 3 * o + k / 3);
                p = e(2 / 3 * p + n / 3);
                a += " c " + d + "," + m + "," + o + "," + p + "," + k + "," + n
            }
            "A" == h && (a += " wa " + g);
            "B" == h && (a += " at " + g);
            d = j
        }
        return a
    },
    animate: function (a, b, d, e, f) {
        var g = this,
            h = a.node;
        if ("translate" == b) {
            var j = d.split(","),
                b = j[1],
                d = h.offsetTop,
                h = {
                    obj: a,
                    frame: 0,
                    attribute: "left",
                    from: h.offsetLeft,
                    to: j[0],
                    time: e,
                    effect: f
                };
            g.animations.push(h);
            e = {
                obj: a,
                frame: 0,
                attribute: "top",
                from: d,
                to: b,
                time: e,
                effect: f
            };
            g.animations.push(e);
            a.animationX = h;
            a.animationY = e
        }
        g.interval || (g.interval = setInterval(function () {
            g.updateAnimations.call(g)
        }, AmCharts.updateRate))
    },
    updateAnimations: function () {
        for (var a = this.animations.length - 1; 0 <= a; a--) {
            var b = this.animations[a],
                d = 1E3 * b.time / AmCharts.updateRate,
                e = b.frame + 1,
                f = b.obj,
                g = b.attribute;
            if (e <= d) {
                b.frame++;
                var h = Number(b.from),
                    j = Number(b.to) - h,
                    b = this.D[b.effect](0, e, h, j, d);
                0 == j ? this.animations.splice(a, 1) : f.node.style[g] = b
            } else f.node.style[g] = Number(b.to), this.animations.splice(a, 1)
        }
    },
    clipRect: function (a, b, d, e, f) {
        a.node.style.clip = "rect(" + d + "px " + (b + e) + "px " + (d + f) + "px " + b + "px)"
    },
    rotate: function (a, b) {
        var d = a.node,
            e = d.style,
            f = this.getBGColor(d.parentNode);
        e.backgroundColor = f;
        e.paddingLeft = 1;
        var f = b * Math.PI / 180,
            g = Math.cos(f),
            h = Math.sin(f),
            j = this.removePx(e.left),
            k = this.removePx(e.top),
            l = d.offsetWidth,
            d = d.offsetHeight,
            m = b / Math.abs(b);
        e.left = j + l / 2 - l / 2 * Math.cos(f) - m * d / 2 * Math.sin(f) + 3;
        e.top = k - m * l / 2 * Math.sin(f) + m * d / 2 * Math.sin(f);
        e.cssText = e.cssText + "; filter:progid:DXImageTransform.Microsoft.Matrix(M11='" + g + "', M12='" + -h + "', M21='" + h + "', M22='" + g + "', sizingmethod='auto expand');"
    },
    getBGColor: function (a) {
        var b = "#FFFFFF";
        if (a.style) {
            var d = a.style.backgroundColor;
            "" != d ? b = d : a.parentNode && (b = this.getBGColor(a.parentNode))
        }
        return b
    },
    set: function (a) {
        var b = new AmCharts.AmDObject("group", this.D);
        this.D.container.appendChild(b.node);
        if (a) for (var d = 0; d < a.length; d++) b.push(a[d]);
        return b
    },
    gradient: function (a, b, d, e) {
        if (2 < d.length) for (var f = "", g = 1; g < d.length - 1; g++) f += 100 / (g + 2) + "% " + d[g], g < d.length - 2 && (f += ",");
        a = a.fill;
        "radialGradient" == b && (b = "gradientradial");
        "linearGradient" == b && (b = "gradient");
        90 == e ? e = 180 : 270 == e ? e = 0 : 180 == e ? e = 270 : 0 == e && (e = 90);
        g = d[d.length - 1];
        d = d[0];
        8 === document.documentMode ? (a.type = b, a.color = g, a.color2 = d, a.focusposition = "0.5,0.5", a.focussize = "0,0", a.angle = e) : (a.setAttribute("type", b), a.setAttribute("color", g), a.setAttribute("color2", d), a.setAttribute("focusposition", "0.5,0.5"), a.setAttribute("focussize", "0,0"), a.setAttribute("angle", e));
        f && (a.colors.value = f)
    },
    remove: function (a) {
        a.clipPath && this.D.remove(a.clipPath);
        this.D.remove(a.node)
    },
    disableSelection: function (a) {
        void 0 != typeof a.onselectstart && (a.onselectstart = function () {
            return !1
        });
        a.style.cursor = "default"
    }
});
AmCharts.SVGRenderer = AmCharts.Class({
    construct: function (a) {
        this.D = a;
        this.animations = []
    },
    create: function (a, b) {
        return document.createElementNS(AmCharts.SVG_NS, b)
    },
    attr: function (a, b) {
        for (var d in b) this.setAttr(a, d, b[d])
    },
    setAttr: function (a, b, d) {
        void 0 !== d && a.node.setAttribute(b, d)
    },
    animate: function (a, b, d, e, f) {
        var g = this,
            h = a.node;
        "translate" == b ? (h = (h = h.getAttribute("transform")) ? ("" + h).substring(10, h.length - 1) : "0,0", h = h.split(", ").join(" "), h = h.split(" ").join(","), 0 == h && (h = "0,0")) : h = h.getAttribute(b);
        b = {
            obj: a,
            frame: 0,
            attribute: b,
            from: h,
            to: d,
            time: e,
            effect: f
        };
        g.animations.push(b);
        a.animationX = b;
        g.interval || (g.interval = setInterval(function () {
            g.updateAnimations.call(g)
        }, AmCharts.updateRate))
    },
    updateAnimations: function () {
        for (var a = this.animations.length - 1; 0 <= a; a--) {
            var b = this.animations[a],
                d = 1E3 * b.time / AmCharts.updateRate,
                e = b.frame + 1,
                f = b.obj,
                g = b.attribute;
            if (e <= d) {
                b.frame++;
                if ("translate" == g) var h = b.from.split(","),
                    g = Number(h[0]),
                    h = Number(h[1]),
                    j = b.to.split(","),
                    k = Number(j[0]),
                    j = Number(j[1]),
                    k = 0 == k - g ? k : Math.round(this.D[b.effect](0, e, g, k - g, d)),
                    b = 0 == j - h ? j : Math.round(this.D[b.effect](0, e, h, j - h, d)),
                    g = "transform",
                    b = "translate(" + k + "," + b + ")";
                else h = Number(b.from), k = Number(b.to), k -= h, b = this.D[b.effect](0, e, h, k, d), 0 == k && this.animations.splice(a, 1);
                this.setAttr(f, g, b)
            } else "translate" == g ? (j = b.to.split(","), k = Number(j[0]), j = Number(j[1]), f.translate(k, j)) : (k = Number(b.to), this.setAttr(f, g, k)), this.animations.splice(a, 1)
        }
    },
    getBBox: function (a) {
        if (a.node) return a.node.getBBox()
    },
    path: function (a, b) {
        a.node.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", b)
    },
    clipRect: function (a, b, d, e, f) {
        var g = a.node,
            h = a.clipPath;
        h && this.D.remove(h);
        if (g = g.parentNode) {
            var h = document.createElementNS(AmCharts.SVG_NS, "clipPath"),
                j = AmCharts.getUniqueId();
            h.setAttribute("id", j);
            this.D.rect(b, d, e, f, 0, 0, h);
            g.appendChild(h);
            this.setAttr(a, "clip-path", "url(#" + j + ")");
            this.clipPathC++;
            a.clipPath = h
        }
    },
    text: function (a, b, d) {
        var e = new AmCharts.AmDObject("text", this.D);
        e.node.appendChild(document.createTextNode(a));
        a = 0;
        AmCharts.chrome && (a = 1);
        this.setAttr(e, "y", b["font-size"] / 2 + a);
        this.attr(e, b);
        this.D.addToContainer(e.node, d);
        return e
    },
    setText: function (a, b) {
        var d = a.node;
        d && (d.removeChild(d.firstChild), d.appendChild(document.createTextNode(b)))
    },
    move: function (a, b, d) {
        this.setAttr(a, "transform", "translate(" + b + "," + d + ")")
    },
    rotate: function (a, b) {
        var d = a.node.getAttribute("transform"),
            e = "rotate(" + b + ")";
        d && (e = d + " " + e);
        this.setAttr(a, "transform", e)
    },
    set: function (a) {
        var b = new AmCharts.AmDObject("g", this.D);
        this.D.container.appendChild(b.node);
        if (a) for (var d = 0; d < a.length; d++) b.push(a[d]);
        return b
    },
    addListener: function (a, b, d) {
        a.node["on" + b] = d
    },
    gradient: function (a, b, d, e) {
        var f = a.node,
            g = a.grad;
        g && this.D.remove(g);
        b = document.createElementNS(AmCharts.SVG_NS, b);
        g = AmCharts.getUniqueId();
        b.setAttribute("id", g);
        if (!isNaN(e)) {
            var h = 0,
                j = 0,
                k = 0,
                l = 0;
            90 == e ? k = 100 : 270 == e ? l = 100 : 180 == e ? h = 100 : 0 == e && (j = 100);
            b.setAttribute("x1", h + "%");
            b.setAttribute("x2", j + "%");
            b.setAttribute("y1", k + "%");
            b.setAttribute("y2", l + "%")
        }
        for (e = 0; e < d.length; e++) h = document.createElementNS(AmCharts.SVG_NS, "stop"), j = 100 / e, 0 == e && (j = 0), h.setAttribute("offset", j + "%"), h.setAttribute("stop-color", d[e]), b.appendChild(h);
        f.parentNode.appendChild(b);
        f.setAttribute("fill", "url(#" + g + ")");
        a.grad = b
    },
    remove: function (a) {
        a.clipPath && this.D.remove(a.clipPath);
        a.grad && this.D.remove(a.grad);
        this.D.remove(a.node)
    }
});
AmCharts.AmDSet = AmCharts.Class({
    construct: function () {
        this.create("g")
    },
    attr: function (a) {
        this.R.attr(this.node, a)
    },
    move: function (a, b) {
        this.R.move(this.node, a, b)
    }
});
