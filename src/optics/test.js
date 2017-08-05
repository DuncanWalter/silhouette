import * as sil from './optics.js'
import tap from 'tap'

console.log('hello 56588');

var a3 = {a: 3};
var a5 = {a: 5};
var b3 = {b: 3};
var inja5 = sil.inject('a', 5);
var rema = sil.remove('a');

tap.test('> optics tests', t => {
    t.deepEqual(inja5.exec(a3), a5);
    t.deepEqual(rema.exec(a3), {});
    t.deepEqual(sil.compose(rema, inja5).exec(b3), b3);
    t.deepEqual(sil.compose(inja5, ['b', rema]).exec({b:a3}), {a: 5, b: {}});
    t.end();
});




