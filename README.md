[![Build Status](https://travis-ci.org/DuncanWalter/silhouette.svg?branch=master)](https://travis-ci.org/DuncanWalter/silhouette)


# **Silhouette Store**
-----------------------

Redux and other 'state atom' libraries are great at managing complex state. I'm a fan of both their miniscule APIs and their proofy philosophy. However, they are a bit picky about architecture. My redux store has more opinions than I do on how my projects should be structured. As a JavaScripter, I would like to be king of my code palace(s), so this is a nagging issue. In an attempt to either solve or justify the problem, I created Silhouette: an experimental façade over redux.  

| Silhouette |                  |   Redux   |
|-----------:|:----------------:|:----------|
|      5     |   Base API size  |     3     |
|    True    | Reactive Support | ...Kinda? |
|    True    |      Global      |    True   |
|     TBD    |  Time Travelling |    True   |
|    True    |     Immutable    |    True   |
|    True    |   Lazy Support   | ...Kinda? |
|     ???    |  Learning Curve  |  Steepish |
|    Redux   |   Dependencies   |   None!   |

Silhouette gets its name from how it behaves as state changes. The silhouette object will always be the same 'shape' as the state object, though it will be comprized only of other Silhouette instances (all connected to the same redux store). Each silhouette instance inherits four functions by default:

```
1) dispatch :: (type, payload) -> void
2) extend :: (type, reducer) -> void
3) define :: (state, ...path) -> void
4) remove :: (...path) -> void
```

Using middleware, silhouettes are designed to naturally support reactive programming, so I'd expect a fifth method in actual usage.

```
5) observe :: () -> Observable
```

A root silhouette object is created by a global create method which accepts an optional list of plugins:

``` javascript
import { create, rxjsPlugin } from 'silhouette-store'

const sil = create( rxjsPlugin );

console.log(sil); // > S { }
```

Who likes increment examples? No one? Ok, have another one:

``` javascript
let step = 1;

// easiest way to mold initial state
sil.define({ value: 0, step });

// silhouette mimics the shape of state actively
console.log(sil); // > S { value: S { }, step: { } }

// update step using sil as observable
sil.step.observe().subscribe(v => step = v);

// reducers and actions
sil.value.extend('incr', value => value + step);
sil.value.extend('incr', value => value - step);
sil.step.extend('FASTER!', step => step + 1);

// so we can see state at each update
sil.observe().subscribe(v => console.log(v)); // > { value: 0, step: 1 }

sil.dispatch('incr', {});     // > { value:  1, step: 1 }
sil.dispatch('FASTER!', {});  // > { value:  1, step: 2 }
sil.dispatch('decr', {});     // > { value: -1, step: 2 }

// dispatches work from any silhouette
sil.step.dispatch('incr', {};) // > { value:  1, step: 2 }
```