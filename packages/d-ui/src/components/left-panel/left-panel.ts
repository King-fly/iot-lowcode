import { Application } from '../application';
import ComponentManager from '../component-manager/component-manager';
import MacroManager from '../macro-manager';

export default class LeftPanel {

    static ROOT = '[left-panel]';

    static create(...args: [Element|string, object?]) {
        return new this(...args);
    }

    static loader() {
        MacroManager.loader();
        ComponentManager.loader();

        this.create(this.ROOT);
    }

    public root: Element|string|null;
    public options?: object;
    public collapse: Element|null|undefined;

    constructor(root: Element|string, options?: object) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
        this.collapse = this.root?.querySelector('.collapse');
        this.init();
    }
    init() {
        this.collapse?.addEventListener('click', () => {
            (this.collapse as any).closest('[left-panel]').classList.toggle('show');
            Application.rulerH.resize();
        });
    }
}