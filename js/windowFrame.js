function Item(content) {
	this.parent = false; //detach시 parent 값 확인 필요
	this.content = content || "Hello javascript";
	this.width = false;
	this.dom = false;
	var self = this;
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
				self.parent.select(self.dom);
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
	var self = this;
	this.resize = function(e) { //가로 resize 기준
		const dx = self.posX - e.x;
		self.posX = e.x;
		if (self.prev && self.next) {
			var prevOldSize = parseInt(getComputedStyle(self.prev.dom, '').width);
			var nextOldSize = parseInt(getComputedStyle(self.next.dom, '').width);
			var prevNewSize = prevOldSize - dx;
			var nextNewSize = nextOldSize + dx;
			self.prev.dom.style.width = prevNewSize + "px";
			self.next.dom.style.width = nextNewSize + "px";
			// var sumSize = prevNewSize + nextNewSize;
			// var prevGrow = Number(getComputedStyle(self.prev.dom).flexGrow);
			// var nextGrow = Number(getComputedStyle(self.next.dom).flexGrow);
			// var sumGrow = prevGrow + nextGrow;
			// var prevGrowNew = sumGrow * (prevNewSize / sumSize);
			// var nextGrowNew = sumGrow * (nextNewSize / sumSize);
			// self.prev.dom.style.flexGrow = prevGrowNew;
			// self.next.dom.style.flexGrow = nextGrowNew;
		}
	}
	this.render = function() {
		self.dom = document.createElement('div');
		self.dom.classList.add(`${self.vertical ? "row" : "col"}-resize`);
		self.dom.addEventListener("mousedown", (e) => {
			self.posX = e.x;
			console.log("Register!");
			document.addEventListener("mousemove", self.resize, false);
		});
		document.addEventListener("mouseup", ()=>{
			console.log("Release!");
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
	this.select = function(selectedItem) {
		if (self.parent === false) { //Root Item에서만 수행함
			var prev = self.selectedItem;
			if (prev && prev.classList && prev.classList.contains("selected")) {
				prev.classList.remove("selected");
			}
			self.selectedItem = selectedItem;
			self.selectedItem.classList.add("selected");
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