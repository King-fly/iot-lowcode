import { Application } from '../application';
import { Log } from '@d/shared/src';
import {
    PageManager as PageCtl
} from '@d/editor/src';
import CanvasEditorCtl from '@d/editor/src/editor-manager';
import CompDraggable from '../comp-draggable/comp-draggable';

export default class WorkerSpace {

    static canvasEditorEventManager = CanvasEditorCtl.CanvasEditorEventManager;

    static pageEventManager = PageCtl.getInstance().eventManager;

    static ROOT = '[workerspace]';

    static loader() {
        Application.rulerInit();
        this.create(this.ROOT);
    }
    static create(...args: [HTMLElement|string, object?]) {
        return new this(...args);
    }

    public root: HTMLElement|null;
    public options: object;
    public scale: number;
    public MOVE_STATUS: string;
    public MOVE_FLAG: string;
    public CANVAS_POS: any;
    public canvasContainer: HTMLElement|null;
    public workerContent: HTMLElement|null;

    public canvasEditorEventManager: any;
    public pageEventManager: any;

    constructor(root: HTMLElement|string, options?: object) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options || {};
        this.scale = 0.5;

        this.MOVE_STATUS = 'DISABLE';
        this.MOVE_FLAG = ''
        this.CANVAS_POS = {};

        this.canvasContainer = document.querySelector('.worker-container');
        this.workerContent = document.querySelector('.worker-content');

