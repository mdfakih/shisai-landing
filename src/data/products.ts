/** Product catalogue. Images are WebP, cropped from the original shots. */
export interface Product {
  name: string;
  sizes: string;
  grades: string;
  finish: string;
  description: string;
  images: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  /** Short line for cards and the home page. */
  blurb: string;
  sizeRange: string;
  products: Product[];
}

import bend5inch1 from '@/assets/products/sanitary-elbow-90-degree-500x500.webp';
import bend5inch2 from '@/assets/products/5-inch-stainless-steel-bend-500x500.webp';
import bend5inch3 from '@/assets/products/stainless-steel-elbow-dairy-bend-500x500.webp';
import bend4inch1 from '@/assets/products/4-inch-stainless-steel-bend-500x500.webp';
import bend4inch2 from '@/assets/products/4-inch-stainless-steel-bend-500x500(1).webp';
import bend4inch3 from '@/assets/products/4-inch-stainless-steel-bend-500x500(2).webp';
import bend3inch1 from '@/assets/products/3-inch-stainless-steel-bend-500x500.webp';
import bend3inch2 from '@/assets/products/3-inch-stainless-steel-bend-500x500(1).webp';
import bend3inch3 from '@/assets/products/stainless-steel-tee-500x500.webp';
import tcBend1 from '@/assets/products/tc-end-dairy-band-500x500.webp';
import tcBend2 from '@/assets/products/stainless-steel-tc-bend-500x500.webp';
import tcBend3 from '@/assets/products/stainless-steel-tc-bend-500x500(1).webp';
import bend15inch1 from '@/assets/products/1-5-inch-stainless-steel-bend-500x500.webp';
import bend15inch2 from '@/assets/products/1-5-inch-stainless-steel-bend-500x500(1).webp';
import ferrule5inch1 from '@/assets/products/img-20220418-wa0007-jpg-500x500.webp';
import ferruleSocket1 from '@/assets/products/ss-socket-weld-tc-ferrule-500x500.webp';
import ferruleSocket2 from '@/assets/products/ss-socket-weld-tc-ferrule-500x500(1).webp';
import ferruleOrbital1 from '@/assets/products/stainless-steel-tc-ferrule-500x500.webp';
import ferruleOrbital2 from '@/assets/products/stainless-steel-tc-ferrule-500x500(1).webp';
import elbow4inch1 from '@/assets/products/4-inch-90-degree-stainless-steel-elbow-500x500.webp';
import elbow4inch2 from '@/assets/products/4-inch-90-degree-stainless-steel-elbow-500x500(1).webp';
import elbow3inch1 from '@/assets/products/sanitary-elbow-45-degree-500x500.webp';
import elbow3inch2 from '@/assets/products/3-inch-90-degree-stainless-steel-elbow-500x500.webp';
import clamp4inch1 from '@/assets/products/stainless-steel-tri-clover-clamp-500x500.webp';
import clamp4inch2 from '@/assets/products/stainless-steel-tri-clover-clamp-500x500(1).webp';
import clamp3inch1 from '@/assets/products/stainless-steel-tri-clover-clamps-tc-clamp-500x500.webp';
import clamp3inch2 from '@/assets/products/3-inch-stainless-steel-tri-clover-clamp-500x500.webp';
import pipeClamp3inch1 from '@/assets/products/sanitary-pipe-holding-clamp-500x500.webp';
import pipeClamp3inch2 from '@/assets/products/3-inch-stainless-steel-pipe-holding-clamp-500x500.webp';
import pipeClamp4inch1 from '@/assets/products/base-plate-500x500.webp';
import pipeClamp4inch2 from '@/assets/products/4-inch-stainless-steel-pipe-holding-clamp-500x500.webp';
import tee2inch1 from '@/assets/products/sanitary-equal-tee-500x500.webp';
import tee2inch2 from '@/assets/products/stainless-steel-tee-500x500(1).webp';
import tcTee1 from '@/assets/products/2-inch-tri-clamp-tee-500x500.webp';
import tcTee2 from '@/assets/products/stainless-steel-tc-tee-500x500.webp';
import tee4inch1 from '@/assets/products/img-20220418-wa0010-jpg-500x500.webp';
import tee4inch2 from '@/assets/products/stainless-steel-tri-clover-end-tee-ss-tc-tee-500x500.webp';
import spool5inch1 from '@/assets/products/stainless-steel-tri-clover-spools-tc-spools-500x500.webp';
import spool5inch2 from '@/assets/products/stainless-steel-spools-500x500.webp';

