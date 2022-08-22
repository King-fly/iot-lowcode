import {
    PropsManager
} from '../src/designer';
import CanvasEditorManager from '@d/editor/src/editor-manager';
import {DataSourceManager} from '@d/render/src/datasource-manager';

import {SetterManager} from '../src/setter-manager';
import {Interaction, Action, Condition} from '@d/render/src/interaction-manager';

describe('Designer module', () => {
    it('should equal 3 when group', () => {
        // @ts-ignore
        const canvasEditor = CanvasEditorManager.getInstance();

        canvasEditor
            // @ts-ignore
            .add({compType: 'button'})
            .add({compType: 'button', id: 'btn_test'})
            .add({compType: 'text', id: 'text_test'})
            .add({compType: 'text'});

        canvasEditor
            // @ts-ignore
            .selectById('btn_test')
            .setSelected(true);

        canvasEditor
            // @ts-ignore
            .selectById('text_test')
            .setSelected(true);
        // @ts-ignore
        canvasEditor.group()
        // @ts-ignore
        expect(canvasEditor.layerManager.layerList.length).toEqual(3);
        // @ts-ignore
        canvasEditor.layerManager.layerList.length = 0;
    });
});

describe('Layer edit manager', () => {
    it('should ', () => {
        const propsInstance = PropsManager.create();

        propsInstance
            // @ts-ignore
            .add(SetterManager.getSetter('input')
                .create({
                    setterId: 1,
                    key: '$x',
                    val: '0'
                }))
            // @ts-ignore
            .add(SetterManager.getSetter('image')
                .create({
                    key: '$source',
                    val: 'http://www.baidu.com'
                }))
            // @ts-ignore
            .add(SetterManager.getSetter('textarea')
                .create({
                    key: '$info',
                    val: 'xxxx'
                }));

        expect(Object.keys(propsInstance.generate()).length).toEqual(3);
        propsInstance.setterList.length = 0;
    });
});

describe('component edit', () => {
    it('component props', () => {
        // @ts-ignore
        const canvasEditor = CanvasEditorManager.getInstance();
        
        canvasEditor
            // @ts-ignore
            .add({compType: 'button'})
            .add({compType: 'image'})
            .add({compType: 'text', id: 'text_test'})
            .add({compType: 'button', id: 'btn_test'});

        canvasEditor
            // @ts-ignore
            .selectById('btn_test')
            .setSelected(true);

        canvasEditor
            // @ts-ignore
            .selectById('text_test')
            .setSelected(true);
        // @ts-ignore
        canvasEditor.group();
        // @ts-ignore
        expect(canvasEditor.layerManager.layerList.pop().compType).toEqual('group');
        // @ts-ignore
        canvasEditor.layerManager.layerList.length = 0;
    });
});

describe('datasource manager', () => {
    it('comp datasource', () => {
        // @ts-ignore
        const canvasEditor = CanvasEditorManager.getInstance();

        canvasEditor
            // @ts-ignore
            .add({compType: 'button'})
            .add({compType: 'image'})
            .add({compType: 'text', id: 'text_test'})
            .add({compType: 'button', id: 'btn_test'});

        canvasEditor
            // @ts-ignore
            .selectById('btn_test')
            .setPropDataSource('borderWidth', CanvasEditorManager.dataSource
            // @ts-ignore
                .add(DataSourceManager
                    .getDataSource('global')
                    .create({ id: 'g1', name: 'result', value: '1' }))
                .add(DataSourceManager
                    .getDataSource('global')
                    .create({ id: 'g2', name: 'result2', value: '2' }))
                .add(DataSourceManager
                    .getDataSource('global')
                    .create({ id: 'g3', name: 'result3', value: '3' }))
                .queryById('g1').value())
            .resetPropData('borderWidth');
        // @ts-ignore
        expect(CanvasEditorManager.dataSource.dataSourceList.length).toEqual(3);
        // @ts-ignore
        CanvasEditorManager.dataSource.dataSourceList.length = 0;
    });
});

describe('Designer interaction', () => {
    it('should ', () => {        
        // @ts-ignore
        const canvasEditor = CanvasEditorManager.getInstance();

        canvasEditor
            // @ts-ignore
            .add({compType: 'text', id: 'text_test'})
            .add({compType: 'button', id: 'btn_test'});

        const btn = canvasEditor
            // @ts-ignore
            .selectById('btn_test')
            .setSelected(true)
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
            .removeInteraction('t2')
            .queryInteractionById('t1');

        expect(btn.id).toEqual('t1');

    });
});
