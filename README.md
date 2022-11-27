# x-counter

![image of x-counter component](x-counter-web-component.png)

### \<x-counter count="0" step="1" text-size="1rem"\>\<\/x-counter\>
**default attribute values:** count=0 step=1 text-size=1rem
- `count` current count's number value.
- `step` the amount to [inc/dec]rement count by.
- `text-size` sets the css `font-size` property used for the count text.<br>
The button sizes are relative to `text-size` and will scale with it.


### Count Event
Custom event that fires when the component's count property has changed.<br>
The current count property can be found in the `event` paramter of the event <br>
listeners callback function. See usage for an example.

usage:
```javascript
document.querySelctor('x-count').addEventListener('count', event => {
  console.log(event.detail.count)
})
```
