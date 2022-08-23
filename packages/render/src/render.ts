import {Layer}  from './layer-manager';
import {
    Interaction,
    Action,
    Condition
} from './interaction-manager';
import {
    FilterManager
} from './filter-manager';
import {
    DataSourceManager,
    InterfaceHandler
} from './datasource-manager';

class Render {
    static nodeFindReplace(node: any, parent: any, instance: any) {
        parent.children.splice(parent.children.findIndex((child: any) => child === node), 1, instance);
    }
    static SCHEMA_VISITOR: any = {
        __common(node: any, parent: any) {
            const {selected, locked, compInfo: {props, interactions}} = node;
            const comp = Layer.create({
                compType: node.compType,
                id: node.id,
                selected,
                locked,
                props
            });
            comp.compInfo.interactions = interactions?.reduce((prev: any, cur: any) => {
                const {id, trigger} = cur;
                const interaction = Interaction.create({
                    id,
                    trigger
                });
                interaction.actions = cur?.actions?.reduce((preAct: any, act: any) => {
                    preAct.push(Action.create(act));
                    return preAct;
                }, []) || [];
                interaction.conditions = cur?.conditions?.reduce((preCond: any, cond: any) => {
                    preCond.push(Condition.create(cond));
                    return preCond;
                }, []) || [];
                prev.push(interaction);
                return prev;
            }, []) || [];
            Render.nodeFindReplace(node, parent, comp);
            return true;
        },
        group(node: any, parent: any) {
            const {id, selected, locked, compType, children} = node;
            parent && Render.nodeFindReplace(node, parent, Layer.create({
                compType,
                children,
                id,
                selected,
                locked
            }));
            return true;
        },
        page(node: any) {
            node.filter = DataSourceManager.FILTER_LIST = node.filter
                .reduce((prev: any, {type, id, source}: any) => {
                    prev.push(FilterManager
                        .getFilter(type)
                        .create({id, source}));
                    return prev;
            }, []);
            node.dataSource = DataSourceManager.getInstance().dataSourceList = node.dataSource.reduce(
                (prev: any, cur: any) => {
                    prev.push(DataSourceManager
                        .getDataSource(cur.type)
                        .create({
                            ...cur.options,
                            id: cur.id
                        })
                        .setDataHandler?.(cur.dataHandler.reduce((prev: any, cur: any) => {
                            prev.push(InterfaceHandler.create(cur))
                            return prev;
                        }, [])) ?? DataSourceManager
                        .getDataSource(cur.type)
                        .create({
                            ...cur.options,
                            id: cur.id
                        }))
                    return prev;
                }, []);
            return true;
        }
    }
    static create(...args: []) {
        return new this(...args);
    }
    static renderInstance: any;

    static getInstance(...args: []) {
        if (!this.renderInstance) {
            this.renderInstance = this.create(...args);
        }
        return this.renderInstance;
    }
    public components: any;
    public SCHEMA_DSL: any;
    constructor() {
        this.components = {};
    }
    fetchPageSchemaDSL(schema: any) {
        this.SCHEMA_DSL = schema
        return this;
    }
    getPageComponents() {
        this.components = {};
        return this;
    }
    traverse() {
        const traverseNode = (node: any, parent?: any) => {
            if (!node) return;
            this.components[node.compType] = true;
            Render.SCHEMA_VISITOR[node.compType]?.(node, parent) ?? Render.SCHEMA_VISITOR?.__common(node, parent);
            /group|page/.test(node.compType) && node.children
                .forEach((child: any) => traverseNode(child, node));
        };
        traverseNode(this.SCHEMA_DSL);
        return this.SCHEMA_DSL;
    }
    transformer() {
        return this.traverse();
    }
}

export {
    Render
};
