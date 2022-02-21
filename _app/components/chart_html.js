const chartContainer = document.createElement('template');
chartContainer.innerHTML = `
<style>
.chartContainer {
    width: max-content;
    display: grid;
    grid-template-columns: repeat(var(--cols), max-content);
    grid-template-rows: repeat(var(--rows), 1fr);
    position: relative;
    box-sizing: border-box;
}

.cell{
    box-sizing: border-box;
    width: var(--width);
    height: var(--height);
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    border-bottom-color: gray;
    border-left-color: gray;
    position: relative;
    z-index: 1;
}

.cell[data-y='0'] {
    border-bottom: 2px solid black;
    z-index: 1;
}

.cell[data-x='0']::before {
    content: '';
    display: block;
    width: 25%;
    height: 100%;
    box-sizing: content-box;
    position: absolute;
    top: 0;
    left: -25%;
    border-bottom: 1px solid gray;
}

.cell[data-x='0']::after {
    counter-reset: variable var(--y);
    content: counter(variable);
    display: block;
    width: 25%;
    height: 100%;
    box-sizing: content-box;
    position: absolute;
    top: 50%;
    left: -60%;
    text-align: right;
}

.cell[data-x='0'][data-y='0']::before {
    border-bottom: 2px solid black;
}

.cell.checked{
    position: relative;
    z-index: 10;
}

.cell .graph, .cell .content {
    border: 0;
    box-sizing: border-box;
    position: absolute;
    inset: -1px;
}

.cell[data-y='0'] .graph, .cell[data-y='0'] .content {
    inset: revert;
    top: -1px;
    right: -1px;
    bottom: -2px;
    left: -1px;
}

.cell.checked .graph::after{
    content: '';
    display: block;
    position: absolute;
    box-sizing: content-box;
    inset: 0;
    width: var(--width, 100%);
    height: 100%;
    border-bottom: 3px solid red;
    z-index: 20;
    transform-origin: bottom left;
    transform: rotateZ(var(--angle, 0));
}

.cell.last.checked .graph::after {
    border-bottom-color: transparent;
}

.cell input {
    display: none;
}

.cell.checked .graph::before{
    content: '';
    display: block;
    width: var(--pinSize);
    height: var(--pinSize);
    box-sizing: content-box;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    z-index: 30;
    bottom: 0;
    left: 0;
    transform: translateX(-50%) translateY(50%);
}

.cell.checked .content {
    width: calc(10px + var(--pinSize));
    height: calc(10px + var(--pinSize));
    inset: revert;
    bottom: 0;
    left: 0;
    transform: translateX(-50%) translateY(50%);
    z-index: 40;
    cursor: pointer;
}

.cell.checked .content::before {
    content: var(--name);
    display: block;
    position: absolute;
    box-sizing: border-box;
    width: calc(var(--width) * 1.5);
    transform: translateY(-110%);
    text-align: center;
    padding: 0.5rem;
    background-color: hsla(0, 0%, 100%, 0.8);
    z-index: 50;
    opacity: 0;
    transition: opacity 300ms ease-in;
    pointer-events: none;
}

.cell.checked input:checked + .content::before {
    opacity: 1;
}
</style>
        <div class='chartContainer'>
        </div>
`;

export class ChartHTML extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(chartContainer.content.cloneNode(true));
    }

    init(scales) {
        this.scales = scales;
        this.range = [-10, 10];
        this.step = 1;
        this.unitHeight = 20;
        this.unitWidth = 80;
        this.pinSize = 20;
        this.cols = this.scales.length;
        this.rows = Math.abs(this.range[0]) + Math.abs(this.range[1]) + 1;

        let chartContainer = this.shadowRoot.querySelector('.chartContainer');
        chartContainer.style.setProperty('--width', this.unitWidth + 'px');
        chartContainer.style.setProperty('--height', this.unitHeight + 'px');
        chartContainer.style.setProperty('--pinSize', this.pinSize + 'px');
        chartContainer.style.setProperty('--cols', this.cols);
        chartContainer.style.setProperty('--rows', this.rows);
        for (let y = this.range[1]; y >= this.range[0]; y -= 1) {
            for (let x = 0; x < this.scales.length; x++) {
                let cell = document.createElement('div');

                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('id', `inp_${x}_${y}`);
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked === true) {
                        Array.from(
                            chartContainer.querySelectorAll('input')
                        ).forEach((i) => {
                            if (i !== e.target) {
                                i.checked = false;
                            }
                        });
                    }
                });

                let label = document.createElement('label');
                label.setAttribute('for', `inp_${x}_${y}`);
                label.classList.add('content');

                let graph = document.createElement('div');
                graph.classList.add('graph');

                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.classList.add('cell');
                if (x === 0) {
                    cell.style.setProperty('--y', y);
                }
                cell.append(checkbox, label, graph);
                chartContainer.append(cell);
            }
        }

        this.buildGraph(this.scales);
    }

    buildGraph(arr) {
        arr.forEach((item, index) => {
            let cell = this.shadowRoot.querySelector(
                `.cell[data-x='${index}'][data-y='${item.value}']`
            );
            cell.style.setProperty('--name', `"${item.name}: ${item.value}"`);
            cell.classList.add('checked');

            let graph = cell.querySelector('.graph');

            if (index < arr.length - 1) {
                let height =
                    Math.abs(item.value - arr[index + 1].value) *
                    this.unitHeight;
                let hypotenuse = Math.hypot(height, this.unitWidth);

                graph.style.setProperty('--width', hypotenuse + 'px');

                let angle = 0;
                if (item.value > arr[index + 1].value) {
                    angle = this.radToDeg(Math.atan(height / this.unitWidth));
                }
                if (item.value < arr[index + 1].value) {
                    angle =
                        this.radToDeg(Math.atan(height / this.unitWidth)) * -1;
                }
                graph.style.setProperty('--angle', angle + 'deg');
            }

            if (index === arr.length - 1) {
                cell.classList.add('last');
            }
        });
    }

    degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    radToDeg(rad) {
        return rad * (180 / Math.PI);
    }
}

window.customElements.define('chart-html', ChartHTML);
