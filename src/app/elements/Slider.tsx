import React, { RefObject } from 'react';
import { ColorAttribute } from '../Sorter';

const HANDLE_W = 11;
const HANDLE_H = 15;
const HANDLE_LINE_W = 3;
const BAR_H = 11;
const BAR_LINE_WIDTH = 3;
const PADDING = HANDLE_W + HANDLE_LINE_W;

function pixelToColor(pixel: Uint8ClampedArray): string {
    return '#' + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16).padStart(6, '0');
}

function addColorStops(grad: CanvasGradient, type: ColorAttribute) {
    if (type === 'brightness') {
        grad.addColorStop(0, '#101010');
        grad.addColorStop(1, '#E0E0E0');
    } else if (type === 'saturation') {
        grad.addColorStop(0, '#888888');
        grad.addColorStop(1, '#FF0000');
    } else if (type === 'hue') {
        grad.addColorStop(0, '#FF0000');
        grad.addColorStop(1 / 6, '#FFFF00');
        grad.addColorStop(2 / 6, '#00FF00');
        grad.addColorStop(3 / 6, '#00FFFF');
        grad.addColorStop(4 / 6, '#0000FF');
        grad.addColorStop(5 / 6, '#FF00FF');
        grad.addColorStop(1, '#FF0000');
    } else if (type === 'raw') {
        grad.addColorStop(0, '#181818');
        grad.addColorStop(1 / 6, '#D01818');
        grad.addColorStop(1.0001 / 6, '#181818');
        grad.addColorStop(2 / 6, '#D0D018');
        grad.addColorStop(2.0001 / 6, '#181818');
        grad.addColorStop(3 / 6, '#18D018');
        grad.addColorStop(3.0001 / 6, '#181818');
        grad.addColorStop(4 / 6, '#18D0D0');
        grad.addColorStop(4.0001 / 6, '#181818');
        grad.addColorStop(5 / 6, '#1818D0');
        grad.addColorStop(5.0001 / 6, '#181818');
        grad.addColorStop(1, '#D018D0');
    }
}

function renderSlider(
    canvas: HTMLCanvasElement,
    sliderA: number,
    sliderB: number,
    invert: boolean,
    type: ColorAttribute
) {
    // Calculate values
    const w = canvas.width;
    const h = canvas.height;
    const barW = w - 2 * PADDING; // Bar width
    const barX = (w - barW) * 0.5;
    const barY = (h - BAR_H) * 0.5;
    const sA = barW * sliderA; // Slider A in pixels
    const sB = barW * sliderB; // Slider B in pixels
    const sAX = sA - HANDLE_W * 0.5; // Slider A X
    const sBX = sB - HANDLE_W * 0.5; // Slider B X
    const sY = (BAR_H - HANDLE_H) * 0.5; // Slider Y (Same for both)

    // Setup context
    const gc = canvas.getContext('2d');
    gc.clearRect(0, 0, w, h);
    gc.translate(barX, barY);

    // Draw bar gradient
    const grad = gc.createLinearGradient(0, 0, barW, 0);
    addColorStops(grad, type);
    gc.fillStyle = grad;
    let dA: number, dB: number;
    if (invert) {
        // |---A    B---|
        gc.fillRect(0, 0, sA, BAR_H);
        gc.fillRect(sB, 0, barW - sB, BAR_H);
        dA = -1;
        dB = 1;
    } else {
        // |   A----B   |
        gc.fillRect(sA, 0, sB - sA, BAR_H);
        dA = 1;
        dB = -1;
    }
    const pixelA = gc.getImageData(barX + sA + dA, barY + BAR_H * 0.5, 1, 1).data;
    const pixelB = gc.getImageData(barX + sB + dB, barY + BAR_H * 0.5, 1, 1).data;

    gc.lineWidth = BAR_LINE_WIDTH;
    gc.strokeStyle = '#b0b3b8';
    gc.strokeRect(0, 0, barW, BAR_H);

    const colorA = pixelToColor(pixelA);
    const colorB = pixelToColor(pixelB);

    gc.strokeStyle = '#b0b3b8';
    gc.lineWidth = HANDLE_LINE_W;

    gc.fillStyle = colorA;
    gc.fillRect(sAX, sY, HANDLE_W, HANDLE_H);
    gc.strokeRect(sAX, sY, HANDLE_W, HANDLE_H);
    gc.fillStyle = colorB;
    gc.fillRect(sBX, sY, HANDLE_W, HANDLE_H);
    gc.strokeRect(sBX, sY, HANDLE_W, HANDLE_H);
}

type SliderProps = {
    invert: boolean;
    type: ColorAttribute;
};
type SliderState = {
    sliderA: number;
    sliderB: number;
};

export default class Slider extends React.Component<SliderProps, SliderState> {
    state: SliderState = {
        sliderA: 0,
        sliderB: 0.5,
    };
    _mouseOn: false | 'A' | 'B' = false;

    _canvas: RefObject<HTMLCanvasElement>;

    constructor(props: SliderProps) {
        super(props);
        this._canvas = React.createRef<HTMLCanvasElement>();

        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
    }

    componentDidMount() {
        this.drawCanvas();

        document.addEventListener('mousemove', this.mouseMove);
        document.addEventListener('mouseup', this.mouseUp);
        document.addEventListener('mousedown', this.mouseDown);
    }

    componentDidUpdate() {
        this.drawCanvas();
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mouseup', this.mouseUp);
        document.removeEventListener('mousedown', this.mouseDown);
    }

    mouseDown(evt: MouseEvent) {
        const mX = evt.pageX - this._canvas.current.offsetLeft;
        const mY = evt.pageY - this._canvas.current.offsetTop;
        const bW = this._canvas.current.clientWidth - 2 * PADDING;
        const sAX = PADDING + this.state.sliderA * bW;
        const sAY = this._canvas.current.clientHeight * 0.5;
        const sBX = PADDING + this.state.sliderB * bW;
        const sBY = sAY;

        if (Math.abs(mX - sAX) < HANDLE_W && Math.abs(mY - sAY) < HANDLE_H) {
            this._mouseOn = 'A';
        } else if (Math.abs(mX - sBX) < HANDLE_W && Math.abs(mY - sBY) < HANDLE_H) {
            this._mouseOn = 'B';
        }
    }
    mouseUp(evt: MouseEvent) {
        this._mouseOn = false;
    }
    mouseMove(evt: MouseEvent) {
        if (!this._mouseOn) return;

        const bW = this._canvas.current.clientWidth - 2 * PADDING;
        if (this._mouseOn === 'A') {
            let newA = this.state.sliderA + evt.movementX / bW;
            this.setState({ sliderA: Math.max(0, Math.min(newA, this.state.sliderB)) });
        } else if (this._mouseOn === 'B') {
            let newB = this.state.sliderB + evt.movementX / bW;
            this.setState({ sliderB: Math.max(this.state.sliderA, Math.min(newB, 1)) });
        }
    }

    drawCanvas() {
        const canvas = this._canvas.current;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        renderSlider(
            canvas,
            this.state.sliderA,
            this.state.sliderB,
            this.props.invert,
            this.props.type
        );
    }

    render() {
        return (
            <div className="slider">
                <canvas ref={this._canvas}></canvas>
            </div>
        );
    }
}
