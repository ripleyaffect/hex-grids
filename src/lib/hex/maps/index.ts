import { Hex } from '../hex';

export abstract class HexMap<TData = any> {
  hexData: Map<Hex, TData> = new Map<Hex, TData>();

  public forEach(callback: (data: TData, hex: Hex) => void): void {
    this.hexData.forEach(callback);
  }

  public has(hex: Hex): boolean {
    return this.hexData.has(hex);
  }

  public get(hex: Hex): TData | null {
    return this.hexData.get(hex) || null;
  }

  public set(hex: Hex, data: TData): void {
    this.hexData.set(hex, data);
  }

  public delete(hex: Hex): void {
    this.hexData.delete(hex);
  }
}
