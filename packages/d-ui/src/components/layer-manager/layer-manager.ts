import CanvasEditorCtl from '@d/editor/src/editor-manager';
import {
    Log
} from '@d/shared/src';
export default class LayerManager {

    static canvasEditorEventManager = CanvasEditorCtl.CanvasEditorEventManager;

    static ROOT = '[layer-manager]';

    static create(...args: [Element|string]) {
        return new this(...args);
    }

    static loader() {
        return this.create(this.ROOT);
    }
    
    public static root: Element;

    static resetSelect() {
        this.root
            .querySelectorAll('.selected')
            .forEach((item: Element) => item.classList.remove('selected'));
    }

    public root: any;
    public options: object;
    public canvasEditorEventManager: any;

    constructor(root: Element|string, options = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
        this.eventInit()
            .init();
    }
    eventInit() {
        this.canvasEditorEventManager = LayerManager.canvasEditorEventManager;
        this.canvasEditorEventManager.on('layerManager:layerPanelRender', this.layerPanelRender.bind(this));
        this.canvasEditorEventManager.on('layerManager:addLayer', this.addLayer.bind(this));
        this.canvasEditorEventManager.on('layerManager:updateLayerName', this.updateLayerName.bind(this));
        this.canvasEditorEventManager.on('layerManager:selectLayer', this.selectLayer.bind(this));
        return this;
    }
    selectLayer({data}: {data: object}) {
        Log.debug('layerManager', 'select layer', data);
        this
            .layerSelect(this.root.querySelector(`[layer-id="${data}"]`))
            .rightPanelUpdateProsConfig(CanvasEditorCtl.getInstance().selectById(data))
    }
    addLayer({data}: {
        data: {
            compType: string;
            id: string;
        }
    }) {
        Log.debug('layerManager', `add ${data.compType} layer`, data);
        this.root.querySelectorAll('.layer-item').forEach((layer: Element) => layer.classList.remove('selected'));
        this.root.appendChild(this.createLayer(data));
        this.selectPostHandler(data);
    }
    layerPanelRender({data}: {data: any[]}) {
        Log.debug('layerManager', 'layer panel render', data);
        this.root.innerHTML = data.reduce((cur, prev) => {
            cur.push(this.renderLayer(prev));
            return cur;
        }, []).join('');
    }
    init() {
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:layerPanelReady'
        });
        this.root.addEventListener('click', this.groupToggle.bind(this), false);
    }
    layerSelect(target: Element, cb = (_?: any) => {}) {
        const groupEl = target.closest('.group');
        const layerEl = target.closest('.layer-item');

        if (groupEl && target.closest('.group-title')) {
            LayerManager.resetSelect.call(this);
            groupEl.classList.toggle('selected');
            cb()
        }
        if (!groupEl && layerEl) {
            LayerManager.resetSelect.call(this);
            layerEl.classList.toggle('selected');
            cb(CanvasEditorCtl.getInstance().selectById(layerEl.getAttribute('layer-id')));
        }
        return this;
    }
    updateLayerName({data}: {
        data: {
            id: string;
            value: string;
        }
    }) {
        Log.debug('layer manager', 'update layer name', data);
        this.root.querySelector(`[layer-id=${data.id}]`).querySelector('.pre .a.l').textContent = data.value;
    }
    selectPostHandler(data: object) {
        return this
            .rightPanelUpdateProsConfig(data)
            .workerSpaceSelectLayer(data);
    }
    rightPanelUpdateProsConfig(data: object) {
        (document.querySelector('.custom-settings') as any).style.display = 'none';
        (document.querySelector('[props-interaction-panel]') as any).style.display = 'block';
        this.canvasEditorEventManager
            .trigger({
                type: 'right-panel:updatePropsConfig',
                data
            })
            .trigger({
                type: 'ux-exditing:updateUXConfig',
                data
            });
        return this;
    }
    workerSpaceSelectLayer(data: object) {
        this.canvasEditorEventManager.trigger({
            type: 'workerspace:selectLayer',
            data
        });
        return this;
    }
    groupToggle(event: {target: Element;}) {
        const target = event.target;
        this.layerSelect(target, this.selectPostHandler.bind(this));
        if (target.classList.contains('icon')) {
            target.closest('.group')?.classList.toggle('close');
        }
        if (/lock|unlock/.test(target.classList.value)) {
            target.classList.contains('lock')
                ? target.classList.replace('lock', 'unlock')
                : target.classList.replace('unlock', 'lock');
        }
        if (/eye|noeye/.test(target.classList.value)) {
            target.classList.contains('eye')
                ? target.classList.replace('eye', 'noeye')
                : target.classList.replace('noeye', 'eye');
        }
    }
    createLayer(comp: {
        id: string;
        compType: string;
    }) {
        const frag = document.createDocumentFragment();
        const layer = document.createElement('div');
        layer.classList.add('layer-item');
        layer.setAttribute('layer-id', comp.id);
        layer.classList.add('selected');
        layer.innerHTML = `
        <div class="content-wrapper">
            <div class="pre">
                <div class="a ${comp.compType}"></div>
                <div class="a l">${comp.compType}</div>
            </div>
            <div class="post">
                <div class="a unlock"></div>
                <div class="a eye"></div>
            </div>
        </div>
        `;
        frag.appendChild(layer);
        return frag;
    }
    renderLayer(comp: {
        id: string;
        compType: string;
    }) {
        if (comp.compType === 'group') {
            return `
            <div class="layer-item group">
                <div class="group-title">
                    <div class="icon">&lt;</div>
                    <div class="content-wrapper">
                        <div class="pre">
                            <div class="a folder"></div>
                            <div class="a l">组合1</div>
                        </div>
                        <div class="post">
                            <div class="a unlock"></div>
                            <div class="a eye"></div>
                        </div>
                    </div>
                </div>
                <div class="group-content">
                    <div class="layer-item">
                        <div class="content-wrapper">
                            <div class="pre">
                                <div class="a text"></div>
                                <div class="a l">文本</div>
                            </div>
                            <div class="post">
                                <div class="a unlock"></div>
                                <div class="a eye"></div>
                            </div>
                        </div>
                    </div>
                    <div class="layer-item">
                        <div class="content-wrapper">
                            <div class="pre">
                                <div class="a image"></div>
                                <div class="a l">图片</div>
                            </div>
                            <div class="post">
                                <div class="a unlock"></div>
                                <div class="a eye"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        return `
        <div class="layer-item" layer-id=${comp.id}>
            <div class="content-wrapper">
                <div class="pre">
                    <div class="a ${comp.compType}"></div>
                    <div class="a l">${comp.compType}</div>
                </div>
                <div class="post">
                    <div class="a unlock"></div>
                    <div class="a eye"></div>
                </div>
            </div>
        </div>
        `;
    }
}
