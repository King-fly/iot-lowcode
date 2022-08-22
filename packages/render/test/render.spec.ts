import {Render} from '../src/render';
import {FilterManager} from '../src/filter-manager';
import CanvasEditorManager from '../../editor/src/editor-manager';
import {DataSourceManager} from '../src/datasource-manager';
import {Layer} from '../src/layer-manager';
import {Interaction, Action, Condition} from '../src/interaction-manager';

describe('render module', () => {
    it('render init', () => {
        // @ts-ignore
        const canvasEditor = CanvasEditorManager.getInstance();

        canvasEditor
        // @ts-ignore
            .add({
                compType: 'group',
                children: [
                    Layer.create({
                        compType: 'button'
                    }),
                    Layer.create({
                        compType: 'group',
                        children: [
                            Layer.create({
                                compType: 'button'
                            }),
                            // @ts-ignore
                            Layer.create({
                                compType: 'text'
                            })
                        ]
                    })
                ]
            })
            .add({
                compType: 'group',
                children: [
                    Layer.create({
                        compType: 'button'
                    }),
                    Layer.create({
                        compType: 'text'
                    })
                ]
            })
            .add({compType: 'text', id: 'text_test'})
            .selectById('text_test')
            .setSelected(true)
            .setPropDataSource('borderWidth', CanvasEditorManager.dataSource
            // @ts-ignore
                .add(DataSourceManager
                    .getDataSource('global')
                    .create({ id: 'g1', name: 'result', value: '1' }))
                .add(DataSourceManager
                    .getDataSource('global')
                    .create({ id: 'g2', name: 'result2', value: '2' }))
                .add(DataSourceManager
                    .getDataSource('interface').create({method: 'get', params: {}, url: 'http://www.baidu.com'})
                    .addDataHandler(
                        FilterManager.getFilter('code')
                        // @ts-ignore
                            .create({source: 'function (data) {return data.id;}'}),
                        FilterManager.getFilter('code')
                        // @ts-ignore
                            .create({source: 'function () {}'}),
                        // @ts-ignore
                        FilterManager.getFilter('biz').create(),
                    ))
                .queryById('g1').value())
            .addInteraction(
                // @ts-ignore
                Interaction.create({id: 't1'})
                    .makeTrigger('click')
                        .addAction(
                            // @ts-ignore
                            Action.create({type: 'showHide'}),
                            // @ts-ignore
                            Action.create({type: 'showDisplay'})
                        )
                        .addCondition(
                            // @ts-ignore
                            Condition.create({
                                type: 'enum',
                                field: 'current'
                            }),
                            // @ts-ignore
                            Condition.create({
                                type: 'list',
                                field: 'current'
                            }))
                ,
                // @ts-ignore
                Interaction.create({id: 't2'})
                    .makeTrigger('click')
                        .addAction(
                            // @ts-ignore
                            Action.create({type: 'showHide'}),
                            // @ts-ignore
                            Action.create({type: 'showDisplay'})
                        )
                        .addCondition(
                            // @ts-ignore
                            Condition.create({
                                type: 'enum',
                                field: 'current'
                            }),
                            // @ts-ignore
                            Condition.create({
                                type: 'list',
                                field: 'current'
                            })))
        // @ts-ignore
        canvasEditor.autoSave();
        // @ts-ignore
        const rawSchema = JSON.parse(JSON.stringify(canvasEditor.pageSchema));

        DataSourceManager.FILTER_LIST.length = 0;
        // @ts-ignore
        DataSourceManager.getInstance().dataSourceList.length = 0;

        const schema = Render.create().fetchPageSchemaDSL(rawSchema).transformer();
        expect(rawSchema).toEqual(schema);

        expect(DataSourceManager.FILTER_LIST.length > 0).toEqual(true);
        // @ts-ignore
        expect(DataSourceManager.getInstance().dataSourceList.length > 0).toEqual(true);

        // @ts-ignore
        canvasEditor.layerManager.layerList.length = 0;
    });
});