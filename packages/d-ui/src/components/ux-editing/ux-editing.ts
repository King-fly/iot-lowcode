import CanvasEditorCtl from '@d/editor/src/editor-manager';
import { Interaction, Action } from '@d/render/src';
import { Log } from '@d/shared/src';
import { DataSourceManager } from '@d/render/src';
import Modal from '../modal';

export default class UXEditing {

    static configGlobalModal = Modal.create(null, {
        title: '赋值给页面变量',
        slots: {
            body: `
            <div macro-settings-modal>
                <div class="content-wrap"></div>
                <div class="btn">+ 赋值</div>
            </div>
            `
        },
        actions: {
            init(root: HTMLElement) {
                this.contentWrap = root.querySelector('.content-wrap');
                root.addEventListener('click', ((event: any) => {
                    const target = event.target;
                    const delElement = target.closest('.del-btn');
                    const configBtn = target.closest('.btn');
                    delElement && this.delField.call(this, delElement);
                    configBtn && this.setConfig.call(this, configBtn);
                }).bind(this));
            },
            render() {
                this.contentWrap.innerHTML = this.template();
            },
            template() {
                const fieldList: any = this.data.options.globals?.length && this.data.options.globals.map((global: {globalKey: string;staticValue: string;}) => {
                    return `
                    <div class="field">
                        <div class="name">
                            <select name="globalKey">
                                ${this.makeOptions(global.globalKey)}
                            </select>
                        </div>
                        <div class="value">
                            <input name="staticValue" value="${global.staticValue}"/>
                        </div>
                        <div class="desc">--</div>
                        <div class="action"><div class="del-btn">删除</div></div>
                    </div>
                    `;
                }).join('');
                return `
                <div class="field">
                    <div class="name">页面变量名</div>
                    <div class="value">页面变量值</div>
                    <div class="desc">说明</div>
                    <div class="action">操作</div>
                </div>
                ${fieldList ?? ''}
                `;
            },
            makeOptions(value?: any) {
                const srcList = DataSourceManager
                    .getInstance().dataSourceList
                    .filter((source: {type: string;}) => source.type === 'global');
                return srcList.map((src: {id: string;options: {name: string;}}) => {
                    return `<option value="${src.id}" ${value === src.id ? 'selected' : ''}>${src.options.name}</option>`
                }).join('');
            },
            makeFiled() {
                const frag = document.createDocumentFragment();
                const div = document.createElement('div');
                
                div.innerHTML = `
                <div class="field">
                    <div class="name">
                        <select name="globalKey">
                            ${this.makeOptions()}
                        </select>
                    </div>
                    <div class="value">
                        <input name="staticValue"/>
                    </div>
                    <div class="desc">--</div>
                    <div class="action"><div class="del-btn">删除</div></div>
                </div>
                `.trim();
                frag.append(div.firstChild as HTMLElement);
                return frag;
            },
            setConfig(_?: any) {
                this.contentWrap.appendChild(this.makeFiled());
            },
            delField(elem: HTMLElement) {
                (elem.closest('.field') as HTMLElement).remove();
            },
            ok(root: HTMLElement) {
                const [, ...globals] = [...root.querySelectorAll('[macro-settings-modal] .field')].map(elem => [...elem.querySelectorAll('select,input')].map((item: any) => item.value));
                this.data.options.globals = globals.map(global => ({
                    staticValue: global[1],
                    globalKey: global[0]
                }));
                this.postProcess(this.data);
            }
        } as any
    })

    static TRIGGER_LIST = [
        {
            name: '点击',
            value: 'click',
            selected: false
        },
        {
            name: '双击',
            value: 'doubleClick',
            selected: false
        },
        {
            name: '鼠标移入',
            value: 'mouseEnter',
            selected: false
        },
        {
            name: '鼠标移出',
            value: 'mouseLeave',
            selected: false
        }
    ];

    static ACTION_LIST = [
        {
            name: '刷新组件',
            value: 'refreshComponent',
            selected: false
        },
        {
            name: '展示隐藏',
            value: 'showHide',
            selected: false
        },
        {
            name: '赋值给页面变量',
            value: 'setGlobal',
            selected: false
        }
    ];


