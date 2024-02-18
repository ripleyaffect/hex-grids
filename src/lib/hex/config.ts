import { HexMap } from '~/lib/hex/maps';

export class HexMapConfig<TData = any> {
  populate: (hexMap: HexMap<TData>) => void = () => {};
  render: (ctx: CanvasRenderingContext2D, hexMap: HexMap<TData>) => void = () => {};

  constructor(
    populate: (hexMap: HexMap<TData>) => void,
    render: (ctx: CanvasRenderingContext2D, hexMap: HexMap<TData>) => void,
  ) {
      this.populate = populate;
      this.render = render;
  }

  withPopulate(populate: (hexMap: HexMap<TData>) => void): HexMapConfig<TData> {
    return new HexMapConfig(populate, this.render);
  }

  withRender(render: (ctx: CanvasRenderingContext2D, hexMap: HexMap<TData>) => void): HexMapConfig<TData> {
    return new HexMapConfig(this.populate, render);
  }

  withPopulateAndRender(
    populate: (hexMap: HexMap<TData>) => void,
    render: (ctx: CanvasRenderingContext2D, hexMap: HexMap<TData>) => void,
  ): HexMapConfig<TData> {
    return new HexMapConfig(populate, render);
  }
}
