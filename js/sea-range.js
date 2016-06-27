define(['jquery'],function(require, exports, module) {
	$.fn.range = function() {
		var $this = $(this);
		var dropYJ = false;
		var obj = $.extend(true, {
			"line": [{
				"start": 0,
				"end": 0,
				"pan": 1
			}, {
				"start": 0,
				"end": 10000,
				"pan": 2000
			}, {
				"start": 10000,
				"end": 20000,
				"pan": 2000
			}, {
				"start": 20000,
				"end": 50000,
				"pan": 6000
			}, {
				"start": 50000,
				"end": 100000,
				"pan": 10000
			}, {
				"start": 100000,
				"end": 200000,
				"pan": 20000
			}, {
				"start": 200000,
				"end": 500000,
				"pan": 60000
			}, {
				"start": 500000,
				"end": 500000,
				"pan": 1
			}]
		}, arguments[0]);
		var $rangeAxisLi = $this.find("ul").eq(0).find("li");
		//获取所有独立区间左值 
		//获取所有独立区间左值
		var leftsOffsetRangeAxisLi = $rangeAxisLi.offsetLefts();
		var wdthsRangeAxisLi = $rangeAxisLi.widthS();
		var rightsoffsetRangeAxisLi = Array.addArray(leftsOffsetRangeAxisLi, wdthsRangeAxisLi);
		var minLength = leftsOffsetRangeAxisLi[0],
			maxLength = rightsoffsetRangeAxisLi[rightsoffsetRangeAxisLi.length - 1];
		var slectFrontX = minLength,
			slectBackX = maxLength;
		var leftsMap = [],
			rightsMap = [],
			pansMap = [];
		obj.line.forEach(function(arr, i) {
			leftsMap[i] = obj.line[i].start;
			rightsMap[i] = obj.line[i].end;
			pansMap[i] = obj.line[i].pan;
		});
		$this.on("changeOffset", function(event, pClientX) {
			var event = event || window.event;
			//获取当前取值区间左坐标
			//获取当前取值区间右坐标
			var slectlongX = Range.nearby(slectFrontX, slectBackX)(pClientX);
			slectFrontX = Range.spanvalue(minLength, maxLength)(slectlongX.x1);
			slectBackX = Range.spanvalue(minLength, maxLength)(slectlongX.x2);
			var xFobj = Range.floorArr(leftsOffsetRangeAxisLi, slectFrontX); //获取数组rangeAxisLiOffsetLefts中小于xFm的最大元素值
			var xBobj = Range.floorArr(leftsOffsetRangeAxisLi, slectBackX); //获取数组rangeAxisLiOffsetLefts中小于xBm的最大元素值
			//计算取值区间左坐标的映射值
			var mapF = {
				"x1": "",
				"x2": "",
				"y1": "",
				"y2": "",
				"xm": "",
				"tsec": ""
			};
			mapF.xm = slectFrontX;
			mapF.x1 = xFobj.val;
			var xFindex = xFobj.index
			mapF.x2 = rightsoffsetRangeAxisLi[xFindex];
			mapF.y1 = leftsMap[xFindex];
			mapF.y2 = rightsMap[xFindex];
			mapF.tSec = pansMap[xFindex];
			var frontNumber = (rightsMap[xFindex] == 0) ? 0 : parseInt(Range.linearMapping(mapF.x1, mapF.x2, mapF.y1, mapF.y2, mapF.tSec)(mapF.xm));
			//计算取值区间右坐标的映射值
			var mapB = {
				"x1": "",
				"x2": "",
				"y1": "",
				"y2": "",
				"xm": "",
				"tSec": ""
			};
			mapB.xm = slectBackX;
			mapB.x1 = xBobj.val;
			var xBindex = xBobj.index;
			mapB.x2 = rightsoffsetRangeAxisLi[xBindex];
			mapB.y1 = leftsMap[xBindex];
			mapB.y2 = rightsMap[xBindex];
			mapB.tSec = pansMap[xBindex];
			var backNumber = (rightsMap[xBindex] == 0) ? 0 : parseInt(Range.linearMapping(mapB.x1, mapB.x2, mapB.y1, mapB.y2, mapB.tSec)(mapB.xm));
			$this.trigger("change", {
				frontNumber: frontNumber,
				backNumber: backNumber,
				slectFrontX: slectFrontX,
				slectBackX: slectBackX
			});
			return {
				"frontNumber": frontNumber,
				"backNumber": backNumber,
				"slectFrontX": slectFrontX,
				"slectBackX": slectBackX
			}
		});
		$this.on("change", function(event, args) {
			return false;
		})
		$this.on("mousedown", function(event) {
			var event = event || window.event;
			dropYJ = true;
			$this.trigger("changeOffset", event.clientX);
		})
		$(document.body).on({
			"mouseup": function() {
				dropYJ = false;
				return false;
			},
			"mousemove": function() {
				if (dropYJ) {
					var event = event || window.event;
					$this.trigger("changeOffset", event.clientX);
				}
			}
		})
	}
	Array.addArray = function(array1, array2) {
		var array3 = [];
		for (i = array2.length; i--; i >= 0) {
			array3[i] = array2[i] + array1[i];
		}
		return array3;
	}
	$.fn.offsetLefts = function() { //获取所有匹配元素的左值，组成数组
		var $this = $(this);
		var Lefts = [];
		$this.each(function(i, arr) {
			Lefts[i] = $(arr).offset().left;
		});
		return Lefts;
	}
	$.fn.widthS = function() { //获取所有匹配元素width值，组成数组
		var $this = $(this);
		var ws = [];
		$this.each(function(i, arr) {
			ws[i] = $(arr).width();
		});
		return ws;
	}
	var Range = (function() {
		var nearby = function(x1, x2) { //就近赋值
			return function(am) {
				Math.abs(x1 - am) < Math.abs(x2 - am) ? (x1 = am) : (x2 = am);
				return {
					"x1": x1,
					"x2": x2
				}
			}
		}
		var spanvalue = function(min, max) {
			return function(val) {
				if (val <= min) {
					return min;
				}
				if (val >= max) {
					return max;
				}
				return val;
			}
		}
		var linearMapping = function(x1, x2, y1, y2, tSec) { //线性函数映射,以tSec为单位向下取整
			x1 = parseFloat(x1)
			x2 = parseFloat(x2);
			y1 = parseFloat(y1);
			y2 = parseFloat(y2);
			tSec = parseFloat(tSec);
			var lx = x2 - x1;
			var ly = y2 - y1;
			var scale = ly / lx;
			return function(xm) {
				return Math.floor((scale * xm - scale * x1) / tSec) * tSec + y1;
			}
		}
		var floorArr = function(arrays, val) { // 从小到大顺序排列数组向下取最大元素值
			for (var i = arrays.length; i >= 0; i--) {
				if (val >= arrays[i]) {
					return {
						"val": arrays[i],
						"index": i
					};
				}
			}
			return {
				"val": arrays[0],
				"index": 0
			}
		}
		var customFun = function(frontNumber, backNumber, slectFrontX, slectBackX) {
			return false;
		}
		return {
			"nearby": nearby,
			"spanvalue": spanvalue,
			"linearMapping": linearMapping,
			"floorArr": floorArr,
			"customFun": customFun
		}
	})();
});