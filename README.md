# mercury-rx

Reactive main-loop for the [mercury] frontend framework

[RxJS] and [mercury] are pluggable and not in the
dependency tree of this package

## Examples

### Hello world

```js
'use strict';

var document = require('global/document');
var hgrx = require('mercury-rx');
var hg = require('mercury');
var h = require('mercury').h;
var Rx = require('rx');

var clicks = new Rx.Subject();
clicks.onEvent = clicks.onNext.bind(clicks);

function App() {
    return clicks.startWith(0)
        .scan(function incrementCounter(state) {
            return state + 1;
        });
}

App.render = function render(state) {
    return h('div.counter', [
        'The state ', h('code', 'clickCount'),
        ' has value: ' + state + '.', h('input.button', {
            type: 'button',
            value: 'Click me!',
            'ev-click': hg.send(clicks.onEvent)
        })
    ]);
};

hgrx.app(hg, document.body, App(), App.render);
```

### Combine states and channels (not recommended)

```js
'use strict';

var document = require('global/document');
var hgrx = require('mercury-rx');
var hg = require('mercury');
var h = require('mercury').h;
var Rx = require('rx');
var extend = require('xtend');

function App() {
    var clicks = new Rx.Subject();

    return clicks.startWith({
        value: 0,
        channels: hgrx.subjectChannels({
            clicks: clicks
        })
    }).scan(function incrementCounter(state) {
        var newState = extend(state);
        newState.value = newState.value + 1;
        return newState;
    });
}

App.render = function render(state) {
    return h('div.counter', [
        'The state ', h('code', 'clickCount'),
        ' has value: ' + state.value + '.', h('input.button', {
            type: 'button',
            value: 'Click me!',
            'ev-click': hg.send(state.channels.clicks)
        })
    ]);
};

hgrx.app(hg, document.body, App(), App.render);
```

## Installation

`npm install mercury-rx`

## API

### hgrx.app

```typescript
function app(
  hg: Mercury,
  elem: HTMLElement,
  state: Observable<any>,
  render: (state: any) => VNode,
  opts?: any
) : Disposable;
```

### hgrx.subjectChannels

```typescript
// `channels` is an object like
// { onclick: new Rx.Subject() }
function subjectChannels(channels: any) : any;
```

## Using other event streams(e.g. kefir, most) instead of Rx Observable

This is totally possible. Just implement `onNext(value: any)` for subjects
inside `subjectChannels`. And implement
`subscribe(onNext: (value: any) => void)` for the observable of `app`.

  [mercury]: https://github.com/Raynos/mercury
  [RxJS]: https://github.com/Reactive-Extensions/RxJS
