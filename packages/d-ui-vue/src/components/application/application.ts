import {createApp} from 'vue';
import { createComponent } from '../../utils';
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';

const AppComp = createComponent({
    name: 'application-box',
    template: `
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
    `
})

export default class Application {
    static loader() {
        const app = createApp(AppComp);

        app.use(ElementPlus);
        app.mount('#app');
    }
}