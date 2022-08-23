import '../tools-bar';

import LayerManager from '../layer-manager';
import SrcManager from '../src-manager';
import PageManager from '../page-manager';
import UXEditing from '../ux-editing';
import LeftPanel from '../left-panel';
import RightPanel from '../right-panel';
import WorkerSpace from '../workerspace';
import Toosbar from '../tools-bar';

import DNavTab from '../nav-tab';
import DTabs from '../tabs';
import DCollapse from '../collapse';

export default class Application {
    public static rulerH: any;
    public static rulerV: any;

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
        this.loaderPanels()
            .loadPlugins()
            .postHandler();
    }
}
