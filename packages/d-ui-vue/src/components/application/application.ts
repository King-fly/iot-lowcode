import {createApp, h} from 'vue';
import { createComponent } from '../../utils';
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';
import PreLoading from '../pre-loading';

import '../workerspace';
import '../collapse';

import Toolsbar from '../tools-bar';
import RightPanel from '../right-panel';
import WorkerSpace from '../workerspace';
import LeftPanel from '../left-panel';

const AppComp = createComponent({
    name: 'application-box',
    setup() {
        return () => {
            return h('div', {
                class: 'application'
            }, [
                h(Toolsbar),
                h('div', {
                    class: 'box'
                }, [
                    h(LeftPanel, {
                        navClsList: ['page', 'component', 'source', 'global']
                    }),
                    h(WorkerSpace),
                    h(RightPanel)
                ])
            ])
        };
    }
});

declare global {
    interface Window {
        Ruler: any
    }
}

export default class Application {

    public static rulerH: {resize: () => void};
    public static rulerV: {resize: () => void};

    static preProcess() {
        PreLoading.loader();
        return this;
    }
    static postProcess() {
        window.addEventListener('load', () => {
            PreLoading.unloader();
            window.dispatchEvent(new Event('resize'));
            Application.rulerInit();
        });
        return this;
    }
    static vueLoader() {
        const app = createApp(AppComp);

        app.use(ElementPlus);

        app.mount('#app');
        return this;
    }

    static rulerInit() {

        this.rulerH = new window.Ruler(document.querySelector('.ruler-horizontal'), {
            type: 'horizontal',
            backgroundColor: '#dedede',
            textColor: 'black'
        });

        this.rulerV = new window.Ruler(document.querySelector('.ruler-vertical'), {
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
    static loader() {
        this.preProcess()
            .vueLoader()
            .postProcess();
    }
}