export default class Offcanvas {

    static ROOT = '[d-offcanvas]';

    static create(...args: [HTMLElement|string, object?]) {
        return new this(...args);
    }
    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll(this.ROOT).forEach((root: any) => {
                this.create(root);
            });
        }).bind(this));
    }
    public root: HTMLElement|null;
    public options: object|undefined;

    constructor(root: HTMLElement|string, options?: object) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
    }
}