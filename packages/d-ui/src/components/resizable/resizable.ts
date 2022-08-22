export default class Resizable {

    static create(...args) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll('[resizable]').forEach(elem => {
                this.create(elem);
            });
        }).bind(this));
    }

    constructor(root) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
    }

    static render() {
        return `
            <div resizable>
                <div class="t-l handle"></div>
                <div class="t-m-t handle"></div>
                <div class="t-m handle"></div>
                <div class="t-r handle"></div>
                <div class="m-l handle"></div>
                <div class="m-r handle"></div>
                <div class="b-l handle"></div>
                <div class="b-m handle"></div>
                <div class="b-r handle"></div>
            </div>
        `
    }
}