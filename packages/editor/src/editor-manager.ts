import {Log, Emitter} from '@d/shared/src/utils';
import {Layer, LayerManager} from '@d/render/src/layer-manager';
import {DataSourceManager} from '@d/render/src/datasource-manager';
import {PageManager} from './page-manager';

export default class CanvasEditorManager {

    static SAVE_TIME;

    static CanvasEditorEventManager = Emitter.create();

    static layerManager = LayerManager.getInstance();

    static dataSource = DataSourceManager.getInstance();
    
    static canvasEditorInstance;

    static getInstance(...args) {
        if (!this.canvasEditorInstance) {
            this.canvasEditorInstance = CanvasEditorManager.create(...args);
        }
        return this.canvasEditorInstance;
    }
    static create(...args) {
        return new this(...args);
    }
    constructor(pageList) {
        this.eventManager = CanvasEditorManager.CanvasEditorEventManager;
        this.pageManager = PageManager.getInstance(pageList);
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
    updateTrigger({data}) {
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
    addTrigger({data}) {
        Log.debug('canvasEditor', 'add trigger', data);
        this.selectById(data.compId)
            .addInteraction(data.trigger);
        return this;
    }
    addAction({data}) {
        Log.debug('canvasEditor', 'add action', data);
        this.selectById(data.compId)
            .addAction(data.triggerId, data.action);
        return this;
    }
    deleteAction({data}) {
        Log.debug('canvasEditor', 'delete action', data);
        this.selectById(data.compId)
            .removeAction({
                triggerId: data.triggerId,
                actionId: data.actionId
            });
        return this;
    }
    deleteTrigger({data}) {
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
    updateProps({data}) {
        Log.debug('canvasEditor', 'update props', data);
        if (data.key === '$name') {
            this.eventManager.trigger({
                type: 'layerManager:updateLayerName',
                data
            });
        }
        this.selectById(data.id).setPropDataSource(data.key, data.value);
    }
    addLayer({data}) {
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
    add(data, cb = () => {}) {
        const layer = Layer.create(data);
        this.layerManager.add(layer);
        cb(layer);
        return this;
    }
    delete(layer) {
        this.layerManager.delete(layer);
        return this;
    }
    selectById(id) {
        return this.layerManager.selectById(id);
    }
    select(layer) {
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
    lock(layer) {
        this.layerManager.lock(layer);
        return this;
    }
    unlock(layer) {
        this.layerManager.unlock(layer);
        return this;
    }
    move(...args) {
        this.layerManager.move(...args);
        return this;
    }
    autoSave() {
        this.pageSchema = Layer
            .create({ compType: 'page' })
                .setFilter(DataSourceManager.FILTER_LIST)
                .setDataSource(CanvasEditorManager.dataSource.dataSourceList)
                .setChildren(this.layerManager.layerList);
        return this;
    }
}