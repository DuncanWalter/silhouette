

// lens is a functional pseudo-constructor for making custom optics.
// Lenses are a subset of all optics which select and/or modify a single target
// without any inverse property. When composed with other optics, a custom
// lens' distort function provides data to subsequent lenses, while its correct 
// function provides the final output of the lens.
export function lens(distort, correct){
    return {
        exec(target, iterator){
            if(target === undefined){ return undefined; }
            let { done, value } = iterator ? iterator.next() : { done: true };
            if(done){
                return correct(target, distort(target));
            } else {
                return correct(target, value.exec(distort(target, iterator)));
            }
        }
    }
}

// compose converts a sequence of optics into a single optic. compose also
// supports several short-hands: numbers and strings will be converted to
// pluck lenses while nested arrays will be recursively composed.
export function compose(...optics){
    let lst = optics.map(l => {
        if(typeof l === 'string' || typeof l === 'number'){
            return pluck(l);
        } else if(l instanceof Array){
            return compose(...l);
        } else {
            return l;
        }
    });

    let itr = lst[Symbol.iterator]();
    itr.next();

    return {
        exec(o, i){
            return lst[0].exec(o, (function*(){
                yield* itr;
                if(i !== undefined){ yield* i; }
            })());
        }
    }
}

// pluck is a functional pseudo-constructor for perhaps the most common lens.
// pluck accepts either a string or a number to use as a member key. Subsequent lenses
// will view only the member specified by that key. The pluck lens itself supports
// efficient immutability, and will not mutate any inputs.
export let pluck = mem => lens(obj => obj[mem], (obj, val) => {
    if(obj[mem] === val){
        return obj;
    } else {
        let r = obj instanceof Array ? obj.map(i => i) : Object.assign({}, obj);
        if(typeof mem === 'number' && !obj instanceof Array){
            throw Error("The 'pluck' lens will not assign numeric member keys to non-Arrays");
        }
        if(typeof mem === 'string' && !obj instanceof Object){
            throw Error("The 'pluck' lens will not assign string member keys to non-Objects");
        }
        r[mem] = val;
        return r;
    }
});

// inject is a functional pseudo-constructor for the additive mutation lense.
// inject accepts either a string or a number to use as a member key and a value to insert. 
// The inject lens itself supports efficient immutability, and will not mutate any inputs.
export let inject = (prop, val) => lens(obj => obj, (obj, ret) => {
    if(val === ret[prop]){
        return obj;
    } else {
        let r = Object.assign({}, ret);
        r[prop] = val;
        return r;
    }
});

// remove is a functional pseudo-constructor for the negative mutation lense.
// remove accepts either a string or a number to use as a member key. 
// The remove lens itself supports efficient immutability, and will not mutate any inputs.
export let remove = prop => lens(obj => obj, (obj, ret) => {
    if(!prop in ret){
        return ret;
    } else {
        let r = Object.assign({}, ret);
        delete r[prop];
        return r;
    }
});

// where is a functional pseudo-constructor for optics which act as if blocks.
// where accepts a predicate function which returns a boolean flag. If the
// predicate run over an input returns false, no subsequent composed lenses will be used.
export let where = predicate => {
    return {
        exec(o, i){
            if(o === undefined){ return undefined; }
            let { done, value } = i ? i.next() : { done: true };
            if(done || !predicate(o)){
                return o;
            } else {
                return value.exec(o, i);
            }
        }
    }
}

export let each = () => {
    return {
        exec(o, i){
            if(o === undefined){ return undefined; }

            let lst = [], done, value;
            ({ done, value } = i ? i.next() : { done: true });
            while(!done){
                lst.push(value); 
                ({ done, value } = i.next());
            }

            let cont = o => {
                let itr = lst[Symbol.iterator]();
                let { done, value } = itr.next();
                return itr;
            }

            let r;
            if(o instanceof Object){
                r = Object.keys(o).reduce((a, k) => {
                    a[k] = cont(o[k])
                }, {});
                return Object.keys(r).reduce((a, k) => {
                    return r[k] === a[k] ? a : r;
                }, o);
            } else if(o instanceof Array){
                r = o.reduce((a, e, i) => {
                    a[i] = cont(e);
                }, []);
                return r.reduce((a, e, i) => {
                    return e === a[i] ? a : r;
                }, o);
            } else {
                throw Error("The 'each' optic expects targets of the type Object, Array, or undefined");
                return o;
            }
        }
    }
}