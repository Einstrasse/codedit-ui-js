function Item(content) {
	var self = this;
	this.parent = false; //detach시 parent 값 확인 필요
	this.content = content || "Hello javascript";
	this.width = false;
	this.dom = false;
	this.remove = function() {
		//스스로를 제거 - Item의 remove랑 동일
		if (this.parent === false) {
			console.log("Error: try to delete root item");
			return;
		}
		var oldList = this.parent.children;
		var newList = [];
		for (var i=0; i < oldList.length; i+=2) {
			if (this === oldList[i]) continue;
			newList.push(oldList[i]);
		}
		this.parent.children = [];
		newList.forEach(item => {
			this.parent.add(item);
		});
		if (this.parent.children.length === 0) {
			//Frame이 빈 것이 되면 Frame도 삭제
			this.parent.remove();
		}
	}
	this.resize = function() {}
	this.init = function(size) { //크기 지정한 resize
		if (size) {
			if (size.width){
				self.dom.style.width = size.width;
			}
			if (size.height) {
				self.dom.style.height = size.height;
			}
		}
	}
	this.render = function() {
		self.dom = document.createElement('div');
		self.dom.classList.add("item");
		self.dom.classList.add("border");
		self.dom.classList.add("selectable");
		self.dom.classList.add("resizable");
		self.dom.innerText = self.content;
		if (self.width) {
			self.dom.style.width = self.width;
		}
		self.dom.addEventListener("click", (e) => {
			if (self.parent && self.parent.select && typeof self.parent.select === 'function') {
				self.parent.select(self);
			}
		});
		return self.dom;
	}
	return self;
}
function Resizer() {
	this.vertical = false; //false시 horizontal
	this.parent = false;
	this.prev = false;
	this.next = false;
	this.dom = false;
	this.posX = false;
	this.posY = false;
	var self = this;
	this.init = () => {};
	this.resizeX = (e) => {
		if (e && (e.width || e.height))  {
			return;
		}
		var dx = 0;
		if (e && e.x) {
			dx = self.posX - e.x;
			self.posX = e.x;
		}
		if (self.prev && self.next) {
			var prevOldSize = parseFloat(getComputedStyle(self.prev.dom, '').width);
			var nextOldSize = parseFloat(getComputedStyle(self.next.dom, '').width);
			var prevNewSize = prevOldSize - dx;
			var nextNewSize = nextOldSize + dx;
			if (self.prev.dom.style.width.indexOf("%") !== -1 && self.next.dom.style.width.indexOf("%") !== -1) {
				var parentSize = parseFloat(getComputedStyle(self.parent.dom, '').width);
				var prevOldPercentSize = parseFloat(self.prev.dom.style.width);
				var nextOldPercentSize = parseFloat(self.next.dom.style.width);
				var totalOldPercentSize = prevOldPercentSize + nextOldPercentSize;
				var prevNewPercentSize = prevNewSize / parentSize * 100;
				var nextNewPercentSize = nextNewSize / parentSize * 100;
				var totalNewPercentSize = prevNewPercentSize + nextNewPercentSize;
				var calibration = totalOldPercentSize / totalNewPercentSize;
				prevNewPercentSize *= calibration;
				nextNewPercentSize *= calibration;
				self.prev.dom.style.width = prevNewPercentSize + "%";
				self.next.dom.style.width = nextNewPercentSize + "%";
			} else {
				self.prev.dom.style.width = prevNewSize + "px";
				self.next.dom.style.width = nextNewSize + "px";
			}
		}
	};
	this.resizeY = (e) => {
		if (e && (e.width || e.height))  {
			return;
		}
		var dy = 0;
		if (e && e.y) {
			dy = self.posY - e.y;
			self.posY = e.y;
		}
		if (self.prev && self.next) {
			var prevOldSize = parseFloat(getComputedStyle(self.prev.dom, '').height);
			var nextOldSize = parseFloat(getComputedStyle(self.next.dom, '').height);
			var prevNewSize = prevOldSize - dy;
			var nextNewSize = nextOldSize + dy;
			if (self.prev.dom.style.height.indexOf("%") !== -1 && self.next.dom.style.height.indexOf("%") !== -1) {
				var parentSize = parseFloat(getComputedStyle(self.parent.dom, '').height);
				var prevOldPercentSize = parseFloat(self.prev.dom.style.height);
				var nextOldPercentSize = parseFloat(self.next.dom.style.height);
				var totalOldPercentSize = prevOldPercentSize + nextOldPercentSize;
				var prevNewPercentSize = prevNewSize / parentSize * 100;
				var nextNewPercentSize = nextNewSize / parentSize * 100;
				var totalNewPercentSize = prevNewPercentSize + nextNewPercentSize;
				var calibration = totalOldPercentSize / totalNewPercentSize;
				prevNewPercentSize *= calibration;
				nextNewPercentSize *= calibration;
				self.prev.dom.style.height = prevNewPercentSize + "%";
				self.next.dom.style.height = nextNewPercentSize + "%";
			} else {
				var totalOldSize = prevOldSize + nextOldSize;
				var totalNewSize = prevNewSize + nextNewSize;
				var calibration = totalOldSize / totalNewSize;
				prevNewSize *= calibration;
				nextNewSize *= calibration;
				self.prev.dom.style.height = prevNewSize + "px";
				self.next.dom.style.height = nextNewSize + "px";
			}
		}
	};
	this.resize = function(e) { //가로 resize 기준, event resize
		if (self.vertical) {
			self.resizeY(e);
		} else {
			self.resizeX(e);
		}
	}
	this.render = function() {
		self.dom = document.createElement('div');
		self.dom.classList.add(`${self.vertical ? "row" : "col"}-resize`);
		self.dom.addEventListener("mousedown", (e) => {
			self.posX = e.x;
			self.posY = e.y;
			document.addEventListener("mousemove", self.resize, false);
		});
		document.addEventListener("mouseup", ()=>{
			document.removeEventListener("mousemove", self.resize, false);
		});
		return self.dom;
	}
}

