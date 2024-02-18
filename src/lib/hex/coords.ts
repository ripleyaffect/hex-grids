import { Hex } from '~/lib/hex/hex';

export class HexOffsetCoord {
  col: number;
  row: number;

  public static EVEN: number = 1;
  public static ODD: number = -1;

  constructor(col: number, row: number) {
    this.col = col;
    this.row = row;
  }

  // Operators

  public eq(b: HexOffsetCoord): boolean { return this.equals(b); }
  public equals(b: HexOffsetCoord): boolean {
    return this.col === b.col && this.row === b.row;
  }

  public hash(): string {
    return `${this.col},${this.row}`;
  }

  public toString(): string {
    return `OffsetCoord(${this.col}, ${this.row})`;
  }

  public static qOffsetFromCube(offset: -1 | 1, h: Hex): HexOffsetCoord {
    if (offset !== HexOffsetCoord.EVEN && offset !== HexOffsetCoord.ODD) {
      throw new Error('offset must be EVEN (+1) or ODD (-1)');
    }

    const col = h.q;
    const row = h.r + (h.q + offset * (h.q & 1)) / 2;

    return new HexOffsetCoord(col, row);
  }

  public static qOffsetToCube(offset: -1 | 1, oc: HexOffsetCoord): Hex {
    if (offset !== HexOffsetCoord.EVEN && offset !== HexOffsetCoord.ODD) {
      throw new Error('offset must be EVEN (+1) or ODD (-1)');
    }

    const q = oc.col;
    const r = oc.row - (oc.col + offset * (oc.col & 1)) / 2;

    return new Hex(q, r);
  }

  public static rOffsetFromCube(offset: -1 | 1, h: Hex): HexOffsetCoord {
    if (offset !== HexOffsetCoord.EVEN && offset !== HexOffsetCoord.ODD) {
      throw new Error('offset must be EVEN (+1) or ODD (-1)');
    }

    const col = h.q + (h.r + offset * (h.r & 1)) / 2;
    const row = h.r;

    return new HexOffsetCoord(col, row);
  }

  public static rOffsetToCube(offset: -1 | 1, oc: HexOffsetCoord): Hex {
    if (offset !== HexOffsetCoord.EVEN && offset !== HexOffsetCoord.ODD) {
      throw new Error('offset must be EVEN (+1) or ODD (-1)');
    }

    const q = oc.col - (oc.row + offset * (oc.row & 1)) / 2;
    const r = oc.row;

    return new Hex(q, r);
  }
}


export class HexDoubledCoord {
  col: number;
  row: number;

  public static EVEN: number = 1;
  public static ODD: number = -1;

  constructor(col: number, row: number) {
    this.col = col;
    this.row = row;
  }

  // Operators

  public eq(b: HexDoubledCoord): boolean { return this.equals(b); }
  public equals(b: HexDoubledCoord): boolean {
    return this.col === b.col && this.row === b.row;
  }

  public hash(): string {
    return `${this.col},${this.row}`;
  }

  public toString(): string {
    return `DoubledCoord(${this.col}, ${this.row})`;
  }

  public static qDoubledFromCube(h: Hex): HexDoubledCoord {
    const col = h.q;
    const row = 2 * h.r + h.q;

    return new HexDoubledCoord(col, row);
  }

  public static qDoubledToCube(dc: HexDoubledCoord): Hex {
    const q = dc.col;
    const r = (dc.row - dc.col) / 2;

    return new Hex(q, r);
  }

  public static rDoubledFromCube(h: Hex): HexDoubledCoord {
    const col = 2 * h.q + h.r;
    const row = h.r;

    return new HexDoubledCoord(col, row);
  }

  public static rDoubledToCube(dc: HexDoubledCoord): Hex {
    const q = (dc.col - dc.row) / 2;
    const r = dc.row;

    return new Hex(q, r);
  }
}
