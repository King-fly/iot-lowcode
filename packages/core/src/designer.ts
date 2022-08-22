import {Page} from '@d/editor/src/page-manager';
import {Render} from '@d/render/src/render';
import {D_ENV} from '@d/shared/src/constants';
import CanvasEditorManager from '@d/editor/src/editor-manager';
class PropsManager {
    static create(...args: []) {
        return new this(...args);
    }

    public setterList: any[];

    constructor() {
        this.setterList = [];
    }
    add(...setter: []) {
        this.setterList.push(...setter);
        return this;
    }
    queryById(id: string) {
        return this.setterList.find(({setterId}) => setterId === id);
    }
    generate() {
        return this.setterList.reduce((prev, cur) => ({
            ...prev,
            ...(cur.value())
        }), {});
    }
}

class Designer {

    public static canvasEditor: {layerManager: {layerList: object}};
    public static pageSchema: {children: object};

    // 页面强引用组件列表
    static get pageComponents() {
        const list = [
            {
                // 组件描述
                description: '',

                // 组件icon
                icon: '',

                // icon类型
                iconType: '',

                // 组件ID
                id: '',

                // 组件名称
                name: '',

                // 组件状态
                openStatus: true,

                // 组件截图
                screenshot: '',

                // 组件版本
                version: ''
            }
        ]
        return list;
    }

    static get PAGE_LIST() {
        const pageList = () => {
            const list = JSON.parse(window.localStorage.getItem('schema')??'{}')?.pageList || [];
            return list.map((page: {name: string}) => Page.create(page));
        };
        return D_ENV === 'dev' ? pageList() : [];
    }

    static get SCHEMA() {
        const schema = () => {
            const {schema = null} = JSON.parse(window.localStorage.getItem('schema')??'{}') || {};
            return schema;
        }
        return D_ENV === 'dev' ? schema() : null;
    }

    static start() {
        this.canvasEditor = CanvasEditorManager.getInstance(this.PAGE_LIST);
        this.pageSchema = Render.getInstance()
            .fetchPageSchemaDSL(this.SCHEMA)
            .transformer();

        this.canvasEditor.layerManager.layerList = this.pageSchema?.children || [];
    }
}

export {
    PropsManager,
    Designer
};
