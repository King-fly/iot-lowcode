import CanvasEditorCtl from '@d/editor/src/editor-manager';

export default class ComponentManager {

    static canvasEditorEventManager = CanvasEditorCtl.getInstance().eventManager;

    static ROOT = '[component-manager]';

    static create(...args) {
        return new this(...args);
    }

    static loader() {
        this.create(this.ROOT);
    }

    constructor(root, options = {}) {
        this.canvasEditorEventManager = ComponentManager.canvasEditorEventManager;
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.componentList = this.root.querySelector('[component-list]');
        this.options = options;
        this.init();
    }
    init() {
        this.componentList.addEventListener('click', this.onClickComponentList.bind(this))
    }
    onClickComponentList(event) {
        const target = event.target;
        if (target.closest('.comp-item')) {
            this.compItemClick(target.closest('.comp-item'));
        }
    }
    compItemClick(target) {
        const compName = target.getAttribute('comp-name');
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:addLayer',
            data: compName
        });
    }
}