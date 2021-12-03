function Item(content) {
	this.parent = false; //detach시 parent 값 확인 필요
	this.content = content || "Hello javascript";
	this.render = function() {
		var dom = document.createElement('div');
		dom.classList.add("item");
		dom.classList.add("border");
		dom.classList.add("selectable");
		dom.innerText = this.content;
		dom.addEventListener("click", (e) => {
			if (this.parent && this.parent.select && typeof this.parent.select === 'function') {
				this.parent.select(dom);
			}
		});
		return dom;
	}
	return this;
}

function Frame() {
	this.parent = false; //detach시 parent 값 확인 필요
	this.children = [];
	this.vertical = false; // false 시 horizontal
	this.selectedItem = false;
	this.select = function(selectedItem) {
		if (this.parent === false) { //Root Item에서만 수행함
			var prev = this.selectedItem;
			if (prev && prev.classList && prev.classList.contains("selected")) {
				prev.classList.remove("selected");
			}
			this.selectedItem = selectedItem;
			this.selectedItem.classList.add("selected");
		} else if (typeof this.parent.select === 'function') {
			this.parent.select(selectedItem);
		}
	}
	this.add = function(child) {
		child.parent = this;
		this.children.push(child);
	}
	this.get = function(index) {
		return this.children[index];
	}
	this.render = function() {
		if (this.children.length == 0) {
			var dom = document.createElement('div');
			dom.classList.add('frame');
			dom.innerText = "Empty Container";
			return dom;
		} else {
			var dom = document.createElement('div');
			dom.classList.add(`${this.vertical ? "vertical" : "horizontal"}-container`);
			dom.classList.add('frame');
			for (var i=0; i< this.children.length; i++) {
				dom.appendChild(this.children[i].render());
			}
			return dom;
		}
	}
	
	return this;
}