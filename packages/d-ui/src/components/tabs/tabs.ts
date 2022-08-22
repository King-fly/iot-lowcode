export default class Tabs {

    static ROOT = '[role="d-tabs"]';

    static activeCls = 'active';

    static create(...args) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll(this.ROOT).forEach(root => {
                this.create(root);
            });
        }));
    }

    constructor(root, options) {
        this.options = options || {};
        this.element = typeof root === 'string' ? document.querySelector(root) : root;
        this.navList = this.element.querySelectorAll('[tabs-nav] .nav-item');
        this.contentList = this.element.querySelectorAll('.tabs-content')
        
        this.navList.forEach((nav, index) => nav.addEventListener('click', this.navItemClick.bind(this, nav, index)));
        this.init(this.options?.activeIndex);
    }

    init(index = 0) {
        this.navList?.[index].classList.add(Tabs.activeCls);
        this.contentList?.[index].classList.add(Tabs.activeCls);
    }

    navItemClick(target, index) {
        if (!target.classList.contains('nav-item')) return;
        this.navList.forEach(item => item.classList.remove(Tabs.activeCls));
        this.contentList.forEach(item => item.classList.remove(Tabs.activeCls));
        this.contentList[index].classList.add(Tabs.activeCls);
        target.classList.toggle(Tabs.activeCls);
    }
}
