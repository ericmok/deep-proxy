# Deep Proxy

This is a proof of concept of how JavaScript Proxy's can be used to wrap objects
and recursively all attributes within it.

```javascript
let linkedList = {
  data: "todos",
  nextNode: {
    data: "asdf",
    nextNode: {
      data: "23h89",
      nextNode: {
        data: "328rj"
      }
    }
  }
}

// Wrap an arbitrary object!
let listProxy = proxyWrap(linkedList);

// Each one of these returns a proxy to mediate mutations
listProxy
listProxy.nextNode
listProxy.nextNode.nextNode
listProxy.nextNode.nextNode.nextNode

// Anytime you try to set a value, a mutation function can be called
listProxy.data = "asdf"
listProxy.nextNode.data = "asdlfkj"
listProxy.nextNode.nextNode.data = "39f8j"

// Currently, mutations only emit console logs
```

With deep proxying, any attribute access that is an object is wrapped by a
Proxy. Any attribute access for that wrapped attribute will also get wrapped by
a Proxy.

Proxies are lazily created and are cached so attributes don't get doubly
wrapped.

This technique can be used to simulate `Object.observe()` or can be used to
create a library to help manage the mutability of objects such as in immer and
immutable.js. Instead of working on a "draft" object or a third party API, deep
proxying lets you manipulate an object directly while being to observe all deep
changes to it.

---------------

## Futher Experiments

- Handle marking objects as modified or not
- Handle subscriptions
  - Allow objects to be subscribable
- Object.observe API
  - Emit change logs in the style of the old observe API
- Persistent data structure using tries
  - Handle equality checks