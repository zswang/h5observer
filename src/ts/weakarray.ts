// @see weakmap
class WeakArray {
    keys: object[]
    values: any[]

    constructor() {
        this.keys = []
        this.values = []
    }

    get(key: object) {
        let index = this.keys.indexOf(key)
        return this.values[index]
    }

    set(key: object, value: any) {
        let index = this.keys.indexOf(key)
        if (index < 0) {
            this.keys.push(key)
            this.values.push(value)
        } else {
            this.values[index] = value
        }
    }

    delete(key: object) {
        let index = this.keys.indexOf(key)
        if (index < 0) {
            return
        }
        this.keys.splice(index, 1)
        this.values.splice(index, 1)
    }
}
