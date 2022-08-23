import Modal from '../modal';
import { DataSourceManager } from '@d/render/src';
import { Log } from '@d/shared/src/utils';

export default class MacroManager {

    static dataSourceManager: any = DataSourceManager.getInstance();

    static macroEventManager = MacroManager.dataSourceManager.eventManager;

    static editModal = Modal.create(null, {
        title: '编辑页面变量',
        slots: {
            body: `
                <div macro-form>
                    <div class="field">
                        <div class="name">页面变量名</div>
                        <div class="value"><input name="name"/></div>
                    </div>
                    <div class="field">
                        <div class="name">默认值</div>
                        <div class="value"><input name="value"/></div>
                    </div>
                    <div class="field">
                        <div class="name">描述</div>
                        <div class="value"><textarea name="describe"></textarea></div>
                    </div>
                </div>
            `
        },
        actions: {
            ok(root: HTMLElement) {
                const {id} = root.dataset;
                MacroManager.macroEventManager.trigger({
                    type: 'macro:macroEdit',
                    data: ([...root.querySelectorAll('input[name="name"],input[name="value"],textarea[name="describe"]')])
                        .reduce((prev, cur: any) => ({
                            ...prev,
                            [cur.name]: cur.value
                        }), {
                            id
                        })
                });
            }
        }
    });

    static removeModal = Modal.create(null, {
        title: '请确认是否删除变量?',
        slots: {
            body: '删除后，所有赋值该页面变量的组件交互及引用该页面变量的数据源都会出现异常'
        },
        actions: {
            ok(root: HTMLElement) {
                MacroManager.macroEventManager.trigger({
                    type: 'macro:macroRemove',
                    data: root.dataset.id
                });
            }
        }
    });

    static addModal = Modal.create(null, {
        title: '新增页面变量',
        slots: {
            body: `
            <div macro-form>
                <div class="field">
                    <div class="name">页面变量名</div>
                    <div class="value"><input name="name"/></div>
                </div>
                <div class="field">
                    <div class="name">默认值</div>
                    <div class="value"><input name="value"/></div>
                </div>
                <div class="field">
                    <div class="name">描述</div>
                    <div class="value"><textarea name="describe"></textarea></div>
                </div>
            </div>
            `
        },
        actions: {
            ok(root: HTMLElement) {
                MacroManager.macroEventManager
                    .trigger({
                        type: 'macro:macroAdd',
                        data: [...root.querySelectorAll('input[name="name"],input[name="value"],textarea[name="describe"]')]
                            .reduce((prev, cur: any) => ({
                                ...prev,
                                [cur.name]: cur.value
                            }), {})
                    });
            }
        }
    });

    static ROOT = '[macro-manager]';

    static create(...args: [Element|string, object?]) {
        return new this(...args);
    }
    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            this.create(this.ROOT);
        }).bind(this));
    }

    public root: Element|string|null;
    public options: object;
    public data: {}

    constructor(root: Element|string, options = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
        this.data = {};

        this.eventInit()
            .init();
    }

    public macroEventManager: any;

    eventInit() {
        this.macroEventManager = MacroManager.macroEventManager;
        this.macroEventManager.on('macroManager:macroReady', this.macroReady.bind(this));
        return this;
    }

    public macroList: any;

    macroReady({data}: {data: any}) {
        Log.debug('macro-manager', 'macroReady', data);
        this.macroList = data;
        return this.render();
    }

    init() {
        this.macroEventManager.trigger({
            type: 'macro:macroListInit'
        });

        (this.root as HTMLElement).addEventListener('click', ((event: {target: any}) => {
            const target = event.target;
            const eventList = [
                {
                    cls: '.edit-btn',
                    event: this.edit
                },
                {
                    cls: '.del-btn',
                    event: this.remove
                },
                {
                    cls: '.add-macro-btn',
                    event: this.add
                }
            ];
            for (const btnEvent of eventList) {
                const elem = target.closest(btnEvent.cls);
                if (elem) {
                    btnEvent.event.call(this, elem);
                    break;
                }
            }
        }).bind(this))
    }

    edit(elem: HTMLElement) {
        const data: any = elem.closest('dd')?.dataset;
        MacroManager.editModal
            .show(root => {
                for (const field of root.querySelectorAll('input[name="name"],input[name="value"],textarea[name="describe"]')) {
                    field.value = data[field.name];
                    root.dataset[field.name] = data[field.name];
                }
                root.dataset.id = data.id;
            });
    }
    remove(elem: HTMLElement) {
        const {id}: any = elem.closest('dd')?.dataset;
        MacroManager.removeModal
            .show(root => {
                root.dataset.id = id;
            });
    }
    add() {
        MacroManager.addModal
            .show((root) => {
                for (const field of root.querySelectorAll('input[name="name"],input[name="value"],textarea[name="describe"]')) {
                    field.value = '';
                }
            });
    }

    template(_: any) {
        const macroList = this.macroList.map(({
            options: {
                name,
                value,
                describe
            },
            id
        }: any) => (`
                <dd data-id="${id}"
                    data-name="${name}"
                    data-describe="${describe}"
                    data-value="${value}">
                    <div class="name">${name}</div>
                    <div class="desc">${describe}</div>
                    <div class="dv">${value}</div>
                    <div class="action">
                        <div class="edit-btn">编辑</div>
                        <div class="del-btn">删除</div>
                    </div>
                </dd>
            `))
            .join('');
        return `
            <dl>
                <dt>
                    <div class="name">页面变量名</div>
                    <div class="desc">描述</div>
                    <div class="dv">默认值</div>
                    <div class="action">操作</div>
                </dt>
                ${macroList === '' ? '<dd>无页面变量设置</dd>' : macroList}
            </dl>
            <div class="add-macro-btn">新增页面变量</div>
        `;
    }
    render() {
        (this.root as any).innerHTML = this.template(this.data);
    }
}