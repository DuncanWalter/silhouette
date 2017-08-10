import rxjs from 'rxjs'

// non colliding instance props are important 
const __stream__ = Symbol('stream'); 

// middleware for plugging in rxjs- not to difficult, even with lazy BehaviorSubjects for performance
export function rxjsPlugin({ Silhouette, symbols }){
    let proto = Silhouette.prototype;
    
    // State changes result in push calls which are designed to
    // be hijacked for reactive purposes.
    let push = proto[symbols.__push__];
    proto[symbols.__push__] = function({ value, done }){
        push({ value, done });
        if(this[__stream__] instanceof rxjs.BehaviorSubject){
            if(done){
                this[__stream__].complete(); // TODO recursive!
                Object.keys(this).forEach(key => this[key][__push__]({ done }));
            } else {
                this[__stream__].next(value);
            }
        } else {
            this[__stream__] = value;
        }
    }

    // we need to add a method for accessing the streams as an outsider.
    // could also use defineProperty and get to make it fancy, but
    // I think that might cut against the grain of RXJS philosophy? Not sure.
    proto.observe = function(){
        if(!(this[__stream__] instanceof rxjs.BehaviorSubject)){
            this[__stream__] = new rxjs.BehaviorSubject(this[__stream__]);
        }

        return this[__stream__];
    }

}

// just for convenience
export default rxjsPlugin;