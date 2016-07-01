function IrrRange(parm) {
	this.parm = $.extend({
		parElement: "#box",
	}, parm);
	this.$display = $("#screen");
	this.$range = $("#range");
	this.$slect = $("#range").find(".select");
	this.vis = {};
	this.select = {};
	this.map = {};
}
IrrRange.prototype = {
	init: function() {
		this.getdata();
		this.range();
	},
	getdata: function() {
		var $li = this.$range.find("ul").eq(0).find("li");
		//获取所有独立区间左值 
		//获取所有独立区间左值
		this.vis = {
			left: $li.offsetLefts(),
			width: $li.widthS(),
			right: Array.addArray(vis.left, vis.width),
			min: vis.left[0],
			max: vis.right[vis.right.length - 1]
		}
		this.select = {
			sf: vis.min,
			sb: vis.max,
			mf: new Number(),
			mb: new Number()
		}
		this.map = {
			left: [],
			right: [],
			width: [],
		}
		$li.each(function(i, arr) {
			var data = $(arr).attr("data-interval").split("-");
			map.left[i] = data[0];
			map.right[i] = data[1];
			map.width[i] = data[2];
		});
	},
	range: function() {
		var $range = this.$range;
		var select = this.select;
		var tools = IrrRange.tools;
		var dropYJ = false;
		$range.on({
			"mousedown": function() {
				var event = event || window.event;
				dropYJ = true;
				$this.trigger("changeOffset", event.clientX);
				return false;
			},
			"changeOffset": function(event, pClientX) {
				var event = event || window.event;
				//获取当前取值区间左坐标
				//获取当前取值区间右坐标
				var s = tools.nearby(select.sf, select.sb)(pClientX);
				select.sf = tools.spanvalue(vis.min, vis.max)(s.x1);
				select.sb = tools.spanvalue(vis.min, vis.max)(s.x2);

				function offTomap(xun) {
					var off = tools.floorArr(vis.left, xun);
					var x1 = off.val,
						x2 = vis.right[off.index],
						y1 = map.left[off.index],
						y2 = map.right[off.index],
						tSec = map.width[off.index];
					var yun = (map.right[off.index] == 0) ? 0 : parseInt(Range.linearMapping(x1, x2, y1, y2, tSec)(xun));
					return yun;
				}
				//计算取值区间左坐标的映射值
				var select.mf = offTomap(select.sf);
				//计算取值区间右坐标的映射值
				var select.mb = offTomap(select.sb);
				$this.trigger("change", select);
				return select;
			}
		});
		$(document.body).on({
			"mouseup": function(event) {
				dropYJ = false;
				return false;
			},
			"mousemove": function(event) {
				if (dropYJ) {
					var event = event || window.event;
					$this.trigger("changeOffset", event.clientX);
				}
				return false;
			}
		});
	},
	appointRange: function() {
		//计算视觉前坐标font
		var yf = mapTooff(xf);
		//计算视觉后坐标back
		var yb = mapTooff(xb);
		//标注视觉前、后坐标
		slectFrontX = yf
		slectBackX = yb;
		return {
			"frontNumber": xf,
			"backNumber": xb,
			"slectFrontX": yf,
			"slectBackX": yb
		};

		function mapTooff(xun) {
			var off = Range.floorArr(map.left, xun);
			var x1 = off.val,
				x2 = map.right[off.index],
				y1 = vis.left[off.index],
				y2 = vis.right[off.index],
				tSec = map.width[off.index];
			var yun = (map.right[off.index] == 0) ? 0 : parseInt(Range.linearMapping(x1, x2, y1, y2, tSec)(xun));
			return yun;
		}
	},
	showline: function() {
		var $range = this.$range;
		var $select = this.$select;
		$range.on("change", function(event, select) {
			$this.offset({
				"left": select.sf
			});
			$monthFuRangeSlect.width(Math.abs(select.sb - select.sf));
		});
	}

};
IrrRange.tools = {
	"nearby": function(x1, x2) { //就近赋值
		return function(am) {
			Math.abs(x1 - am) < Math.abs(x2 - am) ? (x1 = am) : (x2 = am);
			return {
				"x1": x1,
				"x2": x2
			}
		}
	},
	"spanvalue": function(min, max) { //检查取值范围
		return function(val) {
			if (val <= min) {
				return min;
			}
			if (val >= max) {
				return max;
			}
			return val;
		}
	},
	"linearMapping": function(x1, x2, y1, y2, tSec) { //线性函数映射,以tSec为单位向下取整
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
	},
	"floorArr": function(arrays, val) { // 从小到大顺序排列数组向下取最大元素值
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
	},
	"offsetLefts": function(tar) { //获取所有匹配元素的左值，组成数组
		var $tar = $(tar);
		var Lefts = [];
		$tar.each(function(i, arr) {
			Lefts[i] = $(arr).offset().left;
		});
		return Lefts;
	},
	"widths": function(tar) { //获取所有匹配元素width值，组成数组
		var $tar = $(tar);
		var ws = [];
		$tar.each(function(i, arr) {
			ws[i] = $(arr).width();
		});
		return ws;
	},
	"addArray": function(array1, array2) {
		var array3 = [];
		for (i = array2.length; i--; i >= 0) {
			array3[i] = array2[i] + array1[i];
		}
		return array3;
	}
};
IrrRange.show = {
	"showNumber": (function() { //数值显示
		var _text;
		var toWan = function(index) { //大于1000转化单位 万元,保留一位小数;小于10000，单位元
			if (index >= 10000) {
				return (index / 10000).toFixed(1) + "万元";
			} else {
				return index + "元";
			}
		}
		return function(minNumber, maxNumber, frontNumber, backNumber) {
			if (frontNumber == 0 && backNumber > maxNumber) {
				_text = "不限";
			} else if (frontNumber == 0) {
				_text = toWan(backNumber) + "以下";
			} else if (frontNumber >= maxNumber) {
				_text = toWan(maxNumber) + "以上";
			} else if (backNumber > maxNumber) {
				_text = toWan(frontNumber) + "以上";
			} else {
				_text = toWan(frontNumber) + "~" + toWan(backNumber);
			}
			return _text;
		}
	})(),
	"relativeValue": function(relM, relN, val) {
		relM = parseFloat(relM)
		relN = parseFloat(relN);
		val = parseFloat(val);
		return relM / 2 + relN / 2 - val;
	},
	"select": function(args) { //回调函数，操作dom首付显示
		var frontNumber = args.frontNumber,
			backNumber = args.backNumber,
			slectFrontX = args.slectFrontX,
			slectBackX = args.slectBackX;
		$shouRangeSlect.offset({
			"left": slectFrontX
		});
		$shouRangeSlect.width(Math.abs(slectBackX - slectFrontX));
		_text = showObj.showNumber(0, 500000, frontNumber, backNumber);
		$showShouFu.css("left", showObj.relativeValue(slectFrontX, slectBackX, s_val)).find("p").text(_text);
	}
}

