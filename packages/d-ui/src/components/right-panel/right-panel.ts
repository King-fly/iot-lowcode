import {Application} from '../application';
import {
    PageManager as PageCtl
} from '@d/editor/src';
import CanvasEditorCtl from '@d/editor/src/editor-manager';
import { Log } from '@d/shared/src';
import UXEditing from '../ux-editing';
import StyleEditing from '../style-editing';
export default class RightPanel {

    static ROOT = '[right-panel]';

    static canvasEditorEventManager = CanvasEditorCtl.CanvasEditorEventManager;

    static pageEventManager = PageCtl.getInstance().eventManager;

    static create(...args) {
        return new this(...args);
    }

    static loader() {
        this.create(this.ROOT);
    }

    constructor(root, options) {

        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;

        this.renderPageConfig();
        this.renderPropsConfig();

        this.collapse = this.root.querySelector('.collapse');
        this.lockModeBtn = this.root.querySelector('.cons-m');

        this.pageConfig = this.root.querySelector('[page-config]');
        this.propsConfig = this.root.querySelector('[props-interaction-panel]');
        this.eventInit()
            .init();
    }
    eventInit() {
        this.canvasEditorEventManager = RightPanel.canvasEditorEventManager;
        this.pageEventManager = RightPanel.pageEventManager;

        this.canvasEditorEventManager.on('right-panel:updatePropsConfig', this.updatePropsConfig.bind(this));
        this.pageEventManager.on('right-panel:updatePageConfig', this.updatePageConfig.bind(this));
        return this;
    }
    init() {
        this.collapse.addEventListener('click', () => {
            this.collapse.closest('[right-panel]').classList.toggle('show');
            Application.rulerH.resize();
        });
        this.lockModeBtn.addEventListener('click', () => {
            this.lockModeBtn.classList.contains('lock')
                ? this.lockModeBtn.classList.replace('lock', 'unlock')
                : this.lockModeBtn.classList.replace('unlock', 'lock')
        });
        this.pageConfig.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', this.onChange.bind(this, input));
        });
        this.propsConfig.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', this.onPropsChange.bind(this, input));
        });
    }
    onChange(target) {
        let value = target.value;
        if (target.name === 'homePage') {
            value = target.checked;
        }
        this.pageEventManager.trigger({
            type: 'page:updatePage',
            data: {
                id: this.pageData.id,
                key: target.name,
                value
            }
        });
    }
    onPropsChange(target) {
        const data = {
            id: this.propsData.id,
            key: target.name,
            value: target.value
        };
        if ('$x,$y,$width,$height,$rotate'.includes(target.name)) {
            this.canvasEditorEventManager.trigger({
                type: 'workerspace:updateCompProp',
                data
            });
        }
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:updateProps',
            data
        });
        Log.debug('right panel', `props change ${JSON.stringify(data)}`)
    }
    updatePropsConfig({data}) {
        Log.debug('right panel', 'update props config', data);
        this.propsData = data;
        
        this.propsConfig.querySelector('input[name="$x"]').value = data.compInfo.props['$x'];
        this.propsConfig.querySelector('input[name="$y"]').value = data.compInfo.props['$y'];
        this.propsConfig.querySelector('input[name="$width"]').value = data.compInfo.props['$width'];
        this.propsConfig.querySelector('input[name="$height"]').value = data.compInfo.props['$height'];
        this.propsConfig.querySelector('input[name="$rotate"]').value = data.compInfo.props['$rotate'];
        this.propsConfig.querySelector('input[name="$name"]').value = data.compInfo.props['$name'];
    }

    updatePageConfig({data}) {
        Log.debug('right panel', 'update page config', data);
        this.pageData = data;
        const bgEl = this.root.querySelector('input[type="color"]');
        const homeEl = this.root.querySelector('input[type="checkbox"]');

        bgEl.value = data.bgColor;
        homeEl.checked = data.homePage;
    }

    renderPageConfig() {
        this.root.querySelector('[page-config]').innerHTML = `
            <div class="settings-title">
                <div class="label"></div>
            </div>
            <div class="settings-wrapper">
                <div class="settings-content">
                    <div class="settings-item" setter-input>
                        <div class="setter-prop">作为首页</div>
                        <div class="setter-val"><input type="checkbox" checked name="homePage"></div>
                    </div>
                    <div class="settings-item" setter-color>
                        <div class="setter-prop">背景颜色</div>
                        <div class="setter-val"><input type="color" name="bgColor"></div>
                    </div>
                    <div class="settings-item" setter-select-double-constraint>
                        <div class="setter-prop">页面分辨率</div>
                        <div class="setter-val">
                            <select name="" id="">
                                <option value="">自定义</option>
                                <option value="">1920 x 1080</option>
                            </select>
                        </div>
                        <div class="setter-prop"></div>
                        <div class="setter-val">
                            <div class="setter-constraint">
                                <div class="cons-l"><input type="text" value="1440"></div>
                                <div class="cons-m lock"></div>
                                <div class="cons-r"><input type="text" value="1080"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="settings-content">
                    <div class="settings-item" setter-image>
                        <div class="setter-prop">背景图像</div>
                        <div class="setter-val"></div>
                        <div class="setter-prop img">
                            <div class="thumbnail"></div>
                            <div class="img-action">
                                <div class="reset-btn">重置</div>
                                <div class="choose-btn">选择图片</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    renderPropsConfig() {
        this.root.querySelector('[props-interaction-panel]').innerHTML = `
            <div class="tabs-nav" tabs-nav>
                <div class="nav-item">样式</div>
                <div class="nav-item">交互</div>
            </div>
            <div class="tabs-content" tabs-content>
                <div style-editing></div>
            </div>
            <div class="tabs-content" tabs-content>
                <div ux-editing></div>
            </div>
        `;
        this.root
            .querySelector('[props-interaction-panel]')
            .querySelector('[style-editing]')
            .appendChild(StyleEditing.render())
        this.root
            .querySelector('[props-interaction-panel]')
            .querySelector('[ux-editing]')
            .appendChild(UXEditing.render());
        return this;
    }
}