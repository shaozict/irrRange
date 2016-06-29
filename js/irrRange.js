function IrrRange(tar) {
	this.$range = $(tar);
	this.data = {
		vis: {},
		map: {},
		select: {}
	};
	this.init();
}
IrrRange.prototype = {
	init: function() {
		this.setdata();
		this.range();
	},
	setdata: function() {
		var $li = this.$range.find("ul").eq(0).find("li");
		var vis = this.data.vis;
		vis.left =  IrrRange.tools.offsetLefts($li);
		vis.width = IrrRange.tools.widths($li);
		vis.right = IrrRange.tools.addArray(this.data.vis.left, this.data.vis.width);
		vis.min = vis.left[0];
		vis.max = vis.right[this.data.vis.right.length - 1];
		this.data.select = {
			sf: this.data.vis.min,
			sb: this.data.vis.max,
			mf: new Number(),
			mb: new Number()
		};
		this.data.map = {
			left: [],
			right: [],
			width: [],
		};
		var map = this.data.map;
		$li.each(function(i, arr) {
			var data = $(arr).attr("data-interval").split("-");
			map.left[i] = data[0];
			map.right[i] = data[1];
			map.width[i] = data[2];
		});
	},
	range: function() {
		var $range = this.$range;
		var vis = this.data.vis;
		var map = this.data.map;
		var select = this.data.select;
		var tools = IrrRange.tools;
		var dropYJ = false;
		$range.on({
			"mousedown": function() {
				var event = event || window.event;
				dropYJ = true;
				$range.trigger("changeOffset", event.clientX);
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
					var yun = (map.right[off.index] == 0) ? 0 : parseInt(tools.linearMapping(x1, x2, y1, y2, tSec)(xun));
					return yun;
				}
				//计算取值区间左坐标的映射值
				select.mf = offTomap(select.sf);
				//计算取值区间右坐标的映射值
				select.mb = offTomap(select.sb);
				$range.trigger("change", select);
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

new IrrRange("#irr-range");