function Frame() {
	this.parent = false; //detach시 parent 값 확인 필요
	this.children = [];
	this.vertical = false; // false 시 horizontal, 이 값이 바뀔 때 resizer에도 propagation이 되야함..
	this.width = false;
	this.selectedItem = false;
	this.dom = false;
	var self = this;
	this.remove = function() {
		//스스로를 제거 - Item의 remove랑 동일
		if (this.parent === false) {
			console.log("Error: try to delete root item");
			return;
		}
		var oldList = this.parent.children;
		var newList = [];
		for (var i=0; i < oldList.length; i+=2) {
			if (this === oldList[i]) continue;
			newList.push(oldList[i]);
		}
		this.parent.children = [];
		newList.forEach(item => {
			this.parent.add(item);
		});
		if (this.parent.children.length === 0) {
			//Frame이 빈 것이 되면 Frame도 삭제
			this.parent.remove();
		}
	}
	this.resize = function() {
		for (var i=0; i< this.children.length; i++) {
			this.children[i].resize();
		}
	}
	this.init = function() {
		if (self.parent === false) {
			self.dom.style.height = "100%";
			self.dom.style.width = "100%";
		} else {
			var numChild = self.parent.children.length;
			var parentVertical = self.parent.vertical;
			var portion = 100 * 2 / (numChild + 1);
			if (parentVertical) {
				self.dom.style.height = portion + "%";
				self.dom.style.width = "100%";
			} else {
				self.dom.style.height = "100%";
				self.dom.style.width = portion + "%";
			}
		}
		var width;
		var height;
		if (this.vertical === false) {
			width = 200 / (this.children.length+1) + "%";
			height = "auto";
		} else {
			width = "auto";
			height = 200 / (this.children.length+1) + "%";
		}
		for (var i=0; i < this.children.length; i++) {
			this.children[i].init({
				width: width,
				height: height
			});
		}
	}
	this.select = function(selectedItem) {
		if (self.parent === false) { //Root Item에서만 수행함
			var prev = self.selectedItem.dom;
			if (prev && prev.classList && prev.classList.contains("selected")) {
				prev.classList.remove("selected");
			}
			self.selectedItem = selectedItem;
			self.selectedItem.dom.classList.add("selected");
		} else if (typeof self.parent.select === 'function') {
			self.parent.select(selectedItem);
		}
	}
	this.add = function(child) {
		child.parent = self;
		if (self.children.length > 0) { //중간 중간에 resizer 끼워넣기
			var resizer = new Resizer();
			resizer.parent = self;
			resizer.vertical = self.vertical;
			resizer.prev = self.children[self.children.length - 1];
			resizer.next = child;
			self.children.push(resizer);
		}
		self.children.push(child);
	}
	this.get = function(index) {
		return self.children[index];
	}
	this.render = function() {
		if (self.children.length === 0) {
			self.dom = document.createElement('div');
			self.dom.classList.add('frame');
			self.dom.innerText = "Empty Container";
			if (self.width) {
				self.dom.style.width = self.width;
			}
			return self.dom;
		} else {
			self.dom = document.createElement('div');
			self.dom.classList.add(`${self.vertical ? "vertical" : "horizontal"}-container`);
			self.dom.classList.add('frame');
			if (self.width) {
				self.dom.style.width = self.width;
			}
			for (var i=0; i< self.children.length; i++) {
				self.dom.appendChild(self.children[i].render());
			}
			return self.dom;
		}
	}
	
	return this;
}