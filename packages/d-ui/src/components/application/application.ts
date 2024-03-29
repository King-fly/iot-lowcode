import '../tools-bar';

import LayerManager from '../layer-manager';
import SrcManager from '../src-manager';
import PageManager from '../page-manager';
import UXEditing from '../ux-editing';
import LeftPanel from '../left-panel';
import RightPanel from '../right-panel';
import WorkerSpace from '../workerspace';
import Toosbar from '../tools-bar';
import PreLoading from '../pre-loading';

import DNavTab from '../nav-tab';
import DTabs from '../tabs';
import DCollapse from '../collapse';

export default class Application {
    public static rulerH: any;
    public static rulerV: any;

    static render() {
        PreLoading.loader();
        (document.querySelector('#app') as HTMLElement).innerHTML = this.template();
        return this;
    }

    static template(_?: string): string {
        return `
        <div class="application">
            <div tools-bar></div>
            <div class="box">
                <div left-panel role="d-nav-tab" class="show">
                    <div class="collapse"><div class="mark"></div></div>
                    <div class="nav-v-wrapper" nav-tab="nav">
                        <div class="nav-item"><div class="i page"></div></div>
                        <div class="nav-item"><div class="i component"></div></div>
                        <div class="nav-item"><div class="i source"></div></div>
                        <div class="nav-item"><div class="i global"></div></div>
                    </div>
                    <div class="nav-v-container" nav-tab="content">
                        <div page-tabs-nav class="nav-content">
                            <div role="d-tabs">
                                <div class="tabs-nav" tabs-nav>
                                    <div class="nav-item">页面</div>
                                    <div class="nav-item">图层</div>
                                </div>
                                <div class="tabs-content" tabs-content>
                                    <div page-manager class="sub-container" role="d-collapse">
                                        <div class="sub-title" collapse-title>页面 <div add-page class="icon">+</div></div>
                                        <div class="sub-content" collapse-content page-list>
                                        </div>
                                    </div>
                                </div>
                                <div layer-manager class="tabs-content" tabs-content></div>
                            </div>
                        </div>
                        <div class="nav-content">
                            <div class="component-panel" component-manager>
                                <div class="component-nav" panel-title>组件</div>
                                <div class="component-content" panel-content component-list>
                                    <div class="sub-container" role="d-collapse">
                                        <div class="sub-title" collapse-title>常用</div>
                                        <div class="sub-content" collapse-content>
                                            <div class="comp-item" comp-name="text">
                                                <div class="icon"></div>
                                                <div class="info">文本</div>
                                            </div>
                                            <div class="comp-item" comp-name="image">
                                                <div class="icon"></div>
                                                <div class="info">图片</div>
                                            </div>
                                            <div class="comp-item" comp-name="button">
                                                <div class="icon"></div>
                                                <div class="info">按钮</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nav-content">
                            <div class="component-panel">
                                <div class="component-nav" panel-title>资源库 <div class="icon"></div>
                                </div>
                                <div src-manager class="component-content" panel-content>
                                    <div class="sub-container">
                                        <div class="sub-title">主题A - 按钮</div>
                                        <div class="sub-content">
                                            <div class="src-item">
                                                <div class="icon">默认</div>
                                                <div class="thumbnail"><img src="" alt=""></div>
                                                <div class="info">自定义</div>
                                            </div>
                                            <div class="src-item">
                                                <div class="icon">默认</div>
                                                <div class="thumbnail"><img src="" alt=""></div>
                                                <div class="info">自定义</div>
                                            </div>
                                            <div class="src-item">
                                                <div class="icon">默认</div>
                                                <div class="thumbnail"><img src="" alt=""></div>
                                                <div class="info">自定义</div>
                                            </div>
                                            <div class="src-item">
                                                <div class="icon">默认</div>
                                                <div class="thumbnail"><img src="" alt=""></div>
                                                <div class="info">自定义</div>
                                            </div>
                                            <div class="src-item">
                                                <div class="icon">默认</div>
                                                <div class="thumbnail"><img src="" alt=""></div>
                                                <div class="info">自定义</div>
                                            </div>
                                            <div class="src-item">
                                                <div class="icon">默认</div>
                                                <div class="thumbnail"><img src="" alt=""></div>
                                                <div class="info">自定义</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nav-content">
                            <div class="component-panel">
                                <div class="component-nav" panel-title>页面变量</div>
                                <div class="component-content" panel-content>
                                    <div macro-manager></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div workerspace>
                    <div class="worker-wrapper">
                        <div class="worker-container">
                            <div class="worker-content"></div>
                        </div>
                        <div class="rule-wrapper">
                            <div class="ruler-horizontal"></div>
                            <div class="ruler-vertical"></div>
                        </div>
                    </div>
                    <div class="worker-bar">
                        <div class="state-item">视图</div>
                        <div class="state-item"><input type="checkbox" checked><div class="label">标尺</div></div>
                        <div class="state-item"><input type="checkbox" checked><div class="label">参考线</div></div>
                        <div class="state-item"><input type="checkbox" checked><div class="label">网格</div></div>
                    </div>
                </div>
                <div right-panel props-tabs-nav class="show">
                    <div class="collapse"><div class="mark"></div></div>
                    <div class="prop-container-wrapper">
                        <div class="custom-settings" page-config></div>
                        <div role="d-tabs" props-interaction-panel></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    static rulerInit() {
        // @ts-ignore
        this.rulerH = new Ruler(document.querySelector('.ruler-horizontal'), {
            type: 'horizontal',
            backgroundColor: '#dedede',
            textColor: 'black'
        });

        // @ts-ignore
        this.rulerV = new Ruler(document.querySelector('.ruler-vertical'), {
            type: 'vertical',
            backgroundColor: '#dedede',
            textColor: 'black'
        });

        window.addEventListener('resize', this.rulerResize.bind(this));
    }
    static rulerResize() {
        this.rulerH.resize();
        this.rulerV.resize();
    }

    static loadPlugins() {
        [DCollapse, DNavTab, DTabs].forEach(plugin => plugin.loader());
        return this;
    }

    static loaderPanels() {
        [WorkerSpace, SrcManager, RightPanel, PageManager, LayerManager, UXEditing, LeftPanel, Toosbar]
            .forEach(manager => manager.loader());
        return this;
    }

    static postHandler() {
        window.addEventListener('load', () => {
            (document.querySelector('#app .application') as any).style.display = 'flex';
            document.querySelector('[loading-status]')?.remove();
            window.dispatchEvent(new Event('resize'));
        });
        return this;
    }

    static loader() {
        this.render()
            .loaderPanels()
            .loadPlugins()
            .postHandler();
    }
}
