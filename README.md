# codedit-ui-js

vscode나 visual studio 같은 유용한 코드 에디터에서 제공하는 코드 윈도우 분할 기능, 크기조절기능, 위치 변경 기능 등의 유용한 기능을 웹에서 사용할 수 있도록 프레임워크 없이 순수 자바스크립트로 구현해보는 토이 프로젝트입니다.

## Structure
Frame과 Item이 있다. Frame은 안에 Item이나 다른 Frame을 포함할 수 있고, Item은 컨텐츠 그 자체이다.
Frame은 아이템을 가로 또는 세로로만 배열할 수 있다.

## Features todo
- [x] Represent hierarchical structure
- [x] Selectable Component
- [x] Uniquely selectable item in same Frame
- [x] Strong binding between javascript object and HTML element
- [x] Component resize support
	- [x] Item Column Resizable
	- [x] Item Row Resizable
- [ ] Relative Size representation
- [x] Item add and remove support
	- [x] Item remove
	- [x] Item add
		- [x] Item add top
		- [x] Item add bottom
		- [x] Item add left
		- [x] Item add right
- [ ] Component drag and relocation support
- [ ] Set default size weight API providing

## Bug To Fix
- [x] Resize 핸들 누를 시, 처음에 크기가 탁 튀는 현상
	- Border, Margin, Resizer등의 크기를 생각하지 않고 코드를 작성하여서 생긴 문제. 크기 비율을 할당하고 비율에 맞게 재조정한 뒤 적용하니 해결됨
- [ ] Remove했을 때 Frame 안에 Item 하나만 남은 경우 처리

## References
### CSS & HTML Layout related
- https://stackoverflow.com/questions/29517722/html-align-div-children-horizontally
- https://developer.mozilla.org/ko/docs/Web/API/HTML_Drag_and_Drop_API
### js related
- https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener
- https://stackoverflow.com/questions/33471716/lazy-binding-click-event-on-elements-not-on-dom
### Examples
- https://developer.mozilla.org/ko/docs/Web/API/Document/drag_event
- https://stackoverflow.com/questions/28767221/flexbox-resizing