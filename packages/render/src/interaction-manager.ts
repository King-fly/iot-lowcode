import {Utils} from '@d/shared/src/utils';

class Interaction {

    static INTERACTION_TYPE = 'default';

    static create(options) {
        return new this(options);
    }

    constructor(options = {trigger: ''}) {
        this.id = options?.id ?? `interaction_${Utils.genUUID.call(this)}`
        this.trigger = options.trigger;
        this.actions = [];
        this.conditions = [];
    }
    makeTrigger(trigger) {
        this.trigger = trigger ?? this.trigger;
        return this;
    }
    addAction(...action) {
        this.actions.push(...action);
        return this;
    }
    addCondition(...condition) {
        this.conditions.push(...condition);
        return this;
    }
}

class Action {
    constructor(options = {type: ''}) {
        this.type = options.type;
        this.options = options?.options ?? {};
        this.id = options?.id ?? `interaction_action_${Utils.genUUID.call(this)}`;
    }
    static create(...args) {
        return new this(...args);
    }
}

class Condition {

    static create(...args) {
        return new this(...args);
    }

    constructor(options = {type: ''}) {
        this.type = options.type;
        this.field = options?.field ?? '';
        this.options = options?.options ?? {};
        this.id = options?.id ?? `interaction_condition_${Utils.genUUID.call(this)}`;
    }
}

class InteractionManager {

    static create(options) {
        return new this(options);
    }

    static INTERACTION_MAP = {}

    static register(interaction) {
        this.INTERACTION_MAP[interaction.INTERACTION_TYPE] = interaction;
    }
    static getInteraction(name) {
        return this.INTERACTION_MAP[name]
    }

    constructor() {
        this.interactions = [];
    }
}

export {
    InteractionManager,
    Interaction,
    Action,
    Condition
};
