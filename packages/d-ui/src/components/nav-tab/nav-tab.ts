export default class NavTab {

    static activeIndex = 0;

    static ROOT = '[role="d-nav-tab"]';

    static activeCls = 'active';

    static create(...args) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => this.create(this.ROOT)).bind(this));
    }

    constructor(root, options) {
        this.options = options || {};
        this.element = typeof root === 'string' ? document.querySelector(root) : root;
        this.navList = this.element.querySelectorAll('[nav-tab="nav"] .nav-item');
        this.contentList = this.element.querySelectorAll('.nav-content')
        this.navList.forEach((nav, index) => nav.addEventListener('click', this.navItemClick.bind(this, nav, index)));
        this.init(this.options?.activeIndex);
    }
    init(activeIndex = NavTab.activeIndex) {
        this.navList?.[activeIndex].classList.add(NavTab.activeCls);
        this.contentList?.[activeIndex].classList.add(NavTab.activeCls);
    }
    navItemClick(target, index) {
        if (!target.classList.contains('nav-item')) return;
        this.navList.forEach(item => item.classList.remove(NavTab.activeCls));
        this.contentList.forEach(item => item.classList.remove(NavTab.activeCls));
        this.contentList[index].classList.add(NavTab.activeCls);
        target.classList.toggle(NavTab.activeCls);
    }
}
