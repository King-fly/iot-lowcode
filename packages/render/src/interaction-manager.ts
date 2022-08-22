import {Utils} from '@d/shared/src/utils';

type InteractionOptions = {
    trigger: string;
    id: string;
}

class Interaction {

    static INTERACTION_TYPE = 'default';

    static create(options: InteractionOptions) {
        return new this(options);
    }

    public id: string;
    public trigger: string;
    public actions: [];
    public conditions: [];

    constructor(options: InteractionOptions) {
        this.id = options?.id ?? `interaction_${Utils.genUUID.call(this)}`
        this.trigger = options.trigger;
        this.actions = [];
        this.conditions = [];
    }
    makeTrigger(trigger: string) {
        this.trigger = trigger ?? this.trigger;
        return this;
    }
    addAction(...action: []) {
        this.actions.push(...action);
        return this;
    }
    addCondition(...condition: []) {
        this.conditions.push(...condition);
        return this;
    }
}

type ActionOptions = {
    id: string;
    type: string;
    options?: object;
}

class Action {
    public type: string;
    public options: object;
    public id: string;

    constructor(options: ActionOptions) {
        this.type = options.type;
        this.options = options?.options ?? {};
        this.id = options?.id ?? `interaction_action_${Utils.genUUID.call(this)}`;
    }
    static create(options: ActionOptions) {
        return new this(options);
    }
}

type ConditionOptions = {
    type: string;
    field: string;
    options: object;
    id: string;
};

class Condition {

    static create(options: ConditionOptions) {
        return new this(options);
    }

    public type: string;
    public field: string;
    public options: object;
    public id: string;

    constructor(options: ConditionOptions) {
        this.type = options.type;
        this.field = options?.field ?? '';
        this.options = options?.options ?? {};
        this.id = options?.id ?? `interaction_condition_${Utils.genUUID.call(this)}`;
    }
}

type InteractionManagerOptions = [];

class InteractionManager {

    static create(options: InteractionManagerOptions) {
        return new this(options);
    }

    static INTERACTION_MAP: {
        [key : string]: object;
    } = {}

    static register(interaction: {INTERACTION_TYPE: string}) {
        this.INTERACTION_MAP[interaction.INTERACTION_TYPE] = interaction;
    }
    static getInteraction(name: string) {
        return this.INTERACTION_MAP[name]
    }

    public interactions: InteractionManagerOptions;

    constructor(interactions: InteractionManagerOptions) {
        this.interactions = interactions || [];
    }
}

export {
    InteractionManager,
    Interaction,
    Action,
    Condition
};
