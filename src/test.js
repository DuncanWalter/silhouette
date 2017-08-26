import tap from 'tap'
import { create } from './index'
let sil = create();

tap.test('silhouette tests', t => {
    t.true(sil);
    sil.define({ a: 3, b: { c: 1, d: 4 }});
    t.true(sil.a);
    t.true(sil.b.c);
    sil.remove('b', 'c');
    t.same(sil.b.c, undefined);
    t.true(sil.b.d);
    sil.b.define([10, 20, 30], 'c');
    t.true(sil.b.c[0]);
    let incra = 0;
    let incrb = 0;
    sil.b.extend('any', (s, a) => {
        incrb++;
        return s;
    });
    sil.a.extend('any', (s, a) => {
        incra++;
        return s;
    });
    sil.b.dispatch('any', { });
    t.equal(incrb, 1);
    t.equal(incra, 1);
    sil.b.dispatch('any', { });
    t.equal(incrb, 2);
    t.equal(incra, 2);


    sil = create();
    sil.define({view: {}});

    sil.view.define({ a: [{v: 1}]});

    let c = 0;
    sil.view.a[0].v.asObservable().subscribe(v => c = v);
    t.true(c === 1);
    sil.view.a[0].asObservable().subscribe(v => c = v);
    t.true(c instanceof Object);
    sil.view.a.asObservable().subscribe(v => c = v);
    t.true(c instanceof Array);
    sil.view.asObservable().subscribe(v => c = v);
    t.true(c instanceof Object);
    sil.asObservable().subscribe(v => c = v);
    t.true(c instanceof Object);









    t.end();
});