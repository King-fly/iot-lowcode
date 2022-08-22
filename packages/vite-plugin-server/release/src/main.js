import {Render} from '../../../render/src';


class Application {
    static ROOT = '#app';

    static create(...args) {
        return new this(...args);
    }
    static loader() {
        this.create(this.ROOT);
    }
    constructor(root, options = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;

        this.init();
    }
    init() {
        this.fetchSchema(({page, compList}) => {
            this.initPage(page);
            this.renderPage(compList);
        });
    }
    renderPage(compList) {
        this.root.innerHTML = compList.map(comp => {
            const props = comp.compInfo.props;
            return `
            <div style="
                position: absolute;
                left: ${props['$x']}px;
                top: ${props['$y']}px;
                width:${props['$width']}px;
                height:${props['$height']}px;
                background-color:${props['backgroundColor']}
            "></div>`;
        }).join('');
    }
    initPage(data) {
        this.root.style = `
            position: relative;
            width: 1000px;
            height: 1000px;
            background-color: ${data.bgColor};
        `;
    }
    fetchSchema(callback) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        fetch(`/api/schemas?id=${params.page}`)
            .then(res => res.json())
            .then(data => {
                const {pageList, schema} = JSON.parse(data);
                const page = pageList.find(item => item.id === params.page);
                const {children} = Render.getInstance().fetchPageSchemaDSL(schema).transformer();
                callback({
                    page,
                    compList: children
                });
            });
    }
}



document.addEventListener('DOMContentLoaded', () => {
    Application.loader();
});