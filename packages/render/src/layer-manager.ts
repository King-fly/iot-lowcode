import {Utils} from '@d/shared/src/utils';
import {ComponentManager} from '@d/core/src/component';

class Layer {

    static ComponentManager = ComponentManager;

    static genUUID() {
        return Utils.genUUID.call(this);
    }
    static create(...args) {
        return new Layer(...args)
    }
    constructor({
        selected = false,
        compType,
        locked = false,
        props,
        id,
        children
    } = {}) {
        this.compType = compType ?? '';
        this.id = id ?? `${this.compType}_${Layer.genUUID()}`;
        this.init({props, selected, locked});
        children && (this.children = children);
    }
    init({props, selected, locked}) {
        if (this.compType && this.compType !== 'page') {
            this.selected = locked === true ? false : selected;
            this.locked = locked;
            this.compInfo = Layer.ComponentManager
                .getComponent(this.compType)
                .create({props});
        }
    }
    setSelected(selected) {
        if (this.locked) return this;

        this.selected = selected ?? true;
        return this;
    }
    setLocked(locked) {
        this.locked = locked ?? true;
        return this;
    }
    addLayer(layer) {
        this.children.push(layer);
        return this;
    }
    setFilter(filter = []) {
        this.filter = filter;
        return this;
    }
    setDataSource(dataSource = []) {
        this.dataSource = dataSource;
        return this;
    }
    setChildren(children) {
        this.children = children;
        return this;
    }
    setPropDataSource(prop, dataSource) {
        this.compInfo.props[prop] = dataSource;
        return this;
    }
    resetPropData(prop) {
        this.compInfo.props[prop] = ComponentManager
            .getComponent(this.compInfo.name).PROPS
            .find(({key}) => key === prop)?.val;
        return this;
    }
    addInteraction(...interaction) {
        this.compInfo.interactions.push(...interaction);
        return this;
    }
    addAction(triggerId, action) {
        const interaction = this.compInfo.interactions.find(({id}) => triggerId === id);
        interaction.actions.push(action);
        return this;
    }
    removeInteraction(interactionId) {
        this.compInfo.interactions = this.compInfo.interactions.filter(({id}) => interactionId !== id);
        return this;
    }
    removeAction({triggerId, actionId}) {
        const interaction = this.compInfo.interactions.find(({id}) => triggerId === id);
        interaction.actions = interaction.actions.filter(({id}) => actionId !== id);
        return this;
    }
    queryInteractionById(interactionId) {
        return this.compInfo.interactions.find(({id}) => interactionId === id);
    }
}

class LayerManager {
    static layerInstance;

    static getInstance() {
        if (!this.layerInstance) {
            this.layerInstance = LayerManager.create()
        }
        return this.layerInstance;
    }
    static create(...args) {
        return new this(...args);
    }
    constructor() {
        this.layerList = [];
    }
    add(layer) {
        this.layerList.push(layer);
        return this;
    }
    delete(layer) {
        if (layer.locked) return this;
        this.layerList = this.layerList.filter(({id}) => layer.id !== id);
        return this;
    }
    select(layer) {
        if (layer.locked) return this;
        this.layerList.forEach(item => item.selected = item.id === layer.id);
        return this;
    }
    selectById(id) {
        let res;
        const next = (schema) => {
            if (schema.id === id) return res = schema;
            schema.children?.forEach(child => next(child));
        }
        next({
            children: this.layerList
        });
        return res;
    }
    group() {
        if (this.layerList.filter(({selected}) => selected === true).length < 2) return this;
        const children = [];
        let fIndex = -1;

        const next = layerList => {
            let index = layerList.findIndex(({selected}) => selected === true);
            if (fIndex === -1) {
                fIndex = index;
            }
            if (index < 0) return;
            children.push(layerList.splice(index, 1)[0]?.setSelected(false));
            next(layerList);
        }
        next(this.layerList);

        children.length && this.layerList
            .splice(fIndex, 0,
                Layer
                    .create({compType: 'group'})
                    .setChildren(children)
                    .setSelected());

        return this;
    }
    ungroup() {
        const next = () => {
            let index = this.layerList.findIndex(({selected}) => selected === true);
            if (index < 0) return;
            const [{children}] = this.layerList.splice(index, 1) || [];
            children.forEach(item => this.layerList.splice(index++, 0, item));
            next();
        }
        next();
        return this;
    }
    lock(layer) {
        layer.setLocked(true);
        return this;
    }
    unlock(layer) {
        layer.setLocked(false);
        return this;
    }
    move(direction, offset) {
        let index = this.layerList.findIndex(({selected}) => selected === true);
        if (index < 0) return;
        if (typeof offset !== 'undefined') {
            offset = direction === 'up' ? index - offset : index + offset;
        }
        else {
            offset = direction === 'up' ? 0 : this.layerList.length;
        }
        const cur = this.layerList.splice(index, 1);
        this.layerList.splice(offset, 0, cur);
        return this;
    }
}

export {
    LayerManager,
    Layer
};
