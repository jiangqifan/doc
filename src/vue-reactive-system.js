class Dep {
    constructor() {
        this.subs = []
    }
    addSub (sub) {
        this.subs.push(sub)
    }
    depend(){
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    notify () {
        for (let i = 0, l = this.subs.length; i < l; i++) {
          this.subs[i].run()
        }
    }
}

class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.deps = []
        this.key = key
        this.cb = cb
        this.value = this.get()
    }

    addDep(dep){
        this.deps.push(dep);
        dep.addSub(this);
    }
    get(){
        Dep.target = this;
        var value = this.vm[this.key];
        Dep.target = null;
        return value;
    }
    run () {
        const value = this.get()
        if (value !== this.value) {
            const oldValue = this.value
            this.value = value
            this.cb.call(this.vm, value, oldValue);
        }
    }
}

class Observer {
    constructor(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
}

function defineReactive(obj, key) {
    const dep = new Dep()
    var value = obj[key]

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            
            if (Dep.target) {
                dep.depend()
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            value =  newVal
            dep.notify()
        }
    })

}

var data = {
    a: 1,
    b: 2,
    c: 3,
}
new Observer(data)
new Watcher(data, 'a', function(value, oldValue){
    this.c = value + this.b;
})
data.a = 3
console.log(data.c == 5)

