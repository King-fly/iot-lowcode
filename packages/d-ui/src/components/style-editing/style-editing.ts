export default class StyleEditing {
    static render(): any {
        const frag = document.createDocumentFragment();
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="edit-content align">
                <div class="align-item"><div class="align-left"></div></div>
                <div class="align-item"><div class="align-center"></div></div>
                <div class="align-item"><div class="align-right"></div></div>
                <div class="align-item"><div class="align-top"></div></div>
                <div class="align-item"><div class="align-middle"></div></div>
                <div class="align-item"><div class="align-bottom"></div></div>
                <div class="align-item"><div class="align-horizontal"></div></div>
                <div class="align-item"><div class="align-vertical"></div></div>
            </div>
            <div class="edit-content size">
                <div class="pos-item px"><input type="text" name="$x"></div>
                <div class="pos-item py"><input type="text" name="$y"></div>
                <div class="pos-item deg"><input type="text" name="$rotate"></div>
                <div class="pos-item w"><input type="text" name="$width"></div>
                <div class="pos-item h"><input type="text" name="$height"></div>
                <div class="pos-item mirror">
                    <div class="mirror-l"></div>
                    <div class="mirror-r"></div>
                </div>
            </div>
            <div class="edit-content setter">
                <div class="setter-item">
                    <div class="setter-key">组件名称</div>
                    <div class="setter-val">
                        <input type="text" name="$name">
                    </div>
                </div>
                <div class="setter-item">
                    <div class="setter-key">组件可见性</div>
                    <div class="setter-val">
                        <input type="checkbox" checked name="$visible">
                    </div>
                </div>
                <div class="setter-item">
                    <div class="setter-key">不透明度</div>
                    <div class="setter-val opacity">
                        <div class="range"><input type="range" name="" id=""></div>
                        <div class="step"><input type="number" value="10" step="10" min="0" name="" id=""></div>
                    </div>
                </div>
            </div>
        `;
        frag.appendChild(div);
        return frag.firstChild;
    }
}