    static ROOT = '[ux-editing]';

    static canvasEditorEventManager: any = CanvasEditorCtl.CanvasEditorEventManager;

    static create(...args: [HTMLElement|null|string, object?]) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            this.create(this.ROOT);
        }).bind(this));
    }

    public root: HTMLElement|null;
    public options?: object;

    constructor(root: HTMLElement|string|null, options?: object) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;

        this.eventInit()
            .init();
    }
    public canvasEditorEventManager: any;
    eventInit() {
        this.canvasEditorEventManager = UXEditing.canvasEditorEventManager;
        this.canvasEditorEventManager.on('ux-exditing:updateUXConfig', this.updateUXConfig.bind(this));
        return this;
    }
    public compData: any;
    updateUXConfig({data}: any) {
        Log.debug('ux-editing', 'update UX config', data);
        this.compData = data;
        (this.root?.querySelector('.rea-wrapper') as HTMLElement).innerHTML = '';
        const interactions = data.compInfo?.interactions ?? [];
        interactions.forEach((interaction: any) => {
            this.makeTrigger(interaction, frag => {
                const actions = interaction?.actions ?? [];
                actions.forEach((action: any) => {
                    this.makeAction(frag.querySelector('.action-content'), action);
                });
            });
        });
    }
    init() {
        this.root?.addEventListener('click', ((event: any) => {
            const target = event.target;
            const eventList = [
                {
                    selector: '[pane-switch]',
                    handler: this.togglePane.bind(this, target)
                },
                {
                    selector: '[del-event]',
                    handler: this.delEvent.bind(this, target)
                },
                {
                    selector: '[add-action]',
                    handler: this.addAction.bind(this, target, this.makeAction.bind(this))
                },
                {
                    selector: '[add-event]',
                    handler: this.addTrigger.bind(this, this.makeTrigger.bind(this))
                },
                {
                    selector: '[del-action]',
                    handler: this.delAction.bind(this, target)
                },
                {
                    selector: '[config-global]',
                    handler: this.configGlobal.bind(this, target)
                }
            ];
            for (const btnEvent of eventList) {
                target.closest(btnEvent.selector) && btnEvent.handler.call(this);
            }
        }).bind(this));
    }
    getAction(triggerId: string, actionId: string) {
        return this.compData.compInfo.interactions
            .find((trigger: {id: string;}) => trigger.id === triggerId).actions
            .find((action: {id: string;}) => action.id === actionId);
    }
    configGlobal(target: any) {
        Log.debug('ux-editing', 'configGlobal');

        const action = this.getAction(
            target.closest('.rea-container').getAttribute('trigger-id'),
            target.closest('.action-item').getAttribute('action-id')
        );
        UXEditing.configGlobalModal.show((_, options: any) => {
            options.actions.data = action;
            options.actions.render();
            options.actions.postProcess = (data: any) => {
                target.closest('.event-content').querySelector('.globals-list').innerHTML = this.renderGlobalsList(data);
            };
        });
    }
    delAction(target: HTMLElement) {
        Log.debug('ux-editing', 'del action');
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:deleteAction',
            data: {
                compId: this.compData.id,
                actionId: (target.closest('.action-item') as HTMLElement).getAttribute('action-id'),
                triggerId: (target.closest('.rea-container') as HTMLElement).getAttribute('trigger-id')
            }
        });
        (target.closest('.action-item') as HTMLElement).remove?.();
    }

    togglePane(target: HTMLElement) {
        (target?.closest('.rea-container') as HTMLElement).classList.toggle('close');
    }

    delEvent(target: HTMLElement) {
        Log.debug('ux-editing', 'del event', target);
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:deleteTrigger',
            data: {
                compId: this.compData.id,
                triggerId: (target?.closest('.rea-container') as HTMLElement).getAttribute('trigger-id')
            }
        });
        (target?.closest('.rea-container') as HTMLElement).remove?.();
    }

    makeTrigger(target: HTMLElement, cb = (_?: any): void => {}) {
        const wrapper: any = this.root?.querySelector('.rea-wrapper');
        const frag = this.renderEvent(target);
        cb(frag.firstElementChild);
        wrapper.appendChild(frag);
        return this;
    }
    makeAction(target: any, data: any) {
        const actionList = target
            .closest('.action-content')
            .querySelector('.action-list');

        actionList.appendChild(this.renderAction(data, wrapper => this.initAction(wrapper, data)));
        return this; 
    }

    addTrigger(cb = (_?: any) => {}) {
        Log.debug('ux-editing', 'add event');
        const trigger = Interaction.create({
            trigger: UXEditing.TRIGGER_LIST[0].value
        } as any);
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:addTrigger',
            data: {
                compId: this.compData.id,
                trigger 
            }
        });
        cb(trigger);
    }

    addAction(target: HTMLElement, cb = (_?: any, s?:any) => {}) {
        Log.debug('ux-editing', 'add action');
        const action = Action.create({
            type: UXEditing.ACTION_LIST[0].value,
            options: {}
        } as any);
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:addAction',
            data: {
                compId: this.compData.id,
                triggerId: (target.closest('.rea-container') as HTMLElement).getAttribute('trigger-id'),
                action
            }
        });
        cb(target, action);
    }

    renderActionContent(data: any) {
        return UXEditing.ACTION_LIST
            .reduce((prev: any, cur) => {
                cur.selected = cur.value === data?.type;
                prev.push(cur);
                return prev;
            }, [])
            .map((action: any) => `
                <option
                    ${action.selected ? 'selected' : ''}
                    value="${action.value}">
                    ${action.name}
                </option>
            `).join('');
    }

    renderCompList(data: any, type: string) {
        return CanvasEditorCtl
            .getInstance().layerManager.layerList
            .map((layer: any) => `
                <option
                    ${data.options[type] === layer.id ? 'selected' : ''}
                    value="${layer.id}">
                    ${layer.compInfo.props['$name']}
                </option>
            `).join('');
    }

    initAction(wrapper: HTMLElement, data: object) {
        const action: HTMLElement|null = wrapper.querySelector('select[name="action"]')
        
        action?.addEventListener('change', this.onOptionChange.bind(this, {
            element: action,
            data,
            callback: this.switchActionContent.bind(this, wrapper)
        }));

        const prop = (wrapper?.querySelector('select[name="action"]') as HTMLInputElement).value;
        (wrapper
            .querySelector(`[content-type="${prop}"]`) as HTMLElement)?.style
            .setProperty('display', 'flex', 'important');

        wrapper
            .querySelectorAll('[name="componentIds"],[name="shows"],[name="hides"]')
            .forEach((comp: any) => {
                comp.addEventListener('change', this.onOptionChange.bind(this, {
                    element: comp,
                    data
                }));
            });
    }

    getGlobalKey(srcId: string) {
        const src = DataSourceManager.getInstance().queryById(srcId);
        return src?.options?.name ?? '';
    }

    renderGlobalsList(data: any) {
        if (data.type !== 'setGlobal' || !data.options.globals) return '';
        const globalsContent = data.options.globals.map((global: {globalKey: string;staticValue: string;}) => {
                return `
                <div class="global-item">
                    <div class="key">${this.getGlobalKey(global.globalKey)}</div><div class="val">${global.staticValue}</div>
                </div>
                `
            }).join('');
        return `
            <div class="global-item">
                <div class="key">页面变量名</div>
                <div class="val">页面变量值</div>
            </div>
            ${globalsContent ?? ''}
        `;
    }

    renderAction(data: any, callback = (_?:any, s?: any) => {}) {
        const frag = document.createDocumentFragment();
        const wrapper = document.createElement('div');
        wrapper.classList.add('action-item');
        wrapper.setAttribute('action-id', data?.id);
        wrapper.innerHTML = `
            <div class="event-content">
                <div class="event-key"><div del-action class="icon"></div>动作</div>
                <div class="event-val">
                    <select name="action">
                        ${this.renderActionContent(data)}
                    </select>
                </div>
            </div>
            <div class="event-content" content-type="refreshComponent">
                <div class="event-key">选择组件</div>
                <div class="event-val">
                    <select name="componentIds">
                        <option value="">请选择</option>
                        ${this.renderCompList(data, 'componentIds')}
                    </select>
                </div>
            </div>
            <div class="event-content" content-type="showHide">
                <div class="event-key">点击出现</div>
                <div class="event-val">
                    <select name="shows">
                        <option value="">请选择</option>
                        ${this.renderCompList(data, 'shows')}
                    </select>
                </div>
                <div class="event-key">点击隐藏</div>
                <div class="event-val">
                    <select name="hides">
                        <option value="">请选择</option>
                        ${this.renderCompList(data, 'hides')}
                    </select>
                </div>
            </div>
            <div class="event-content" content-type="setGlobal">
                <div class="globals-list">    
                ${this.renderGlobalsList(data)}
                </div>
                <div class="default-btn" config-global>配置</div>
            </div>
        `;

        frag.appendChild(wrapper);
        callback(wrapper, data);
        return frag;
    }
    switchActionContent(wrapper: any) {
        const prop = wrapper.querySelector('select[name="action"]').value;

        wrapper
            .querySelectorAll('[content-type="refreshComponent"],[content-type="showHide"],[content-type="setGlobal"]')
            .forEach((content: HTMLElement) => content.style.setProperty('display', 'none', 'important'));
        wrapper
            .querySelector(`[content-type="${prop}"]`).style
            .setProperty('display', 'flex', 'important');
    }

    onOptionChange({element: ref, data, callback = () => {}}: any) {
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:updateTrigger',
            data: {
                value: ref.value,
                name: ref.name,
                ref: data,
                ext: Array.from(ref.closest('.action-item')
                        ?.querySelector(`[content-type="${ref.value}"]`)
                        ?.querySelectorAll('select') ?? [])
                            .reduce((prev: any, cur: any) => ({
                                ...prev,
                                [cur.name]: cur.value
                            }), {})
            }
        });
        callback.call(this);
    }
    renderTriggerContent(data: any) {
        return UXEditing.TRIGGER_LIST
            .reduce((prev: any, cur) => {
                cur.selected = cur.value === data?.trigger;
                prev.push(cur);
                return prev;
            }, [])
            .map((trigger: any) => `
                <option
                    ${trigger.selected ? 'selected' : ''}
                    value="${trigger.value}">
                    ${trigger.name}
                </option>
            `).join('');
    }

    renderEvent(data: any) {
        const frag = document.createDocumentFragment();
        const wrapper = document.createElement('div');
        wrapper.classList.add('rea-container');
        wrapper.setAttribute('trigger-id', data?.id);
        wrapper.innerHTML = `
            <div class="rea-title">
                <div class="icon" pane-switch>&gt;</div>
                <div class="title">交互</div>
                <div class="del-btn" del-event></div>
            </div>
            <div class="rea-content">
                <div class="interaction-item">
                    <div class="event-content">
                        <div class="event-key">事件</div>
                        <div class="event-val">
                            <select name="trigger">
                            ${this.renderTriggerContent(data)}
                            </select>
                        </div>
                    </div>
                    <div class="action-content">
                        <div class="action-list"></div>
                        <div class="txt-btn" add-action>子动作</div>
                    </div>
                </div>
            </div>
        `;
        const trigger = wrapper.querySelector('select[name="trigger"]')
        
        trigger?.addEventListener('change', this.onOptionChange.bind(this, {element: trigger, data}));

        frag.appendChild(wrapper);
        return frag;    
    }

    static render() {
        const frag = document.createDocumentFragment();
        const rea = document.createElement('div');
        rea.classList.add('rea-wrapper');
        const btn = document.createElement('div');
        btn.classList.add('default-btn');
        btn.setAttribute('add-event', '');
        btn.innerText = '新增交互';
        frag.appendChild(rea);
        frag.appendChild(btn);
        return frag;
    }
}
