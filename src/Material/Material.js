const conf_default = {
    color: [1.0, 1.0, 1.0, 1.0]
}

export default class Material {
    constructor(props) {
        let conf = {
            ...conf_default,
            ...props
        }

        this.color = conf.color
    }
}
