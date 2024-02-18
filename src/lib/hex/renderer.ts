import { Hex } from './hex';
import { HexLayout } from './layout';
import { HexMap } from './maps';

export class HexMapRenderer<TData = any> {
  constructor(
    protected layout: HexLayout,
    protected backgroundColor: string = 'transparent',
  ) { }

  // TODO: Turn this into a function inside of a HexMapConfig object
  public renderMap(
    ctx: CanvasRenderingContext2D,
    map: HexMap<TData>,
    shape: 'hexagon' | 'circle' = 'hexagon',
    clear: boolean = true,
  ) {
    if (clear) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    map.hexData.forEach((data, hex) => {
      this.renderHex(ctx, hex, data, shape);
    });
  }

  // TODO: Can pass a function with this type of signature as a "pass"
  // Multiple passes to render layers of the map's hexes
  protected renderHex(
    ctx: CanvasRenderingContext2D,
    hex: Hex,
    data: TData | null = null,
    shape: 'hexagon' | 'circle' = 'hexagon',
  ): void {
    const corners = this.layout.polygonCorners(hex);
    ctx.beginPath();

    switch (shape) {
      case 'hexagon':
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < 6; i++) {
          ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.closePath();
        break;
      case 'circle':
        const center = this.layout.hexToPixel(hex);
        ctx.arc(center.x, center.y, this.layout.size.y / 2, 0, 2 * Math.PI);
        break;
    }

    // @ts-ignore
    ctx.strokeStyle = ctx.fillStyle = data?.color || 'black';
    // ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.fill();
    ctx.stroke();
  };
}

function remapRandom() {
  return Math.random() * 2 - 1;
}
