export default class SrcManager {
    static ROOT = '[src-manager]';

    static create(...args: [HTMLElement|string, object?]) {
        return new this(...args);
    }

    static loader() {
        this.create(this.ROOT);
    }

    public root: HTMLElement|null;
    public options: object;

    constructor(root: HTMLElement|string, options = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
        this.init();
    }

    init() {
        this.root?.addEventListener('click', (event: any) => {
            const target: HTMLElement = event.target;
            if (target.classList.contains('sub-title')) {
                target.classList.toggle('close');
                (target.closest('.sub-container')?.querySelector('.sub-content') as HTMLElement).classList.toggle('close')
            }
        })
    }
}