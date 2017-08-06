import * as sil from './optics.js'
import tap from 'tap'
let {view, optic, inject, remove, compose, chain} = sil;

console.log('hello 56588');

var a3 = {a: 3};
var a5 = {a: 5};
var b3 = {b: 3};
var inja5 = inject('a', 5);
var rema = remove('a');

tap.test('> optics tests', t => {
    t.deepEqual(view(inja5, a3), a5);
    t.deepEqual(view(rema, a3), {});
    t.deepEqual(view(compose(rema, inja5), b3), b3);
    t.deepEqual(view(compose(inja5, ['b', rema]), {b:a3}), {a: 5, b: {}});
    t.deepEqual(view(compose(sil.each(), inja5), {b:{}, c:{}}), {b:{a:5}, c:{a:5}});
    t.deepEqual(view(chain(inja5, rema), b3), b3);
    t.end();
});




