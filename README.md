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
- [ ] Component resize support
	- [x] Item Column Resizable
	- [ ] Item Row Resizable
- [ ] Relative Size representation
- [ ] Component drag and relocation support

## Bug To Fix
- [ ] Resize 핸들 누를 시, 처음에 크기가 탁 튀는 현상

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