import {Log, Emitter} from '@d/shared/src/utils';
import {Layer, LayerManager} from '@d/render/src/layer-manager';
import {DataSourceManager} from '@d/render/src/datasource-manager';
import {PageManager} from './page-manager';

type Data = {
    data: {
        id?: string;
        key?: string;
        actionId?: object;
        trigger?: object;
        compId?: string;
        triggerId?: object;
        action?: object;
        name: string;
        ref: {
            type: object;
            trigger: object;
            options: {
                hides?: object;
                shows?: object;
                componentIds?: object;
            }
        },
        value: object
    }
}

type SelectByIdReturns = {
    setPropDataSource: (k?: string, _?: object) => void;
    addInteraction: (_?: object) => void;
    addAction: (t?: object, a?: object) => void;
    removeInteraction: (id?: object) => void;
    removeAction: (input: {
        triggerId?: object;
        actionId?: object;
    }) => object;
}

export default class CanvasEditorManager {
    public pageSchema: object = {};

    static SAVE_TIME: number|NodeJS.Timer;

    static CanvasEditorEventManager = Emitter.create();

    static layerManager = LayerManager.getInstance();

    static dataSource = DataSourceManager.getInstance();
    
    static canvasEditorInstance: {
        layerManager: {
            layerList: object
        }
    };

    static getInstance(...args: [object?]): any {
        if (!this.canvasEditorInstance) {
            this.canvasEditorInstance = CanvasEditorManager.create(...args);
        }
        return this.canvasEditorInstance;
    }
    static create(...args: [object?]) {
        return new this(...args);
    }
    public eventManager: any;
    public pageManager: object;
    public layerManager: {
        layerList: object;
        add: (_: object) => {};
        delete: (_: object) => {};
        selectById: (_?: string) => SelectByIdReturns;
        select: (_: object) => {};
        group: () => {};
        ungroup: () => {};
        lock: (_: object) => {};
        unlock: (_: object) => {};
        move: (_: object) => {};
    };

    constructor(pageList?: object) {
        this.eventManager = CanvasEditorManager.CanvasEditorEventManager;
        this.pageManager = PageManager.getInstance(pageList);
        // @ts-ignore
        this.layerManager = CanvasEditorManager.layerManager;

        this.eventInit();
    }
    eventInit() {
        this.eventManager.on('canvasEditor:addLayer', this.addLayer.bind(this));
        this.eventManager.on('canvasEditor:canvasReady', this.canvasReady.bind(this));
        this.eventManager.on('canvasEditor:layerPanelReady', this.layerPanelReady.bind(this));
        this.eventManager.on('canvasEditor:updateProps', this.updateProps.bind(this));

        this.eventManager.on('canvasEditor:deleteTrigger', this.deleteTrigger.bind(this));
        this.eventManager.on('canvasEditor:deleteAction', this.deleteAction.bind(this));
        this.eventManager.on('canvasEditor:addTrigger', this.addTrigger.bind(this));
        this.eventManager.on('canvasEditor:addAction', this.addAction.bind(this));
        this.eventManager.on('canvasEditor:updateTrigger', this.updateTrigger.bind(this));
    }
    updateTrigger({data}: Data) {
        Log.debug('canvasEditor', 'update trigger', data);
        const interType = data.name;
        const ref = data.ref;
        switch (interType) {
            case 'trigger':
                ref.trigger = data.value;
                break;
            case 'action':
                ref.type = data.value;
                break;
            case 'hides':
            case 'shows':
            case 'componentIds':
                if (interType === 'componentIds') {
                    delete ref.options.hides;
                    delete ref.options.shows;
                } else {
                    delete ref.options.componentIds;
                }
                ref.options[interType] = data.value;
                break;
        }
    }
    addTrigger({data}: Data) {
        Log.debug('canvasEditor', 'add trigger', data);
        this.selectById(data.compId)
            .addInteraction(data.trigger);
        return this;
    }
    addAction({data}: Data) {
        Log.debug('canvasEditor', 'add action', data);
        this.selectById(data.compId)
            .addAction(data.triggerId, data.action);
        return this;
    }
    deleteAction({data}: Data) {
        Log.debug('canvasEditor', 'delete action', data);
        this.selectById(data.compId)
            .removeAction({
                triggerId: data.triggerId,
                actionId: data.actionId
            });
        return this;
    }
    deleteTrigger({data}: Data) {
        Log.debug('canvasEditor', 'delete trigger', data);
        this.selectById(data.compId)
            .removeInteraction(data.triggerId);
        return this;
    }
    layerPanelReady() {
        Log.debug('canvasEditor', 'layer panel ready');
        this.eventManager.trigger({
            type: 'layerManager:layerPanelRender',
            data: this.layerManager.layerList
        });
    }
    canvasReady() {
        Log.debug('canvasEditor', 'canvas ready');
        if (CanvasEditorManager.SAVE_TIME) clearInterval(CanvasEditorManager.SAVE_TIME);
        CanvasEditorManager.SAVE_TIME = setInterval(() => {
            Log.debug('canvasEditor', 'auto save');
            this.eventManager.trigger({
                type: 'tools-bar:autoSave'
            });
        }, 1000 * 60);
        this.eventManager.trigger({
            type: 'workerspace:canvasRender',
            data: this.layerManager.layerList
        });
    }
    updateProps({data}:Data) {
        Log.debug('canvasEditor', 'update props', data);
        if (data.key === '$name') {
            this.eventManager.trigger({
                type: 'layerManager:updateLayerName',
                data
            });
        }
        this.selectById(data.id).setPropDataSource(data.key, data.value);
    }
    addLayer({data}: Data) {
        this.add({
            compType: data
        }, layer => {
            this.eventManager.trigger({
                type: 'workerspace:addComponent',
                data: layer
            });
            this.eventManager.trigger({
                type: 'layerManager:addLayer',
                data: layer
            });
            this.select(layer);
            Log.debug('canvasEditor', `add ${data} layer`, {
                compType: layer,
                layerList: this.layerManager.layerList
            });
        });
    }
    add(data: object, cb = (_: any) => {}) {
        // @ts-ignore
        const layer = Layer.create(data);
        this.layerManager.add(layer);
        cb(layer);
        return this;
    }
    delete(layer: object) {
        this.layerManager.delete(layer);
        return this;
    }
    selectById(id?: string): {
        setPropDataSource: (k?: string, _?: object) => void;
        addInteraction: (_?: object) => void;
        addAction: (t?: object, a?: object) => void;
        removeInteraction: (id?: object) => void;
        removeAction: (input: {
            triggerId?: object;
            actionId?: object;
        }) => object;
    } {
        return this.layerManager.selectById(id);
    }
    select(layer: object) {
        this.layerManager.select(layer);
        return this;
    }
    group() {
        this.layerManager.group();
        return this;
    }
    ungroup() {
        this.layerManager.ungroup();
        return this;
    }
    lock(layer: object) {
        this.layerManager.lock(layer);
        return this;
    }
    unlock(layer: object) {
        this.layerManager.unlock(layer);
        return this;
    }
    move(...args: [object]) {
        this.layerManager.move(...args);
        return this;
    }
    autoSave() {
        this.pageSchema = Layer
            .create({ compType: 'page' })
                .setFilter(DataSourceManager.FILTER_LIST)
                // @ts-ignore
                .setDataSource(CanvasEditorManager.dataSource.dataSourceList)
                // @ts-ignore
                .setChildren(this.layerManager.layerList);
        return this;
    }
}