import tap from 'tap'
import { create } from '~/src/silhouette/silhouette'
import rxjsPlugin from './plugin-rxjs'
const sil = create( rxjsPlugin );

tap.test('rxjsPlugin tests', t => {
    t.true(sil);
    sil.define({ a: 3, b: { c: 1, d: 4 }});
    t.true(sil.a);
    t.true(sil.b.c);
    
    let incra = 0;
    let incrb = 0;
    let a = 0;
    let b = undefined;

    sil.a.observe().subscribe((val) => a = val);
    sil.b.observe().subscribe((val) => b = val);
    sil.a.observe().subscribe((val) => incra++);
    sil.b.observe().subscribe((val) => incrb++);

    t.same(a, 3);
    let aa = incra;
    let bb = incrb;

    sil.a.define(4);
    t.same(a, 4);
    t.true(incra > aa);
    aa = incra;
    t.true(incrb == bb);

    sil.b.define([10, 20, 30], 'c');
    t.same(incra, aa);
    t.true(incrb > bb);
    t.deepEqual(b, {c: [10, 20, 30], d: 4});

    sil.b.extend('whatever', state => {
        state.c.push(1);
        return state;
    });
    sil.b.dispatch('whatever', {});

    t.true(b.c[3]);

    // TODO check on the reducers and contorts

    t.end();
    
});