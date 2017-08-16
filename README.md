[![Build Status](https://travis-ci.org/DuncanWalter/silhouette.svg?branch=master)](https://travis-ci.org/DuncanWalter/silhouette)


# **Silhouette**

### **Quick Start**
-----------------------

This package is a quick-start for using Silhouette; it comes equipped with rxjs, redux, and some redux enhancers out of the box. Because of its 'batteries included' package, it is less configurable and significantly larger in bundle size than silhouette-core. [Silhouette-core](https://www.npmjs.com/package/silhouette-core) is the recommended way to use silhouette in production.

### **Usage**
-----------------------

Silhouette exports only a create method, which accepts no arguments. 

``` javascript
import { create } from 'silhouette'

let sil = create();
```

The created silhouette instance behaves according to documentation here:
- [Silhouette-core](https://www.npmjs.com/package/silhouette-core)
- [Silhouette-plugin-rxjs](https://www.npmjs.com/package/silhouette-plugin-rxjs)

### **Features**
-----------------------

Features of the quick-start __not__ found in silhouette-core by default.
- Built in RXJS observables
- Built in redux store
- Built in support for redux devtools extentions
- Built in action logger