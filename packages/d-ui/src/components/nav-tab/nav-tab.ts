export default class NavTab {

    static activeIndex = 0;

    static ROOT = '[role="d-nav-tab"]';

    static activeCls = 'active';

    static create(...args: [HTMLElement|string, object?]) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => this.create(this.ROOT)).bind(this));
    }

    public options: {activeIndex?: number};
    public element: HTMLElement|null;
    public navList: any;
    public contentList: any;

    constructor(root: HTMLElement|string, options?: object) {
        this.options = options || {};
        this.element = typeof root === 'string' ? document.querySelector(root) : root;
        this.navList = this.element?.querySelectorAll('[nav-tab="nav"] .nav-item');
        this.contentList = this.element?.querySelectorAll('.nav-content')
        this.navList.forEach((nav: HTMLElement, index: number) => nav.addEventListener('click', this.navItemClick.bind(this, nav, index)));
        this.init(this.options?.activeIndex);
    }
    init(activeIndex = NavTab.activeIndex) {
        this.navList?.[activeIndex].classList.add(NavTab.activeCls);
        this.contentList?.[activeIndex].classList.add(NavTab.activeCls);
    }
    navItemClick(target: HTMLElement, index: number) {
        if (!target.classList.contains('nav-item')) return;
        this.navList.forEach((item: HTMLElement) => item.classList.remove(NavTab.activeCls));
        this.contentList.forEach((item: HTMLElement) => item.classList.remove(NavTab.activeCls));
        this.contentList[index].classList.add(NavTab.activeCls);
        target.classList.toggle(NavTab.activeCls);
    }
}
