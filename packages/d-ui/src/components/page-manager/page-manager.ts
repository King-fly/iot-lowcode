import { Log } from '@d/shared/src';
import LayerManager from '../layer-manager';
import { PageManager as PageCtl, Page } from '@d/editor/src';
export default class PageManager {

    static ROOT = '[page-manager]';

    static pageEventManager = PageCtl.getInstance().eventManager;

    static create(...args) {
        return new this(...args);
    }

    static loader() {
        this.create(this.ROOT);
    }

    constructor(root, options = {}) {
        this.options = options;
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.addPageBtn = this.root.querySelector('[add-page]');
        this.eventInit()
            .init();
    }

    eventInit() {
        this.pageEventManager = PageManager.pageEventManager;
        this.addPageBtn.addEventListener('click', this.addPage.bind(this));
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
        this.root.addEventListener('click', (event => {
            const target = event.target;
            if (target.classList.contains('page-item')) {
                this.pageClick(target);
            }
        }).bind(this));
    }
    pageListRender(data) { 
        if (data.data.length === 0) return; 
        this.renderPageList(data)
            .pageClick();
    }
    pageClick(target) {
        const activePage = this.root.querySelector('.page-item.active');
        this.activePage(target || activePage)
            .switchPageConfig(target || activePage)
            .resetLayer();
    }
    activePage(target) {
        const pageList = this.root.querySelectorAll('.sub-content .page-item');
        this.pageEventManager.trigger({
            type: 'page:pageSelect',
            data: {
                id: target.getAttribute('page-id')
            }
        });
        pageList.forEach(page => page.classList.remove('active'));
        target.classList.add('active');
        return this;
    }
    switchPageConfig(target) {
        const tContent = target.textContent;
        const rightPanel = document.querySelector('[right-panel]');
        const customSettings = rightPanel.querySelector('.custom-settings');

        customSettings.querySelector('.settings-title .label').textContent = `${tContent}配置`;
        customSettings.style.display = 'block';
        document.querySelector('[props-interaction-panel]').style.display = 'none';
        return this;
    }
    resetLayer() {
        LayerManager.resetSelect.call({
            root: document.querySelector(LayerManager.ROOT)
        });
    }
    renderPageItem(page) {
        return `
            <div class="page-item ${page.selected ? 'active' : ''}" page-id=${page.id}>
                ${page.name}<div class="actions"><div class="icon edit"></div><div class="icon delete"></div></div>
            </div>
        `;
    }
    renderPageList({data}) {
        Log.debug('page manager', 'render page list', JSON.stringify(data));

        this.root.querySelector('[page-list]').innerHTML = data.map(
            page => this.renderPageItem(page)
        ).join('');
        return this;
    }
    addPage(event) {
        event.stopPropagation();

        const page = Page.create({
            name: '自定义页面',
            bgColor: '#FFFFFF'
        });
        const pageItem = document.createElement('div');
        pageItem.innerHTML = this.renderPageItem(page);
        this.root.querySelector('[page-list]').appendChild(pageItem);

        this.pageEventManager.trigger({
            type: 'page:addNewPage',
            data: page
        });
    }
}