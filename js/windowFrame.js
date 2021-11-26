function Item(content) {
	this.content = content || "Hello javascript";
	this.render = function() {
		return `<div class="item border">${this.content}</div>`;
	}
	return this;
}

function Frame() {
	this.children = [];
	this.vertical = false;
	this.add = function(child) {
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