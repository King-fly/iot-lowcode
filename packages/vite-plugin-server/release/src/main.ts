import {Render} from '@d/render/src';


class Application {
    static ROOT = '#app';

    static create(...args: [string]) {
        return new this(...args);
    }
    static loader() {
        this.create(this.ROOT);
    }
    public root: any;
    public options: object;

    constructor(root: string | Element, options = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;

        this.init();
    }
    init() {
        this.fetchSchema(({page, compList}: any) => {
            this.initPage(page);
            this.renderPage(compList);
        });
    }
    renderPage(compList: any) {
        this.root.innerHTML = compList.map((comp: any) => {
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
    initPage(data: {bgColor: string;}) {
        this.root.style = `
            position: relative;
            width: 1000px;
            height: 1000px;
            background-color: ${data.bgColor};
        `;
    }
    fetchSchema(callback: (_: any) => void) {
        const params: any = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop: string) => searchParams.get(prop),
        });
        fetch(`/api/schemas?id=${params.page}`)
            .then(res => res.json())
            .then(data => {
                const {pageList, schema}: {
                    pageList: {id: string;page: object}[];
                    schema: any;
                } = JSON.parse(data);
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