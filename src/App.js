import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            width: 12,
            height: 12,
            palettes: [
                {
                    id: 'first',
                    color: [255, 0, 0],
                    selected: true
                },
                {
                    id: 'second',
                    color: [0, 255, 0],
                    selected: false
                },
                {
                    id: 'third',
                    color: [0, 0, 255],
                    selected: false
                }
            ]
        };
        this.state.cells = this.regenerateCells();
    }

    render() {
        return (
            <div>
                <label>
                    Width
                    <input type="number" defaultValue={this.state.width} onChange={e => this.changeWidth(e.currentTarget.value)} />
                </label>
                <label>
                    <input type="number" defaultValue={this.state.height} onChange={e => this.changeHeight(e.currentTarget.value)} />
                </label>

                <div>
                    { this.makePaletteItems() }
                </div>

                <ul className="grid" style={ this.makeGridStyle() }>
                    { this.makeGridItems() }
                </ul>

                <code className="code">
                    { this.makeJSONDump() }
                </code>
            </div>
        );
    }

    changeWidth(width) {
        this.setState({
            width,
            cells: this.regenerateCells({ width })
        });
    }

    changeHeight(height) {
        this.setState({
            height,
            cells: this.regenerateCells({ height })
        });
    }

    regenerateCells(dimensions = {}) {
        const {
            width = this.state.width,
            height = this.state.height
        } = dimensions;
        const cells = [];
        const totalItems = width * height;
        for (let i = 0; i < totalItems; ++i) {
            cells.push({
                id: i,
                color: [0, 0, 0]
            });
        }
        return cells;
    }

    makePaletteItems() {
        return this.state.palettes.map((p, i) => {
            return (
                <div key={p.id}>
                    <label>
                        Color #{ i }
                        <input
                            type="radio"
                            name="palette"
                            checked={p.selected}
                            onChange={e => this.selectPaletteColor(p)} />
                    </label>
                    <label>
                        Color
                        <input
                            type="color"
                            defaultValue={ this.convertColorToHex(p.color) }
                            onChange={e => this.updatePaletteColor(p, e.currentTarget.value) }/>
                    </label>
                </div>
            )
        });
    }

    selectPaletteColor(palette) {
        const palettes = [ ...this.state.palettes ];
        palettes.forEach(p => p.selected = p === palette);

        this.setState({
            palettes
        })
    }

    convertColorToHex(color) {
        return `#${this.convertSingleValueToHex(color[0])}${this.convertSingleValueToHex(color[1])}${this.convertSingleValueToHex(color[2])}`
    }

    convertSingleValueToHex(value) {
        let hex = value.toString(16);
        if (hex.length === 1)
            hex = '0' + hex;
        return hex;
    }

    updatePaletteColor(palette, colorHex) {
        const palettes = [ ...this.state.palettes ];
        palettes.forEach(p => {
            if (p === palette) {
                const first = parseInt(colorHex.substring(1,3), 16);
                const second = parseInt(colorHex.substring(3,5), 16);
                const third = parseInt(colorHex.substring(5,7), 16);
                p.color = [first, second, third];
            }
        });

        this.setState({
            palettes
        });
    }

    makeGridStyle() {
        return {
            gridTemplateColumns: `repeat(${this.state.width}, 20px)`
        };
    }

    makeGridItems() {
        return this.state.cells.map(cell => {
            return (
                <li
                    className="grid-item"
                    key={ cell.id }
                    style={{ backgroundColor: this.changeToCSSColor(cell.color )}}
                    onClick={e => this.paintColor(cell)}>

                    &nbsp;
                </li>
            );
        });
    }

    changeToCSSColor(color) {
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }

    paintColor(cell) {
        const cells = [ ...this.state.cells ];

        const selectedPaletteColor = this.state.palettes.find(p => p.selected).color;
        cells.forEach(c => {
            if (c === cell)
                cell.color = selectedPaletteColor;
        });

        this.setState({
            cells
        });
    }

    makeJSONDump() {
        const cellsInSerpentine = [];

        for(let currentColumn = 0; currentColumn < this.state.width; currentColumn += 2) {
            for(let currentRow = this.state.height - 1; currentRow >= 0; currentRow--) {
                cellsInSerpentine.push(this.state.cells[this.state.width * currentRow + currentColumn]);
            }
            if(currentColumn + 1 < this.state.width) {
                for (let currentRow = 0; currentRow < this.state.height; currentRow++) {
                    cellsInSerpentine.push(this.state.cells[this.state.width * currentRow + currentColumn + 1]);
                }
            }
        }

        return JSON.stringify(cellsInSerpentine.map(c => c.color));
    }
}

export default App;
