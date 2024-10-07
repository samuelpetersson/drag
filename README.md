# Drag

Recognize drag gesture events.

[Examples](https://samuelpetersson.github.io/drag)


## Install

`npm install github:samuelpetersson/drag`

## Usage

```javascript
import { createGesture } from 'drag'

//Create a new gesture.
const gesture = createGesture(options, callback)

//Stop and remove all event listeners.
gesture.dispose()
```

## Reference

### createGesture(options, callkack)

**Params**

- `options:{target:Element, direction?:"horizontal" | "vertical", input?:"touch" | "mouse"}`

- `callback:(state:"began" | "moved" | "ended", velocity:Point, position:Point) => void`

**Returns**
- `{dispose: () => void}`