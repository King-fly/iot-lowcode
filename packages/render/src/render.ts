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

import { ActionOptions, ConditionOptions} from './interaction-manager';

type Node = {
    id: string;
    selected: boolean;
    locked: boolean;
    compType: string;
    children: [object];
    dataSource?: {
        type: string;
        id: string;
        dataHandler: object[];
        options?: any;
    }[];
    filter?: {
        type: string;
        id: string;
        source: string;
    }[]
}

class Render {
    public SCHEMA_VISITOR?: {
        [key: string]: object;
    }
    static nodeFindReplace(node: object, parent: {children: object[]}, instance: object) {
        parent.children.splice(parent.children.findIndex(child => child === node), 1, instance);
    }
    static SCHEMA_VISITOR = {
        __common(node: {
            compType: string;
            id: string;
            selected: boolean;
            locked: boolean;
            compInfo: {
                props: object;
                interactions: {
                    id: string;
                    trigger: string;
                    actions?: ActionOptions[];
                    conditions?: ConditionOptions[];
                }[]
            }
        }, parent: object) {
            const {selected, locked, compInfo: {props, interactions}} = node;
            const comp: {
                compInfo: {
                    interactions?: object[]
                }
            } = Layer
                .create({
                    compType: node.compType,
                    id: node.id,
                    selected,
                    locked,
                    props
                });
            comp.compInfo.interactions = interactions?.reduce((prev, cur) => {
                const {id, trigger} = cur;
                const interaction = Interaction.create({
                    id,
                    trigger
                });
                interaction.actions = cur?.actions?.reduce((preAct, act) => {
                    // @ts-ignore
                    preAct.push(Action.create(act));
                    return preAct;
                }, []) || [];
                interaction.conditions = cur?.conditions?.reduce((preCond, cond) => {
                    // @ts-ignore
                    preCond.push(Condition.create(cond));
                    return preCond;
                }, []) || [];
                // @ts-ignore
                prev.push(interaction);
                return prev;
            }, []) || [];
            // @ts-ignore
            Render.nodeFindReplace(node, parent, comp);
            return true;
        },
        group(node: Node, parent: {children: object[]}) {
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
        page(node: Node) {
            // @ts-ignore
            node.filter = DataSourceManager.FILTER_LIST = node.filter
                .reduce((prev, {type, id, source}) => {
                    // @ts-ignore
                    prev.push(FilterManager
                        .getFilter(type)
                        // @ts-ignore
                        .create({id, source}));
                    return prev;
            }, []);
            node.dataSource = DataSourceManager.getInstance().dataSourceList = node.dataSource?.reduce(
                (prev, cur) => {
                    // @ts-ignore
                    prev.push(DataSourceManager
                        .getDataSource(cur.type)
                        .create({
                            ...cur.options,
                            id: cur.id
                        })
                        .setDataHandler?.(cur.dataHandler.reduce((prev: any[], cur) => {
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
    static create() {
        return new this();
    }
    static renderInstance: object;

    static getInstance() {
        if (!this.renderInstance) {
            this.renderInstance = this.create();
        }
        return this.renderInstance;
    }
    constructor() {
        this.components = {};
    }
    public components: {
        [key: string]: boolean;
    };
    public SCHEMA_DSL?: any;
    fetchPageSchemaDSL(schema: object) {
        this.SCHEMA_DSL = schema || {};
        return this;
    }
    getPageComponents() {
        this.components = {};
        return this;
    }
    traverse() {
        const traverseNode = (node: Node, parent?: {children: object[]}) => {
            if (!node) return;
            this.components[node.compType] = true;
            // @ts-ignore
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
