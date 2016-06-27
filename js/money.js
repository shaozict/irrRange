define(["jquery"], function(require, exports) {
	exports.showNumber = (function() { //数值显示
		var _text;
		var toWan = function(index) { //大于1000转化单位 万元,保留一位小数;小于10000，单位元
			if (index >= 10000) {
				return (index / 10000).toFixed(1) + "万元";
			} else {
				return index + "元";
			}
		}
		return function(minNumber, maxNumber, frontNumber, backNumber) {
			if (backNumber == 0 && frontNumber == 0) {
				_text = toWan(minNumber) + "~" + toWan(maxNumber);
			} else if (frontNumber == 0) {
				_text = toWan(backNumber) + "以下";
			} else if (backNumber == 0) {
				_text = toWan(frontNumber) + "以上";
			} else {
				_text = toWan(frontNumber) + "~" + toWan(backNumber);
			}
			return _text;
		}
	})();
	exports.relativeValue = function(relM, relN, val) {
		relM = parseFloat(relM)
		relN = parseFloat(relN);
		val = parseFloat(val);
		return relM / 2 + relN / 2 - val;
	}

})