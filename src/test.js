import tap from 'tap'
import { create } from './index'
import { create as __create__ } from 'silhouette-core'
import rxjsPlugin from 'silhouette-plugin-rxjs'


tap.test('silhouette tests', t => {
    let sil = create();
    t.true(sil); // 1
    sil.define({ a: 3, b: { c: 1, d: 4 }});
    t.true(sil.select('a')); // 2
    t.true(sil.select('b', 'c')); // 3
    sil.remove('b', 'c');
    t.same(sil.select('b', 'c').state, undefined); // 4
    t.true(sil.select('b', 'd')); // 5
    sil.select('b').define([10, 20, 30], 'c');
    t.true(sil.select('b', 'c', 0)); // 6
    let incra = 0;
    let incrb = 0;
    sil.select('b').extend('any', (s, a) => {
        incrb++;
        return s;
    });
    sil.select('a').extend('any', (s, a) => {
        incra++;
        return s;
    });
    sil.select('b').dispatch('any', { });
    t.equal(incrb, 1); // 7
    t.equal(incra, 1); // 8
    sil.select('b').dispatch('any', { });
    t.equal(incrb, 2); // 9
    t.equal(incra, 2); // 10 

    t.end();
});





tap.test('silhouette tests', t => {

    let sil = create();

    sil.define({view: {}});

    sil.select('view').define({ a: [{v: 1}]});

    let c = 0;

    // console.log('STATE', sil.select('view', 'a', 0, 'v').state);
    sil.select('view', 'a', 0, 'v').asObservable().subscribe(v => c = v);
    t.equal(c, 1);
    // console.log('STATE', sil.select('view', 'a', 0).state);
    sil.select('view', 'a', 0).asObservable().subscribe(v => c = v);
    t.true(c instanceof Object);
    sil.select('view', 'a').asObservable().subscribe(v => c = v);
    t.true(c instanceof Array);
    sil.select('view').asObservable().subscribe(v => c = v);
    t.true(c instanceof Object);
    sil.asObservable().subscribe(v => c = v);
    t.true(c instanceof Object);

    t.end();

});
