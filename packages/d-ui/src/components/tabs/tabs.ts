export default class Tabs {

    static ROOT = '[role="d-tabs"]';

    static activeCls = 'active';

    static create(...args: [HTMLElement|string, object?]) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll(this.ROOT).forEach((root: any) => {
                this.create(root);
            });
        }));
    }

    public options: {activeIndex?: number};
    public element: HTMLElement|null;
    public navList: NodeListOf<Element>|undefined;
    public contentList: NodeListOf<Element>|undefined;

    constructor(root: HTMLElement|string, options?: object) {
        this.options = options || {};
        this.element = typeof root === 'string' ? document.querySelector(root) : root;
        this.navList = this.element?.querySelectorAll('[tabs-nav] .nav-item');
        this.contentList = this.element?.querySelectorAll('.tabs-content')
        
        this.navList?.forEach((nav, index) => nav.addEventListener('click', (this.navItemClick as any).bind(this, nav, index)));
        this.init(this.options?.activeIndex);
    }

    init(index = 0) {
        this.navList?.[index].classList.add(Tabs.activeCls);
        this.contentList?.[index].classList.add(Tabs.activeCls);
    }

    navItemClick(target: HTMLElement, index: number) {
        if (!target.classList.contains('nav-item')) return;
        this.navList?.forEach(item => item.classList.remove(Tabs.activeCls));
        this.contentList?.forEach(item => item.classList.remove(Tabs.activeCls));
        this.contentList?.[index].classList.add(Tabs.activeCls);
        target.classList.toggle(Tabs.activeCls);
    }
}
