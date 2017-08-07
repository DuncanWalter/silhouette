import tap from 'tap'
import optics from './optics/test'
import sil from './index'

tap.test('silhouette inject & remove tests', t => {
    t.true(sil);
    sil.inject({ a: 3, b: { c: 1, d: 4 }});
    t.true(sil.a);
    t.true(sil.b.c);
    sil.remove('b', 'c');
    t.same(sil.b.c, undefined);
    t.true(sil.b.d);
    sil.b.inject([10, 20, 30], 'c');
    t.true(sil.b.c[0]);
    let incra = 0;
    let incrb = 0;
    sil.b.extend((s, a) => {
        incrb++;
        return s;
    });
    sil.a.extend((s, a) => {
        incra++;
        return s;
    });
    sil.b.dispatch('something', { });
    t.equal(incrb, 1);
    t.equal(incra, 0);
    sil.b.dispatch('something', { }, true);
    t.equal(incrb, 2);
    t.equal(incra, 1);
    t.end();
});