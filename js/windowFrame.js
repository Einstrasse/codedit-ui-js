function clickEvtListener(e) {
	var target = e.target;
	if (target && target.classList && target.classList.contains('selectable')) {
		if (target.classList.contains("selected")) {
			target.classList.remove("selected");
		} else {
			target.classList.add("selected");
		}
			
	}
}

function Item(content) {
	this.parent = false; //detach시 parent 값 확인 필요
	this.content = content || "Hello javascript";
	this.render = function() {
		return `<div class="item border selectable">${this.content}</div>`;
	}
	return this;
}

function Frame() {
	this.parent = false; //detach시 parent 값 확인 필요
	this.children = [];
	this.vertical = false; // false 시 horizontal
	this.add = function(child) {
		child.parent = this;
		this.children.push(child);
	}
	this.get = function(index) {
		return this.children[index];
	}
	this.render = function() {
		if (this.children.length == 0) {
			return `<div class="frame">Empty Container</div>`;
		} else {
			var html = "";
			for (var i=0; i < this.children.length; i++) {
				html += this.children[i].render();
			}
			return `<div class="${this.vertical ? "vertical" : "horizontal"}-container frame">${html}</div>`;
		}
	}
	
	return this;
}