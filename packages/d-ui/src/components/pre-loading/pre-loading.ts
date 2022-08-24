export default class PreLoading {
    static loader() {
        this.render();
    }
    static render() {
        document.body.insertBefore(this.template(), document.body.firstChild);
    }
    static template() {
        const loadingEl = document.createElement('div');
        loadingEl.setAttribute('loading-status', '');
        loadingEl.innerHTML = '<div></div><div></div><div></div>';
        return loadingEl;
    }
}
