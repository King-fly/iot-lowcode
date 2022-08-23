import {
    Utils,
    Emitter,
    Log
} from '@d/shared/src/utils';

type PageOptions = {
    name: string;
    selected?: boolean;
    homePage?: boolean;
    bgColor?: string;
    bgImg?: string;
    width?: string;
    height?: string;
    id?: string;
}

type PageItem = {
    id: string;
    homePage?: boolean;
    selected?: boolean;
    setSelected: () => void;
}

class Page {
    static genUUID() {
        return Utils.genUUID.call(this);
    }
    public name: string;
    public selected: boolean;
    public homePage: boolean;
    public bgColor: string;
    public bgImg: string;
    public width?: string;
    public height?: string;
    public id?: string;

    constructor(options: PageOptions = {name: ''}) {
        this.name = options.name;
        this.selected = options.selected ?? false;
        this.homePage = options.homePage ?? false;
        this.bgColor = options.bgColor ?? '#FFFFFF';
        this.bgImg = options.bgImg ?? '';
        this.width = options.width;
        this.height = options.height;
        this.init(options?.id);
    }
    init(id?: string) {
        this.id = id ?? `page_${Page.genUUID()}`;
    }
    static create(options: PageOptions) {
        return new this(options);
    }
    setSelected() {
        this.selected = true;
        return this;
    }
    setPageName(name: string) {
        this.name = name;
        return this;
    }
    setHomePage() {
        this.homePage = true;
        return this
    }
}

class PageManager {

    static PageEventManager = Emitter.create();

    static pageInstance: object;

    static getInstance(...args: [any?]): any {
        if (!this.pageInstance) {
            this.pageInstance = PageManager.create(...args)
        }
        return this.pageInstance;
    }
    static create(...args: [any]) {
        return new this(...args)
    }
    public pageList: PageItem[];
    public eventManager: {
        on: any;
        trigger: any;
    };

    constructor(pageList: [PageItem]) {
        this.pageList = pageList || [];

        this.eventManager = PageManager.PageEventManager;

        this.eventInit();
    }
    eventInit() {
        this.eventManager.on('page:pageListInit', this.pageListInit.bind(this));
        this.eventManager.on('page:pageSelect', this.pageSelect.bind(this));
        this.eventManager.on('page:updatePage', this.updatePage.bind(this));
        this.eventManager.on('page:addNewPage', this.addNewPage.bind(this));
    }
    updatePage({data}: {data: {
        id: string;
        value: boolean;
        key: string;
    }}) {
        Log.debug('page manager', 'update page', data);
        const page: any = this.pageList.find(({id}) => id === data.id);
        if (data.key === 'homePage' && data.value === true) {
            this.pageList.forEach(page => (page.homePage = false));
        }
        page[data.key] = data.value;

        data.key === 'bgColor' && this.eventManager.trigger({
            type: 'workerspace:spaceStyle',
            data: page
        });
    }
    pageSelect({data}: {data: {
        id: string
    }}) {
        Log.debug('page manager', 'page select', data);
        const page = this.pageList.find(({id}) => id === data.id);
        this.pageList.forEach(page => (page.selected = false));
        page?.setSelected();
        this.eventManager
            .trigger({
                type: 'right-panel:updatePageConfig',
                data: page
            })
            .trigger({
                type: 'workerspace:spaceStyle',
                data: page
            });
    }
    pageListInit() {
        Log.debug('page manager', 'page list init', this.pageList);
        this.eventManager.trigger({
            type: 'page:pageListRender',
            data: this.pageList
        });
    }
    addNewPage({data} :{data: PageItem}) {
        Log.debug('page manager', 'add page', data);
        this.addPage(data);
    }
    addPage(page: PageItem) {
        this.pageList.push(page);
        return this;
    }
    delPage(page: {id: string}) {
        this.pageList = this.pageList.filter(({id}) => page.id !== id);
        return this;
    }
}

export {
    PageManager,
    Page
};
