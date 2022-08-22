import {
    Condition,
    Action,
    Interaction
} from '../src/interaction-manager';

describe('interaction manager module', () => {
    it('interaction manager init', () => {
        const condition1 = Condition
            // @ts-ignore
            .create({type: 'enum'});

        const action1 = Action
            // @ts-ignore
            .create({type: 'show'})

        const action2 = Action
            // @ts-ignore
            .create({type: 'hide'});

        const interaction = Interaction
            // @ts-ignore
            .create({trigger: 'click'})
            // @ts-ignore
            .makeTrigger()
            // @ts-ignore
            .addAction(action1)
            // @ts-ignore
            .addAction(action2)
            // @ts-ignore
            .addCondition(condition1);

        expect(interaction.actions.length).toEqual(2);
        expect(interaction.conditions.length).toEqual(1);
        expect(interaction.trigger).toEqual('click');
    });
});