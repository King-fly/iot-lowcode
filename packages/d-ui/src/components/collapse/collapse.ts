export default class Collapse {

    public element: any;
    public options: object;

    static CLOSE_CLS = 'close';

    static ROOT = '[role="d-collapse"]';

    static create(...args: [string|Element, object?]) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll(this.ROOT).forEach(root => {
                this.create(root);
            });
        }).bind(this))
    }

    constructor(root: string|Element, options = {}) {
        this.element = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
        this.init();
    }
    init() {
        this.element?.addEventListener('click', (event: {target: any}) => {
            const target = event.target;
            const title = target.closest('[collapse-title]');
            if (title) {
                const content = this.element.querySelector('[collapse-content]');

                title.classList.toggle(Collapse.CLOSE_CLS);
                content.classList.toggle(Collapse.CLOSE_CLS);
            }
        }, false)
    }
}