import { HexOrientation } from './orientation';
import { Point } from './point';
import { Hex } from '~/lib/hex/hex';

type CornerIndex = typeof HexLayout.corners[number];

export class HexLayout {
  static corners = [ 0, 1, 2, 3, 4, 5 ] as const;

  constructor(
    public orientation: HexOrientation,
    public size: Point,
    public origin: Point
  ) { }

  /**
   * @param {Point} h - The hex to convert to pixel space
   * @returns {Point} - The pixel that the hex is at in pixel space
   */
  public hexToPixel(h: Hex): Point {
    const M = this.orientation;
    const size = this.size;
    const origin = this.origin;
    const x = (M.f0 * h.q + M.f1 * h.r) * size.x;
    const y = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return new Point(x + origin.x, y + origin.y);
  }

  /**
   * @param {Point} p - The point to convert to a hex in pixel space
   * @returns {Point} - The hex that the point is at in hex space
   */
  public pixelToHex(p: Point): Point {
    const M = this.orientation;
    const size = this.size;
    const origin = this.origin;
    const pt = new Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
    const x = M.b0 * pt.x + M.b1 * pt.y;
    const y = M.b2 * pt.x + M.b3 * pt.y;
    return new Point(x, y);
  }

  /**
   * @param {number} corner - The corner in range [0, 5] to get the offset for
   * @returns {Point} - The offset of the corner
   **/
  public hexCornerOffset(corner: CornerIndex): Point {
    if (corner < 0 || corner > 5) {
      throw new Error('corner must be between 0 and 5');
    }

    const M = this.orientation;
    const size = this.size;
    const angle = 2.0 * Math.PI * (M.start_angle - corner) / 6;

    return new Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
  }
  /**
   * @param {Point} h - Hex to get the corners of
   * @returns {Point[]} - Array of points that are the corners of the hex
   **/
  public polygonCorners(h: Hex): Point[] {
    const cornerPoints: Point[] = [];
    const center = this.hexToPixel(h);
    for (const i of HexLayout.corners) {
      const offset = this.hexCornerOffset(i);
      cornerPoints.push(new Point(center.x + offset.x, center.y + offset.y));
    }
    return cornerPoints;
  }
}
