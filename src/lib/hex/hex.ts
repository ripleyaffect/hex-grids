export class Hex {
  coords: [number, number, number];
  id: string;

  public static directionDeltas: Hex[] = [
    new Hex(1, 0, -1),
    new Hex(1, -1, 0),
    new Hex(0, -1, 1),
    new Hex(-1, 0, 1),
    new Hex(-1, 1, 0),
    new Hex(0, 1, -1)
  ];

  public static diagonalDeltas: Hex[] = [
    new Hex(2, -1, -1),
    new Hex(1, -2, 1),
    new Hex(-1, -1, 2),
    new Hex(-2, 1, 1),
    new Hex(-1, 2, -1),
    new Hex(1, 1, -2)
  ];

  // Getters and setters for q, r, and s

  public get q(): number { return this.coords[0] }
  public set q(value: number) { this.coords[0] = value }

  public get r(): number { return this.coords[1] }
  public set r(value: number) { this.coords[1] = value }

  public get s(): number { return this.coords[2] }
  public set s(value: number) { this.coords[2] = value }

  constructor(q: number, r: number, s?: number) {
    if (s === undefined) {
      s = -q - r;
    }
    if (q + r + s !== 0) {
      throw new Error("q + r + s must be 0");
    }
    this.coords = [q, r, s];

    // Cache the string representation of the Hex
    this.id = `${q},${r},${s}`;
  }

  // Operators

  public eq(b: Hex): boolean { return this.equals(b); }
  public equals(b: Hex): boolean {
    return this.q === b.q && this.r === b.r && this.s === b.s;
  }

  public hash(): string {
    return this.id;
  }

  public toString(): string {
    return `Hex(${this.q}, ${this.r}, ${this.s})`;
  }

  // Methods

  public add(b: Hex): Hex {
    return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
  }

  public subtract(b: Hex): Hex {
    return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
  }

  public scale(k: number): Hex {
    return new Hex(this.q * k, this.r * k, this.s * k);
  }

  /**
   * @returns {Hex} - Hex from rotating 60 degrees to the left
   **/
  public rotateLeft(): Hex {
    return new Hex(-this.s, -this.q, -this.r);
  }

  /**
   * @returns {Hex} - Hex from rotating 60 degrees to the left
   **/
  public rotateRight(): Hex {
    return new Hex(-this.r, -this.s, -this.q);
  }

  /**
   * @param {number} direction - Direction to get the Hex in
   * @returns {Hex} - Hex that is in the given direction
   **/
  public static direction(direction: number): Hex {
    if (direction < 0 || direction >= 6) {
      throw new Error("direction must be between 0 and 5");
    }
    return Hex.directionDeltas[direction];
  }

  /**
   * @param {number} direction - Direction to get the neighbor in
   * @returns {Hex} - Hex that is the neighbor in the given direction
   */
  public neighbor(direction: number): Hex {
    return this.add(Hex.direction(direction));
  }

  /**
   * @param {number} direction - Direction to get the diagonal neighbor in
   * @returns {Hex} - Hex that is the diagonal neighbor in the given direction
   */
  public diagonalNeighbor(direction: number): Hex {
    return this.add(Hex.diagonalDeltas[direction]);
  }

  /**
   * @returns {number} - Distance from the origin to this Hex in hex space
   **/
  public len(): number {
    let l = (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
    if (isNaN(l)) {
      console.log(this);
      return 0;
    }
    return l;
  }

  /**
   * @param {Hex} b - Hex to calculate the distance to
   * @returns {number} - Distance between this Hex and Hex b in hex space
   **/
  public distance(b: Hex): number {
    return this.subtract(b).len();
  }

  /**
   * Ensures that the Hex has integer coordinates
   *
   * @returns {Hex} - A new Hex with the same coordinates as this Hex, but rounded
   **/
  public round(): Hex {
    let qi = Math.round(this.q);
    let ri = Math.round(this.r);
    let si = Math.round(this.s);
    let q_diff = Math.abs(qi - this.q);
    let r_diff = Math.abs(ri - this.r);
    let s_diff = Math.abs(si - this.s);
    if (q_diff > r_diff && q_diff > s_diff) {
      qi = -ri - si;
    } else if (r_diff > s_diff) {
      ri = -qi - si;
    } else {
      si = -qi - ri;
    }
    return new Hex(qi, ri, si);
  }

  /**
   * @param b - Hex to lerp to
   * @param t - Value to lerp by [0, 1]
   */
  public lerp(b: Hex, t: number): Hex {
    return new Hex(this.q * (1 - t) + b.q * t, this.r * (1 - t) + b.r * t, this.s * (1 - t) + b.s * t);
  }

  /**
   * Draws a line between this Hex and Hex b
   *
   * @param {Hex} b - Hex to draw a line to
   * @returns {Hex[]} - Array of Hexes that are the line drawn between this Hex and Hex b
   **/
  public linedraw(b: Hex): Hex[] {
    let N = this.distance(b);
    let a_nudge = new Hex(this.q + 1e-6, this.r + 1e-6, this.s - 2e-6);
    let b_nudge = new Hex(b.q + 1e-6, b.r + 1e-6, b.s - 2e-6);
    let results: Hex[] = [];
    let step = 1.0 / Math.max(N, 1);
    for (let i = 0; i <= N; i++) {
      results.push(a_nudge.lerp(b_nudge, step * i).round());
    }
    return results;
  }
}
