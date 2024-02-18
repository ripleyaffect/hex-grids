export class HexOrientation {
  static pointy: HexOrientation = new HexOrientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
  static flat: HexOrientation = new HexOrientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);

  constructor(
    public f0: number,
    public f1: number,
    public f2: number,
    public f3: number,
    public b0: number,
    public b1: number,
    public b2: number,
    public b3: number,
    public start_angle: number
  ) { }
}
