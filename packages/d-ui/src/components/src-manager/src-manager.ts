export default class SrcManager {
    static ROOT = '[src-manager]';

    static create(...args) {
        return new this(...args);
    }

    static loader() {
        this.create(this.ROOT);
    }

    constructor(root, options = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
        this.init();
    }

    init() {
        this.root.addEventListener('click', event => {
            const target = event.target;
            if (target.classList.contains('sub-title')) {
                target.classList.toggle('close');
                target.closest('.sub-container').querySelector('.sub-content').classList.toggle('close')
            }
        })
    }
}