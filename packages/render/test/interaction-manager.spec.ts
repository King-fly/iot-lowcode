import {
    Condition,
    Action,
    Interaction
} from '../src/interaction-manager';

describe('interaction manager module', () => {
    it('interaction manager init', () => {
        const condition1 = Condition
            .create({type: 'enum'});

        const action1 = Action
            .create({type: 'show'})

        const action2 = Action
            .create({type: 'hide'});

        const interaction = Interaction
            .create({trigger: 'click'})
            .makeTrigger()
            .addAction(action1)
            .addAction(action2)
            .addCondition(condition1);

        expect(interaction.actions.length).toEqual(2);
        expect(interaction.conditions.length).toEqual(1);
        expect(interaction.trigger).toEqual('click');
    });
});