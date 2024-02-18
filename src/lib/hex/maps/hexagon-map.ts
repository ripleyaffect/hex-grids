import { HexMap } from '~/lib/hex/maps/index';
import { Hex } from '~/lib/hex';

type TestData = {
  color: string;
};

export class HexagonHexMap extends HexMap<TestData> {
  constructor(
    size: number,
    getHexColor: (hex: Hex) => string = () => 'gray'
  ) {
    super();

    for (let q = -size; q <= size; q++) {
      const r1 = Math.max(-size, -q - size);
      const r2 = Math.min(size, -q + size);
      for (let r = r1; r <= r2; r++) {
        const hex = new Hex(q, r, -q - r);
        this.set(hex, { color: getHexColor(hex) });
      }
    }
  }
}