        this.eventInit()
            .init();
    }
    eventInit() {
        this.canvasEditorEventManager = WorkerSpace.canvasEditorEventManager;
        this.canvasEditorEventManager.on('workerspace:canvasRender', this.canvasRender.bind(this));
        this.canvasEditorEventManager.on('workerspace:addComponent', this.addComponent.bind(this));
        this.canvasEditorEventManager.on('workerspace:updateCompProp', this.updateCompProp.bind(this));
        this.canvasEditorEventManager.on('workerspace:selectLayer', this.selectLayer.bind(this));

        this.pageEventManager = WorkerSpace.pageEventManager;
        this.pageEventManager.on('workerspace:spaceStyle', this.spaceStyle.bind(this));
        return this;
    }

    init() {
        document.addEventListener('keydown', this.moveKeydown.bind(this), false);
        document.addEventListener('keyup', this.moveKeyup.bind(this), false);

        this.workerContent?.addEventListener('mousedown', this.contentMousedown.bind(this), false);
        this.workerContent?.addEventListener('mousemove', this.contentMousemove.bind(this), false);
        this.workerContent?.addEventListener('mouseup', this.contentMouseup.bind(this), false);

        this.workerContent?.addEventListener('wheel', this.contentWheel.bind(this), { passive: false });

        window.addEventListener('wheel', this.disableWheel.bind(this), { passive: false });
        this.triggerWheelEvent();
        this.canvasEditorEventManager.trigger({
            type: 'canvasEditor:canvasReady'
        });

        this.workerContent?.addEventListener('click', this.selectComp.bind(this));
    }
    public compId: any;
    selectLayer({data}: any) {
        Log.debug('workerspace', 'select layer', data);
        this.compId = data.id;
        this.selectComp({
            target: this.workerContent?.querySelector(`[comp-id=${data.id}]`)
        });
    }
    selectComp(event: any) {
        const target = event.target.closest('.component');
        if (target) {
            this.compId = target.getAttribute('comp-id');
            this.workerContent?.querySelectorAll('.component').forEach(comp => comp.classList.remove('selected'));
            target.classList.add('selected');
            this.canvasEditorEventManager.trigger({
                type: 'layerManager:selectLayer',
                data: this.compId
            });
        }
    }

    getTranslatePos() {
        const [, x = 0, y = 0] = this.canvasContainer?.style.transform.match(/translate\((.*)px,(.*)px\)/) || [];
        return {
            x: +x,
            y: +y
        }
    }

    contentMousedown(event: any) {
        const {x: oX, y: oY} = this.getTranslatePos();
        this.CANVAS_POS.start = {
            x: event.pageX,
            y: event.pageY,
            oX,
            oY,
        };
        this.MOVE_STATUS = 'ENABLE';
    }

    contentMouseup() {
        this.MOVE_STATUS = 'DISABLE';
    }

    contentMousemove(event: any) {
        event.preventDefault();
        event.stopPropagation();
        if (this.MOVE_FLAG !== 'SPACE') return;
        if (this.MOVE_STATUS !== 'ENABLE') return;
        this.CANVAS_POS.end = {
            x: event.pageX,
            y: event.pageY
        }
        const x = event.pageX - this.CANVAS_POS.start.x + this.CANVAS_POS.start.oX;
        const y = event.pageY - this.CANVAS_POS.start.y + this.CANVAS_POS.start.oY;
        requestAnimationFrame(() => (this.canvasContainer as HTMLElement).style.transform = `translate(${x}px, ${y}px)`)
    }

    renderComp(comp: any) {
        const div: any = document.createElement('div');
        div.classList.add('component');
        div.setAttribute('comp-id', comp.id);
        div.setAttribute('d-comp-draggable', '')
        div.setAttribute('comp-name', comp.compType);
        const {compInfo: {props}} = comp;
        div.style = `
            position:absolute;
            left:${props['$x']}px;
            top:${props['$y']}px;
            width: ${props['$width']}px;
            height:${props['$height']}px;
            background-color:${props['backgroundColor']};
            opacity: unset;
        `;
        div.innerHTML = `<div class="xx">${comp.id}</div>`;
        CompDraggable.create(div, {
            endCallback: this.dragEndCallback.bind(this)
        });
        return div;
    }
    dragEndCallback(data: any, element: HTMLElement) {
        if (!data) return;
        const compId = element.getAttribute('comp-id');
        const layer = CanvasEditorCtl.getInstance().selectById(compId);
        layer.compInfo.props['$x'] = data?.x;
        layer.compInfo.props['$y'] = data?.y;
        this.canvasEditorEventManager.trigger({
            type: 'right-panel:updatePropsConfig',
            data: layer
        })
    }
    updateCompProp({data}: any) {
        Log.debug('workerspace', 'update comp prop', data);
        const prop = data.key
            .replace('$x', 'left')
            .replace('$y', 'top')
            .replace('$width', 'width')
            .replace('$height', 'height');
        (this.workerContent?.querySelector(`[comp-id=${data.id}]`)  as HTMLElement).style[prop] = `${data.value}px`;
    }
    canvasRender({data}: any) {
        (this.workerContent as HTMLElement).innerHTML = '';
        data.forEach((comp: any) => {
            this.workerContent?.appendChild(this.renderComp(comp));
        });
        Log.debug('workerspace', 'canvas render', data);
    }
    addComponent({data}: any) {
        this.workerContent?.appendChild(this.renderComp(data));
        Log.debug('workerspace', `add ${data.compType} component`, data);
    }
    spaceStyle({data}: any) {
        Log.debug('workerspace', 'space style', data);
        (this.workerContent as HTMLElement).style.backgroundColor = data.bgColor;
    }

    contentWheel(event: any) {

        if (!event.ctrlKey && !event.cusHook) return;
            event.preventDefault();
            event.stopPropagation();

            this.scale += event.deltaY * -0.001;
            this.scale = Math.min(Math.max(0.125, this.scale), 4) as number;

            (this.workerContent as HTMLElement).style.transform = `scale(${this.scale.toFixed(2)})`;

    }
    disableWheel(event: any) {
        if (event.ctrlKey === true) {
            event.preventDefault()
            event.stopPropagation();
            return false
        }

    }
    triggerWheelEvent() {
        const wheelEvt: any = document.createEvent('MouseEvents');
        wheelEvt.initEvent('wheel', true, true);

        wheelEvt.deltaY = -200;
        wheelEvt.cusHook = true
        this.workerContent?.dispatchEvent(wheelEvt);

    }

    moveKeydown(event: {keyCode: number;}) {
        if (event.keyCode === 32) {
            this.MOVE_FLAG = 'SPACE';
        }
    }

    moveKeyup() {
        this.MOVE_FLAG = '';
    }
}