export const productCategories: ProductCategory[] = [
  {
    id: 'elbows-bends',
    name: 'Elbows & Bends',
    description:
      'High-quality stainless steel elbows and bends for directional changes in piping systems',
    blurb: 'EP and tri-clamp bends, 45° to 180°, for clean directional changes.',
    sizeRange: '½" – 6"',
    products: [
      {
        name: '90° EP Bends',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          '90-degree EP bends for smooth directional changes in sanitary piping systems.',
        images: [bend5inch1, bend5inch2, bend5inch3],
      },
      {
        name: '45° EP Bends',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          '45-degree EP bends designed for gradual directional changes in piping applications.',
        images: [bend4inch1, bend4inch2, bend4inch3],
      },
      {
        name: '180° EP Bends',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          '180-degree EP bends for complete flow reversal in sanitary piping systems.',
        images: [bend3inch1, bend3inch2, bend3inch3],
      },
      {
        name: '90° Tri Clamp (TC) Bends',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          '90-degree TC bends with tri-clamp connections for easy installation and maintenance.',
        images: [tcBend1, tcBend2, tcBend3],
      },
      {
        name: '45° Tri Clamp (TC) Bends',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          '45-degree TC bends with tri-clamp connections for gradual directional changes.',
        images: [elbow4inch1, elbow4inch2],
      },
      {
        name: '180° Tri Clamp (TC) Bends',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          '180-degree TC bends with tri-clamp connections for complete flow reversal.',
        images: [bend15inch1, bend15inch2],
      },
    ],
  },
  {
    id: 'ferrules',
    name: 'Ferrules',
    description:
      'Precision-engineered ferrules for secure, sanitary pipe connections',
    blurb: 'Butt-weld, socket-weld, threaded and long ferrules plus TC spools.',
    sizeRange: '½" – 20"',
    products: [
      {
        name: 'Butt-Weld Ferrules',
        sizes: '1/2" TO 20"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Butt-weld ferrules for permanent, high-strength connections in sanitary piping systems.',
        images: [ferrule5inch1],
      },
      {
        name: 'Socket Weld Ferrules',
        sizes: '1/2" TO 20"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, GLOSSY',
        description:
          'Socket weld ferrules allowing secure, weldable connections in sanitary piping systems.',
        images: [ferruleSocket1, ferruleSocket2],
      },
      {
        name: 'Threaded Ferrules',
        sizes: '1/2" TO 20"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Threaded ferrules for easy assembly and disassembly in sanitary applications.',
        images: [ferruleOrbital1, ferruleOrbital2],
      },
      {
        name: 'Long Ferrules',
        sizes: '1/2" TO 20"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Extended length ferrules for specialized piping configurations.',
        images: [ferruleOrbital1],
      },
      {
        name: 'Customize Ferrules',
        sizes: 'Custom',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Custom-designed ferrules tailored to specific application requirements.',
        images: [ferruleSocket1],
      },
      {
        name: 'Tri Clamp (TC) Spools',
        sizes: '1/2" TO 20"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'TC spools for extending pipe lengths with easy tri-clamp connections.',
        images: [spool5inch1, spool5inch2],
      },
    ],
  },
  {
    id: 'tees',
    name: 'Tees',
    description:
      'Flow distribution fittings for splitting or combining flow directions',
    blurb: 'Equal and unequal tees, EP and TC, plus multi-port manifolds.',
    sizeRange: '½" – 6"',
    products: [
      {
        name: 'Equal EP Tee',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Equal EP tee for evenly splitting or combining flow in sanitary piping systems.',
        images: [tee2inch1, tee2inch2],
      },
      {
        name: 'Unequal EP Tee',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Unequal EP tee for connecting pipes of different sizes in branching applications.',
        images: [tcTee1, tcTee2],
      },
      {
        name: 'Equal Tri Clamp (TC) Tee',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Equal TC tee with tri-clamp connections for easy assembly and maintenance.',
        images: [tee4inch1, tee4inch2],
      },
      {
        name: 'Unequal Tri Clamp (TC) Tee',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Unequal TC tee with tri-clamp connections for different sized pipe connections.',
        images: [tee2inch1],
      },
      {
        name: 'EP Manifolds',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'EP manifolds for multiple port distribution in complex piping systems.',
        images: [tcTee2],
      },
      {
        name: 'Tri Clamp (TC) Manifolds',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'TC manifolds with tri-clamp connections for multi-port applications.',
        images: [tee4inch2],
      },
    ],
  },
  {
    id: 'reducers',
    name: 'Reducers',
    description:
      'Transition fittings for connecting pipes of different sizes',
    blurb: 'Concentric and eccentric reducers in standard and glass-shape profiles.',
    sizeRange: '½" – 6"',
    products: [
      {
        name: 'EP Concentric Reducer',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Concentric EP reducer for smooth size transitions with centered flow path.',
        images: [bend4inch1],
      },
      {
        name: 'EP Eccentric Reducer',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Eccentric EP reducer for size transitions with offset flow path to prevent air pockets.',
        images: [bend3inch2],
      },
      {
        name: 'EP Concentric Reducer - Glass Shape',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Glass-shaped concentric EP reducer for specialized applications requiring smooth transitions.',
        images: [bend5inch2],
      },
      {
        name: 'EP Eccentric Reducer - Glass Shape',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Glass-shaped eccentric EP reducer for applications requiring offset flow paths.',
        images: [bend4inch3],
      },
      {
        name: 'Tri Clamp (TC) Concentric Reducer',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Concentric TC reducer with tri-clamp connections for easy installation.',
        images: [tcBend2],
      },
      {
        name: 'Tri Clamp (TC) Eccentric Reducer',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Eccentric TC reducer with tri-clamp connections for offset size transitions.',
        images: [tcBend3],
      },
      {
        name: 'Tri Clamp (TC) Concentric Reducer - Glass Shape',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Glass-shaped concentric TC reducer for specialized tri-clamp applications.',
        images: [elbow3inch1],
      },
      {
        name: 'Tri Clamp (TC) Eccentric Reducer - Glass Shape',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Glass-shaped eccentric TC reducer for specialized offset applications.',
        images: [elbow3inch2],
      },
    ],
  },
  {
    id: 'clamps',
    name: 'Clamps',
    description:
      'Essential clamps and supports for secure, sanitary pipe connections',
    blurb: 'Tri Clover® TC clamps, pipe holding clamps, C/U clamps and base plates.',
    sizeRange: '½" – 6"',
    products: [
      {
        name: 'TC Clamp',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316',
        finish: 'MATT, GLOSSY',
        description:
          'Tri-clamp clamps ensuring secure, leak-proof seals in sanitary piping systems.',
        images: [clamp4inch1, clamp4inch2],
      },
      {
        name: 'Pipe Clamp',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316',
        finish: 'POLISHED',
        description:
          'Pipe holding clamps for supporting and stabilizing pipes in sanitary systems.',
        images: [pipeClamp3inch1, pipeClamp3inch2],
      },
      {
        name: 'C-Clamp',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316',
        finish: 'POLISHED',
        description:
          'C-shaped clamps for versatile pipe support and mounting applications.',
        images: [clamp3inch1, clamp3inch2],
      },
      {
        name: 'U-Clamp',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316',
        finish: 'POLISHED',
        description:
          'U-shaped clamps for secure pipe mounting and support in various configurations.',
        images: [pipeClamp4inch1],
      },
      {
        name: 'Base Plate',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316',
        finish: 'POLISHED',
        description:
          'Base plates for floor mounting and support of piping systems.',
        images: [pipeClamp4inch2],
      },
      {
        name: 'Split Clamps',
        sizes: '1/2" TO 6"',
        grades: 'SS304, SS316',
        finish: 'POLISHED',
        description:
          'Split clamps for easy installation around existing pipes without disconnection.',
        images: [clamp4inch1],
      },
    ],
  },
  {
    id: 'flanges',
    name: 'Flanges',
    description:
      'High-strength flanged connections for permanent pipe joints',
    blurb: 'Weld neck, slip-on, blind and threaded flanges for permanent joints.',
    sizeRange: '½" – 12"',
    products: [
      {
        name: 'Weld Neck Flanges',
        sizes: '1/2" TO 12"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Weld neck flanges providing strong, permanent connections for high-pressure applications.',
        images: [bend5inch3],
      },
      {
        name: 'Slip-On Flanges',
        sizes: '1/2" TO 12"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Slip-on flanges for easy installation and moderate pressure applications.',
        images: [bend4inch2],
      },
      {
        name: 'Blind Flanges',
        sizes: '1/2" TO 12"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Blind flanges for closing pipe ends and providing access points for maintenance.',
        images: [bend3inch3],
      },
      {
        name: 'Threaded Flanges',
        sizes: '1/2" TO 12"',
        grades: 'SS304, SS316, SS316L',
        finish: 'MATT, MIRROR',
        description:
          'Threaded flanges for applications where welding is not preferred or possible.',
        images: [tcBend1],
      },
    ],
  },
];

export const findCategory = (id: string | null | undefined): ProductCategory | undefined =>
  productCategories.find((c) => c.id === id);

export const allProductNames = (): string[] =>
  productCategories.flatMap((c) => c.products.map((p) => p.name));
