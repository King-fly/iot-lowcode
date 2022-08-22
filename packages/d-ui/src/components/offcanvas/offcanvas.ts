export default class Offcanvas {

    static ROOT = '[d-offcanvas]';

    static create(...args) {
        return new this(...args);
    }
    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll(this.ROOT).forEach(root => {
                this.create(root);
            });
        }).bind(this));
    }
    constructor(root, options) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
    }
}