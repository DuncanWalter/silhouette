[![Build Status](https://travis-ci.org/DuncanWalter/silhouette.svg?branch=master)](https://travis-ci.org/DuncanWalter/silhouette)


## **Silhouette Store**
-----------------------

Redux and other 'state atom' libraries are great at managing complex state. I'm a fan of both their miniscule APIs and their proofy philosophy. However, I have found them to be a bit loud from an architecture perspective. My redux store has more opinions than I do on how my projects should be structured and programmed. As a JavaScripter, I would like to be in charge of my code palace(s), so this is a nagging problem. In an attempt to either solve or justify the issue, I created Silhouette: an experimental façade over redux.  

Silhouette gets its name from how it behaves as state changes. The silhouette object will always be the same 'shape' as the state object, though it will be comprized only of other Silhouette instances (all connected to the same store). Each silhouette instance inherits four functions by default:
```
1) dispatch :: (type, payload, globally = false) -> void
2) extend :: (...reducers) -> void
3) inject :: (state, ...path) -> void
4) remove :: (...path) -> void
```
Using middleware, I imagine they will usually either be configured to inherit a fifth...
```
5) watch :: () -> Observable
```
or to become MobX-style observables themselves:
```
g) computed(...silhouettes, computation) -> Observable
```
So, in use with React or Vue, I imagine the global silhouette is broken up and passed down the component tree by simple components like so:
```
render(props){
    return (
        <Fork>
            <Right sil={ props.sil.right } />
            <Left  sil={ props.sil.left  } />
        </Fork>
    )
}
```
While more stateful components can extend, inject, and watch the silhouettes to achieve arbitrary logic.