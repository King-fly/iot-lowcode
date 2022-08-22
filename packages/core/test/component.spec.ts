import {ComponentManager} from '../src/component'
describe('component module', () => {
    it('component init', () => {
        const PageComponent = ComponentManager.getComponent('page');
        const ButtonComponent = ComponentManager.getComponent('button');
        const TextComponent = ComponentManager.getComponent('text');
        const GroupComponent = ComponentManager.getComponent('group');
        

        expect(PageComponent.create().constructor)
            .toEqual(ComponentManager.getComponent('page'));

        expect(ButtonComponent.create().constructor)
            .toEqual(ComponentManager.getComponent('button'));

        expect(TextComponent.create().constructor)
            .toEqual(ComponentManager.getComponent('text'));

        expect(GroupComponent.create().constructor)
            .toEqual(ComponentManager.getComponent('group'));
    });
});