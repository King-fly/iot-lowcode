import CanvasEditorCtl from '@d/editor/src/editor-manager';
import { DataSourceManager } from '@d/render/src';
type PageItem = {
    selected: boolean;
    id:string;
}
export default class Toosbar {

    static canvasEditorEventManager = CanvasEditorCtl.CanvasEditorEventManager;

    static ROOT = '[tools-bar]';

    static create(...args: [HTMLElement|string, object?]) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            this.create(this.ROOT);
        }).bind(this))
    }

    public root: HTMLElement|null;
    public options?: object;

    constructor(root:HTMLElement|string, options?: object) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
        this.init();
    }

    public canvasEditorEventManager: any;

    eventInit() {
        this.canvasEditorEventManager = Toosbar.canvasEditorEventManager;
        this.canvasEditorEventManager.on('tools-bar:autoSave', this.autoSave.bind(this))
    }

    autoSave() {
        this.savePageSchema()
        this.renderAutoSave();
        return this;
    }

    savePageSchema() {
        const editorCtl = CanvasEditorCtl.getInstance();
        const pageList: PageItem[] = editorCtl.pageManager.pageList;
        const dataSourceList = DataSourceManager.getInstance().dataSourceList;
        const page = pageList.find(page => page.selected === true);
        if (!page) return;
        const schema = {
            compType: 'page',
            id: page.id,
            dataSource: dataSourceList ?? [],
            filter: [],
            children: editorCtl.layerManager.layerList
        }
        window.localStorage.setItem('schema', JSON.stringify({
            schema,
            pageList
        }));
        return this;
    }

    public autoSaveEl: any;

    renderAutoSave() {
        this.autoSaveEl.innerHTML = `已自动保存 ${(new Date()).toLocaleTimeString()}`;
    }

    public saveBtn: HTMLElement|null|undefined;
    public previewBtn: HTMLElement|null|undefined;
    public releaseBtn: HTMLElement|null|undefined;

    init() {
        this.render();
        this.eventInit();

        this.autoSaveEl = this.root?.querySelector('.auto-save');
        this.saveBtn = this.root?.querySelector('.save-btn');
        this.previewBtn = this.root?.querySelector('.preview-btn');
        this.releaseBtn = this.root?.querySelector('.release-btn');

        this.saveBtn?.addEventListener('click', this.autoSave.bind(this));
        this.previewBtn?.addEventListener('click', this.preview.bind(this));
        this.releaseBtn?.addEventListener('click', this.preview.bind(this));
    }

    preview() {
        this.autoSave()
            .skipPreview();
    }

    skipPreview() {
        const page = CanvasEditorCtl
            .getInstance().pageManager.pageList
            .find((page:PageItem) => page.selected === true);
        const bodyData = {
            id: page.id,
            content: window.localStorage.getItem('schema')
        };
        fetch('http://127.0.0.1:5173/api/schemas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }).then(() => {
            window.open(`http://localhost:8089/release?page=${page.id}&t=${new Date().getTime()}`, '_blank');
        });
    }

    render() {
        (this.root as HTMLElement).innerHTML = `
            <div class="logo-info">天南星-中控系统</div>
            <div class="middle-operation">
                <div class="auto-save"></div>
                <div class="back"></div>
                <div class="forward"></div>
            </div>
            <div class="right-operation">
                <div class="save-btn"></div>
                <div class="preview-btn"></div>
                <div class="release-btn"></div>
            </div>
        `;
    }
}