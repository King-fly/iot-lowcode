import {Utils} from '@d/shared/src/utils';
import {ComponentManager} from '@d/core/src/component';

type LayerInput = {
    selected?: boolean;
    compType: string;
    locked?: boolean;
    props?: object;
    id?: string;
    children?: [object]
};

type LayerItem = {
    locked: boolean;
    id: string;
    selected?: boolean;
    setSelected:(_: boolean) => LayerItem;
    setLocked: (_: boolean) => void;
}

class Layer {

    static ComponentManager = ComponentManager;

    static genUUID() {
        return Utils.genUUID.call(this);
    }
    static create(args: LayerInput) {
        return new Layer(args)
    }

    public compType: string;
    public id: string;
    public children?: object[];
    public selected?: boolean;
    public locked?: boolean;
    public compInfo: {
        interactions: {
            actions: { id: string }[];
            id: string
        }[];
        name: string;
        props: {
            [key: string]: object
        }
    } = {
        interactions: [],
        name: '',
        props: {}
    };
    public filter?: object[];
    public dataSource?: object[];

    constructor(options: LayerInput) {
        this.compType = options?.compType ?? '';
        this.id = options?.id ?? `${this.compType}_${Layer.genUUID()}`;
        this.init({
            props: options?.props,
            selected: options?.selected,
            locked: options?.locked
        });
        options?.children && (this.children = options.children);
    }
    init({props, selected, locked}: {
        props?: object;
        selected?: boolean;
        locked?: boolean
    }) {
        if (this.compType && this.compType !== 'page') {
            this.selected = locked === true ? false : selected;
            this.locked = locked;
            this.compInfo = Layer.ComponentManager
                .getComponent(this.compType)
                .create({props});
        }
    }
    setSelected(selected?: boolean) {
        if (this.locked) return this;

        this.selected = selected ?? true;
        return this;
    }
    setLocked(locked: boolean) {
        this.locked = locked ?? true;
        return this;
    }
    addLayer(layer: object) {
        this.children?.push(layer);
        return this;
    }
    setFilter(filter: any[] = []) {
        this.filter = filter;
        return this;
    }
    setDataSource(dataSource = []) {
        this.dataSource = dataSource;
        return this;
    }
    setChildren(children: object[]) {
        this.children = children;
        return this;
    }
    setPropDataSource(prop: string, dataSource: [object]) {
        this.compInfo.props[prop] = dataSource;
        return this;
    }
    resetPropData(prop: string) {
        this.compInfo.props[prop] = ComponentManager
            .getComponent(this.compInfo.name).PROPS
            .find(({key}: {key: any}) => key === prop)?.val;
        return this;
    }
    addInteraction(...interaction: []) {
        this.compInfo.interactions.push(...interaction);
        return this;
    }
    addAction(triggerId: string, action: {id: string}) {
        const interaction = this.compInfo.interactions.find(({id}) => triggerId === id);
        interaction?.actions.push(action);
        return this;
    }
    removeInteraction(interactionId: string) {
        this.compInfo.interactions = this.compInfo.interactions.filter(({id}) => interactionId !== id);
        return this;
    }
    removeAction({triggerId, actionId}: {
        triggerId: string;
        actionId: string;
    }) {
        const interaction: {actions: {id: string}[]} = this.compInfo.interactions.find(({id}) => triggerId === id) || {actions: []};
        interaction.actions = interaction.actions.filter(({id}) => actionId !== id);
        return this;
    }
    queryInteractionById(interactionId: string) {
        return this.compInfo.interactions.find(({id}) => interactionId === id);
    }
}


class LayerManager {
    static layerInstance: object;

    static getInstance() {
        if (!this.layerInstance) {
            this.layerInstance = LayerManager.create()
        }
        return this.layerInstance;
    }
    static create(...args: []) {
        return new this(...args);
    }
    public layerList: any[];
    constructor() {
        this.layerList = [];
    }
    add(layer: LayerItem) {
        this.layerList.push(layer);
        return this;
    }
    delete(layer: LayerItem) {
        if (layer.locked) return this;
        this.layerList = this.layerList.filter(({id}) => layer.id !== id);
        return this;
    }
    select(layer: LayerItem) {
        if (layer.locked) return this;
        this.layerList.forEach(item => item.selected = item.id === layer.id);
        return this;
    }
    selectById(id: string) {
        let res;
        const next = (schema: {
            id?: string;
            children: any[]
        }) => {
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
        const children: object[] = [];
        let fIndex = -1;

        const next = (layerList: LayerItem[]) => {
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
            const [{children}]: any = this.layerList.splice(index, 1) || [];
            children.forEach((item: LayerItem) => this.layerList.splice(index++, 0, item));
            next();
        }
        next();
        return this;
    }
    lock(layer: LayerItem) {
        layer.setLocked(true);
        return this;
    }
    unlock(layer: LayerItem) {
        layer.setLocked(false);
        return this;
    }
    move(direction: string, offset: number) {
        let index = this.layerList.findIndex(({selected}) => selected === true);
        if (index < 0) return;
        if (typeof offset !== 'undefined') {
            offset = direction === 'up' ? index - offset : index + offset;
        }
        else {
            offset = direction === 'up' ? 0 : this.layerList.length;
        }
        const cur: any = this.layerList.splice(index, 1);
        this.layerList.splice(offset, 0, cur);
        return this;
    }
}

export {
    LayerManager,
    Layer
};