function showline() {
	var irrRange = new IrrRange("#irr-range");
	$monthFuRangeSlect = $("#monthFuRange").find(".rangeSlect");

}

//月供
var $showMonthFu = $("#showMonthFu"),
	$monthFuRange = $("#monthFuRange"),
	$monthFuRangeSlect = $("#monthFuRange").find(".rangeSlect");
var Month = $monthFuRange.range();
var m_val = $monthFuRange.offset().left;

function monthDOM(args) { //回调函数，操作dom月供显示
	var frontNumber = args.frontNumber,
		backNumber = args.backNumber,
		slectFrontX = args.slectFrontX,
		slectBackX = args.slectBackX;
	$monthFuRangeSlect.offset({
		"left": slectFrontX
	});
	$monthFuRangeSlect.width(Math.abs(slectBackX - slectFrontX));
	_text = showObj.showNumber(0, 50000, frontNumber, backNumber);
	$showMonthFu.css("left", showObj.relativeValue(slectFrontX, slectBackX, m_val)).find("p").text(_text);
}
$monthFuRange.on("change", function(event, args) {
	monthDOM(args);
});

//设置首付、月供默认范围
window.onload = function() {
	//设置月供默认范围
	var argsm = Month.appointRange(1000, 20000);
	monthDOM(argsm);
};