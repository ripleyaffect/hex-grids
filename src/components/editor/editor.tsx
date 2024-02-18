'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HexLayout, HexOrientation, HexMapRenderer, Point } from '~/lib/hex';
import { Slider } from '~/components/ui/slider';
import { HexagonHexMap } from '~/lib/hex/maps/hexagon-map';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/select';
import { Noise } from '~/lib/noise';

import Color from 'color';
import ColorPicker, { useColorPicker } from 'react-best-gradient-color-picker'
import { Car } from 'lucide-react';
import { Card } from '~/components/ui/card';


export const HexEditor = ({
  width = 700,
  height = 700,
}: {
  width?: number;
  height?: number;
}) => {
  const [gridSize, setGridSize] = useState(20);
  const [hexSize, setHexSize] = useState(10);
  const [orientation, setOrientation] = useState<'flat' | 'pointy'>('pointy');
  const [shape, setShape] = useState<'hexagon' | 'circle'>('hexagon');

  const [noiseScale, setNoiseScale] = useState(0.04);
  const [noiseOffsetX, setNoiseOffsetX] = useState(0);
  const [noiseOffsetY, setNoiseOffsetY] = useState(0);
  const [color, setColor] = useState('linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(255,255,255,1) 100%)');
  const { getGradientObject } = useColorPicker(color, setColor);

  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const layout = useMemo(
    () => {
      return new HexLayout(
        orientation === 'pointy' ? HexOrientation.pointy : HexOrientation.flat,
        new Point(hexSize, hexSize),
        new Point(width / 2, height / 2),
      );
    },
    [
      width,
      height,
      hexSize,
      orientation,
    ]
  );

  const map = useMemo(
    () => new HexagonHexMap(
      gridSize,
      (h) => {
        let p = layout.hexToPixel(h);
        let n = Noise.perlin2(
          (p.x + noiseOffsetX) * noiseScale,
          (p.y + noiseOffsetY) * noiseScale
        ) / 2 + 0.5;
        let l = h.len();
        l /= gridSize;
        l = 1 - l;
        n *= l;

        const gradient = getGradientObject();
        if (!gradient) return 'black';

        const colors = gradient.colors;

        let colorMix = {
          left:  { ...colors[0] },
          right: { ...colors[0] },
        }

        const nh = Math.ceil(n * 100);
        // Calculate color based on gradient
        for (let i = 0; i < colors.length; i++) {
          colorMix.left = colorMix.right;
          colorMix.right = { ...colors[i] };
          if (nh >= colorMix.left.left && nh < colorMix.right.left) {
            break;
          }
        }

        const color = new Color(colorMix.left.value)
          .mix(new Color(colorMix.right.value),
            (n - colorMix.left.left / 100) / (colorMix.right.left / 100 - colorMix.left.left / 100)
          );

        return color.hex();
      },
    ),
    [
      gridSize,
      layout,
      noiseScale,
      noiseOffsetX,
      noiseOffsetY,
      color,
    ]
  );

  const renderer = useMemo(
    () => new HexMapRenderer(layout, getGradientObject()?.colors[0].value || 'black'),
    [
      layout,
      color,
    ]
  );

  useEffect(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      renderer.renderMap(
        ctx,
        map,
        shape
      );
    },
    [
      width,
      height,
      map,
      renderer,
      shape,
    ]
  );

  return (
    <>
      <h1 className="text-center text-2xl font-bold mb-4">Hex Map Editor</h1>
      <div className="flex items-start justify-center w-full h-full">
        <div className="flex flex-col justify-start h-full w-[300px] mr-2">
          <div className="mb-2">
            <Label>Orientation</Label>
            <Select
              value={orientation}
              onValueChange={(value) => setOrientation(value as 'flat' | 'pointy')}
            >
              <SelectTrigger>
                {orientation === 'pointy' ? 'Pointy' : 'Flat'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'flat'}>Flat</SelectItem>
                <SelectItem value={'pointy'}>Pointy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-2">
            <Label>Shape</Label>
            <Select
              value={shape}
              onValueChange={(value) => setShape(value as 'hexagon' | 'circle')}
            >
              <SelectTrigger>
                {shape === 'hexagon' ? 'Hexagon' : 'Circle'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'hexagon'}>Hexagon</SelectItem>
                <SelectItem value={'circle'}>Circle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-2">
            <Label>Grid Size</Label>
            <Slider
              min={0}
              max={100}
              value={[gridSize]}
              onValueChange={([value]) => setGridSize(value)}
            />
          </div>
          <div className="mb-2">
            <Label>Hex Size</Label>
            <Slider
              min={1}
              max={25}
              step={0.1}
              value={[hexSize]}
              onValueChange={([value]) => setHexSize(value)}
            />
          </div>

          <div className="mb-2">
            <Label>Noise Scale</Label>
            <Slider
              min={0.000}
              max={0.15}
              step={0.001}
              value={[noiseScale]}
              onValueChange={([value]) => setNoiseScale(value)}
            />
          </div>
          <div className="mb-2">
            <Label>Noise Offset X</Label>
            <Slider
              min={-1000}
              max={1000}
              value={[noiseOffsetX]}
              onValueChange={([value]) => setNoiseOffsetX(value)}
            />
          </div>
          <div className="mb-2">
            <Label>Noise Offset Y</Label>
            <Slider
              min={-1000}
              max={1000}
              value={[noiseOffsetY]}
              onValueChange={([value]) => setNoiseOffsetY(value)}
            />
          </div>
          <div>
            <Label>Colors</Label>
            <ColorPicker
              value={color}
              onChange={setColor}
              height={200}
              hidePresets={true}
              hideInputs={true}
              hideOpacity={true}
              hideEyeDrop={true}
              hideAdvancedSliders={true}
              hideColorGuide={true}
              hideInputType={true}
              hideColorTypeBtns={true}
              hideGradientType={true}
              hideGradientAngle={true}
              hideGradientStop={true}
            />
          </div>
        </div>
        <Card className="overflow-hidden">
          <canvas
            ref={canvasRef}
            id="hex-editor"
            width={width}
            height={height}
          />
        </Card>
      </div>
    </>
  )
}
