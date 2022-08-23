import { Log } from '@d/shared/src';
import LayerManager from '../layer-manager';
import { PageManager as PageCtl, Page } from '@d/editor/src';
export default class PageManager {

    static ROOT = '[page-manager]';

    static pageEventManager: any = PageCtl.getInstance().eventManager;

    static create(...args: [HTMLElement|string, object?]) {
        return new this(...args);
    }

    static loader() {
        this.create(this.ROOT);
    }

    public options: object;
    public root: HTMLElement|null;
    public addPageBtn: HTMLElement|null|undefined;

    constructor(root: HTMLElement|string, options = {}) {
        this.options = options;
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.addPageBtn = this.root?.querySelector('[add-page]');
        this.eventInit()
            .init();
    }

    public pageEventManager: any;

    eventInit() {
        this.pageEventManager = PageManager.pageEventManager;
        (this.addPageBtn as any).addEventListener('click', this.addPage.bind(this));
        this.pageEventManager.on('page:pageListRender', this.pageListRender.bind(this));
        return this;
    }

    init() {
        this.pageEventManager.trigger({
            type: 'page:pageListInit'
        });
        this.bindPageClick();
    }
    bindPageClick() {
        this.root?.addEventListener('click', ((event: any) => {
            const target = event.target;
            if (target.classList.contains('page-item')) {
                this.pageClick(target);
            }
        }).bind(this));
    }
    pageListRender(data: {data:[]}) { 
        if (data.data.length === 0) return; 
        this.renderPageList(data)
            .pageClick();
    }
    pageClick(target: HTMLElement) {
        const activePage = this.root?.querySelector('.page-item.active');
        this.activePage(target || activePage)
            .switchPageConfig(target || activePage)
            .resetLayer();
    }
    activePage(target: HTMLElement) {
        const pageList = this.root?.querySelectorAll('.sub-content .page-item');
        this.pageEventManager.trigger({
            type: 'page:pageSelect',
            data: {
                id: target.getAttribute('page-id')
            }
        });
        pageList?.forEach(page => page.classList.remove('active'));
        target.classList.add('active');
        return this;
    }
    switchPageConfig(target: any) {
        const tContent = target.textContent;
        const rightPanel = document.querySelector('[right-panel]');
        const customSettings: any = rightPanel?.querySelector('.custom-settings');

        (customSettings?.querySelector('.settings-title .label') as HTMLElement).textContent = `${tContent}配置`;
        customSettings.style.display = 'block';
        (document.querySelector('[props-interaction-panel]') as HTMLElement).style.display = 'none';
        return this;
    }
    resetLayer() {
        LayerManager.resetSelect.call({
            root: document.querySelector(LayerManager.ROOT)
        });
    }
    renderPageItem(page: {
        selected: boolean;
        id: string;
        name:string;
    }) {
        return `
            <div class="page-item ${page.selected ? 'active' : ''}" page-id=${page.id}>
                ${page.name}<div class="actions"><div class="icon edit"></div><div class="icon delete"></div></div>
            </div>
        `;
    }
    renderPageList({data}: {data: any}): any {
        Log.debug('page manager', 'render page list', data);

        (this.root?.querySelector('[page-list]') as any).innerHTML = data.map(
            (page: any) => this.renderPageItem(page)
        ).join('');
        return this;
    }
    addPage(event: any) {
        event.stopPropagation();

        const page: any = Page.create({
            name: '自定义页面',
            bgColor: '#FFFFFF'
        });
        const pageItem = document.createElement('div');
        pageItem.innerHTML = this.renderPageItem(page);
        (this.root?.querySelector('[page-list]') as HTMLElement).appendChild(pageItem);

        this.pageEventManager.trigger({
            type: 'page:addNewPage',
            data: page
        });
    }
}