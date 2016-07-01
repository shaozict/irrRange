$.fn.range = function() {
	var $this = $(this),
		that = this;
	var dropYJ = false;
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
	$rangeAxisLi.each(function(i, arr) {
		var data = $(arr).attr("data-interval").split("-");
		leftsMap[i] = data[0];
		rightsMap[i] = data[1];
		pansMap[i] = data[2];
	});
	function appointRange(xf, xb) {
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
			var off = Range.floorArr(leftsMap, xun);
			var x1 = off.val,
				x2 = rightsMap[off.index],
				y1 = leftsOffsetRangeAxisLi[off.index],
				y2 = rightsoffsetRangeAxisLi[off.index],
				tSec = pansMap[off.index];
			var yun = (rightsMap[off.index] == 0) ? 0 : parseInt(Range.linearMapping(x1, x2, y1, y2, tSec)(xun));
			return yun;
		}
	}
	$this.on("changeOffset", function(event, pClientX) {
		var event = event || window.event;
		//获取当前取值区间左坐标
		//获取当前取值区间右坐标
		var slectlongX = Range.nearby(slectFrontX, slectBackX)(pClientX);
		slectFrontX = Range.spanvalue(minLength, maxLength)(slectlongX.x1);
		slectBackX = Range.spanvalue(minLength, maxLength)(slectlongX.x2);
		var xFobj = Range.floorArr(leftsOffsetRangeAxisLi, slectFrontX); //获取数组rangeAxisLiOffsetLefts中小于xFm的最大元素值
		var xBobj = Range.floorArr(leftsOffsetRangeAxisLi, slectBackX); //获取数组rangeAxisLiOffsetLefts中小于xBm的最大元素值
		function offTomap(xun) {
			var off = Range.floorArr(leftsOffsetRangeAxisLi, xun);
			var x1 = off.val,
				x2 = rightsoffsetRangeAxisLi[off.index],
				y1 = leftsMap[off.index],
				y2 = rightsMap[off.index],
				tSec = pansMap[off.index];
			var yun = (rightsMap[off.index] == 0) ? 0 : parseInt(Range.linearMapping(x1, x2, y1, y2, tSec)(xun));
			return yun;
		}
		//计算取值区间左坐标的映射值
		var frontNumber = offTomap(slectFrontX);
		//计算取值区间右坐标的映射值
		var backNumber = offTomap(slectBackX);
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
	});
	$this.on("mousedown", function(event) {
		var event = event || window.event;
		dropYJ = true;
		$this.trigger("changeOffset", event.clientX);
		return false;
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
	return {
		"appointRange": appointRange
	}
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
var Range = {};
Range.nearby = function(x1, x2) { //就近赋值
	return function(am) {
		Math.abs(x1 - am) < Math.abs(x2 - am) ? (x1 = am) : (x2 = am);
		return {
			"x1": x1,
			"x2": x2
		}
	}
}
Range.spanvalue = function(min, max) {
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
Range.linearMapping = function(x1, x2, y1, y2, tSec) { //线性函数映射,以tSec为单位向下取整
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
Range.floorArr = function(arrays, val) { // 从小到大顺序排列数组向下取最大元素值
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
	/*  范围显示方式    */
var showObj = {};
showObj.showNumber = (function() { //数值显示
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
})();
showObj.relativeValue = function(relM, relN, val) {
	relM = parseFloat(relM)
	relN = parseFloat(relN);
	val = parseFloat(val);
	return relM / 2 + relN / 2 - val;
}


//首付
var $showShouFu = $("#showShouFu"),
	$shouFuRange = $("#shouFuRange"),
	$shouRangeSlect = $("#shouFuRange").find(".rangeSlect");
var Shou = $shouFuRange.range();
var s_val = $shouFuRange.offset().left;
function shouDoM(args) { //回调函数，操作dom首付显示
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
$shouFuRange.on("change", function(event, args) {
	shouDoM(args);
});
//设置默认范围
window.onload = function() {
	//设置月供默认范围
	var argsm = Shou.appointRange(10, 200);
	shouDoM(argsm);
};

