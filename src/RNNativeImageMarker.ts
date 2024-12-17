/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';
//import type {ImageMarkOptions,TextMarkOptions} from 'react-native-image-marker'
export interface ImageOptions {
    /**
     * @description image src, local image
     * @example
     * src: require('./images/logo.png')
     */
    src: string;
    /**
     * @description image scale `>0`
     * @defaultValue 1
     * @example
     * scale: 1
     */
    scale?: number;
    /**
     * @description rotate image rotate `0-360`
     * @defaultValue 0
     * @example
     * rotate: 45
     */
    rotate?: number;
    /**
     * @description transparent of background image `0 - 1`
     * @defaultValue 1
     * @example
     * alpha: 0.5
     */
    alpha?: number;
  }
  export enum Position {
    topLeft = 'topLeft',
    topCenter = 'topCenter',
    topRight = 'topRight',
    bottomLeft = 'bottomLeft',
    bottomCenter = 'bottomCenter',
    bottomRight = 'bottomRight',
    center = 'center',
  }
  export interface PositionOptions {
    X?: number | string;
    Y?: number | string;
    position?: Position;
  }
  export enum ImageFormat {
    png = 'png',
    jpg = 'jpg',
    // base64 string
    base64 = 'base64',
  }
  
  export interface ImageMarkOptions {
    /**
     * FIXME: ImageSourcePropType type define bug
     * @description background image options
     * @example
     *  backgroundImage: {
     *    src: require('./images/bg.png'),
     *    scale: 0.5,
     *    rotate: 45,
     *    alpha: 0.5
     *  }
     **/
    backgroundImage: ImageOptions;
    /**
     * @since 1.1.0
     * @deprecated use watermarkImages instead
     * @description watermark image options
     * @example
     *  watermarkImage: {
     *    src: require('./images/logo.png'),
     *    scale: 0.5,
     *    rotate: 45,
     *    alpha: 0.5
     *  }
     */
    watermarkImage?: ImageOptions;
    /**
     * @since 1.1.0
     * @deprecated use watermarkImages instead
     * @description watermark position options
     * @example
     * watermarkPositions: {
     *  X: 10,
     *  Y: 10,
     *  // or
     *  position: Position.center
     * }
     * @note use watermarkImages instead
     */
    watermarkPositions?: PositionOptions; // watermark position options see @PositionOptions
    /**
     * @description image quality `0-1`
     * @defaultValue 1
     * @example
     * quality: 1
     */
    quality?: number;
    /**
     * @description save image name
     * @example
     * filename: 'test'
     **/
    filename?: string;
    /**
     * @description save image format
     * @defaultValue `jpg`
     * @example
     * saveFormat: ImageFormat.jpg
     */
    saveFormat?: ImageFormat;
    /**
     * @deprecated since 1.2.0
     * @description max image size see #49 #42
     * android only
     * **need RN version >= 0.60.0**,  fresco `MaxBitmapSize` [`ImagePipelineConfig.Builder.experiment().setMaxBitmapSize()`](https://github.com/facebook/fresco/blob/08ca5f40cc0b60b4db16d15e45552cafeae39ccb/imagepipeline/src/main/java/com/facebook/imagepipeline/core/ImagePipelineExperiments.java#L282), see [#49](https://github.com/JimmyDaddy/react-native-image-marker/issues/49#issuecomment-535303838)
     * @defaultValue 2048
     * @example
     * maxSize: 2048
     */
    maxSize?: number;
    /**
     * @description watermark images
     * @example
     * watermarkImages: [
     * {
     *  src: require('./images/logo.png'),
     *  scale: 0.5,
     *  rotate: 45,
     *  alpha: 0.5,
     *  position: {
     *    X: 10,
     *    Y: 10,
     *    // or
     *    position: Position.center
     *  }
     * }]
     **/
    watermarkImages: Array<WatermarkImageOptions>;
  }
  export interface WatermarkImageOptions extends ImageOptions {
    position?: PositionOptions;
  }
  export interface TextMarkOptions {
    /**
     * FIXME: ImageSourcePropType type define bug
     * @description background image options
     * @example
     * backgroundImage: {
     *  src: require('./images/logo.png'),
     *  scale: 0.5,
     *  rotate: 45,
     *  alpha: 0.5
     * }
     **/
    backgroundImage: ImageOptions;
    /**
     * @description text options
     * @example
     * watermarkTexts: [
     * {
     *  text: 'hello world',
     *  positionOptions: {
     *    X: 10,
     *    Y: 10,
     *    // or
     *    // position: Position.center
     *  },
     *  style: {
     *    color: '#aacc22',
     *    fontName: 'Arial',
     *    fontSize: 12,
     *    shadowStyle: {
     *      dx: 10,
     *      dy: 10,
     *      radius: 10,
     *      color: '#aacc22'
     *    },
     *    textBackgroundStyle: {
     *      paddingX: 10,
     *      paddingY: 10,
     *      type: TextBackgroundType.stretchX,
     *      color: '#aacc22'
     *    },
     *    underline: true,
     *    strikeThrough: true,
     *    textAlign: 'left',
     *    italic: true,
     *    //or
     *    // skewX: 45,
     *    bold: true,
     *    rotate: 45
     *  }
     * }]
     **/
    watermarkTexts: TextOptions[];
    /**
     * @description image quality `0-100`, `100` is best quality. If you want the quality to have more effect, try to set the image export format to the compressible format `jpg`. see #159
     * @defaultValue 100
     * @example
     * quality: 100
     */
    quality?: number;
    /**
     * @description save image name
     * @example
     * filename: 'test'
     **/
    filename?: string;
    /**
     * @description save image format
     * @defaultValue `jpg`
     * @example
     * saveFormat: ImageFormat.png
     */
    saveFormat?: ImageFormat;
    /**
     * @deprecated since 1.2.0
     * @description max image size see #49 #42
     * android only
     * **need RN version >= 0.60.0**,  fresco `MaxBitmapSize` [`ImagePipelineConfig.Builder.experiment().setMaxBitmapSize()`](https://github.com/facebook/fresco/blob/08ca5f40cc0b60b4db16d15e45552cafeae39ccb/imagepipeline/src/main/java/com/facebook/imagepipeline/core/ImagePipelineExperiments.java#L282), see [#49](https://github.com/JimmyDaddy/react-native-image-marker/issues/49#issuecomment-535303838)
     * @defaultValue 2048
     * @example
     * maxSize: 2048
     */
    maxSize?: number;
  }
  export interface TextOptions {
    /**
     * @description text content
     * @example
     * text: 'hello world'
     **/
    text: string;
    /**
     * @deprecated since 1.2.4 use position instead
     * @description text position options
     * @example
     *  positionOptions: {
     *   X: 10,
     *   Y: 10,
     *   // or
     *   // position: Position.center
     * }
     */
    positionOptions?: PositionOptions;
  
    /**
     * @description text position options
     * @example
     *  positionOptions: {
     *   X: 10,
     *   Y: 10,
     *   // or
     *   // position: Position.center
     * }
     */
    position?: PositionOptions;
  
    /**
     * @description text style
     * @example
     * style: {
     *  color: '#aacc22',
     *  fontName: 'Arial',
     *  fontSize: 12,
     *  shadowStyle: {
     *    dx: 10,
     *    dy: 10,
     *    radius: 10,
     *    color: '#aacc22'
     *  },
     *  textBackgroundStyle: {
     *    paddingX: 10,
     *    paddingY: 10,
     *    type: TextBackgroundType.stretchX,
     *    color: '#aacc22'
     *  },
     *  underline: true,
     *  strikeThrough: true,
     *  textAlign: 'left',
     *  italic: true,
     *  // or
     *  // skewX: 45,
     *  bold: true,
     *  rotate: 45
     * }
     */
    style?: TextStyle;
  }
  export interface ShadowLayerStyle {
    /**
     * @description shadow offset x
     * @example
     *  dx: 10
     */
    dx: number;
    /**
     * @description shadow offset y
     * @example
     *  dy: 10
     **/
    dy: number;
    /**
     * @description shadow radius
     * @example
     *  radius: 10
     **/
    radius: number;
    /**
     * @description shadow color
     * @example
     * color: '#aacc22'
     **/
    color: string;
  }
  interface Padding {
    /**
     * @description padding for text background
     * @example
     * padding: 10
     * // or
     * padding: '10%'
     * // or
     * padding: '10% 20%'
     * // or
     * padding: '10% 20% 30%'
     * // or
     * padding: '10% 20% 30% 40%'
     * // or
     * padding: '10 20% 30 40%'
     * // or
     * padding: '10 20 30'
     */
    padding?: number | string;
    /**
     * @description padding left for text background
     * @example
     * paddingLeft: 10
     * // or
     * paddingLeft: '10%'
     */
    paddingLeft?: number | string;
    /**
     * @description padding top for text background
     * @example
     * paddingTop: 10
     * // or
     * paddingTop: '10%'
     */
    paddingRight?: number | string;
    /**
     * @description padding right for text background
     * @example
     * paddingRight: 10
     * // or
     * paddingRight: '10%'
     */
    paddingTop?: number | string;
    /**
     * @description padding bottom for text background
     * @example
     * paddingBottom: 10
     * // or
     * paddingBottom: '10%'
     */
    paddingBottom?: number | string;
    /**
     * @description padding left and right (horizontal) for text background
     * @example
     * paddingHorizontal: 10
     * // or
     * paddingHorizontal: '10%'
     * @since 2.0.0
     **/
    paddingHorizontal?: number | string;
    /**
     * @description padding top and bottom (vertical) for text background
     * @example
     * paddingVertical: 10
     * // or
     * paddingVertical: '10%'
     * @since 2.0.0
     */
    paddingVertical?: number | string;
  
    /**
     * @description padding x, alias of paddingHorizontal
     * @example
     * paddingX: 10
     * // or
     * paddingX: '10%'
     **/
    paddingX?: number | string;
  
    /**
     * @description padding y, alias of paddingVertical
     * @example
     * paddingY: 10
     * // or
     * paddingY: '10%'
     **/
    paddingY?: number | string;
  }
  export enum TextBackgroundType {
    stretchX = 'stretchX',
    stretchY = 'stretchY',
    none = 'fit',
  }
  export interface TextBackgroundStyle extends Padding {
    /**
     * @description background type
     * @defaultValue TextBackgroundType.stretchX
     * @example
     *  type: TextBackgroundType.stretchX
     **/
    type?: TextBackgroundType | null;
    /**
     * @description background color
     * @example
     * color: '#aacc22'
     **/
    color: string;
  
    /**
     * @description background corner radius
     * @example
     * cornerRadius: {
     *  topLeft: {
     *    x: '10%',
     *    y: 10,
     *  },
     *  topRight: {
     *    x: 10,
     *    y: 10,
     *  },
     *  bottomLeft: {
     *    x: 10,
     *    y: 10,
     *  },
     *  bottomRight: {
     *    x: '10%',
     *    y: 10,
     *  },
     * }
     **/
    cornerRadius?: CornerRadius;
  }
  export interface RadiusValue {
    x: number | string;
    y: number | string;
  }
  
  export interface CornerRadius {
    topLeft?: RadiusValue;
    topRight?: RadiusValue;
    bottomLeft?: RadiusValue;
    bottomRight?: RadiusValue;
    all?: RadiusValue;
  }
  export interface TextStyle {
    /**
     * @description font color
     * @example
     *  color: '#aacc22'
     */
    color?: string;
    /**
     * @description font name
     * @example
     *  fontName: 'Arial'
     */
    fontName?: string;
    /**
     * @description font size, Android use `sp`, iOS use `pt`
     * @example
     *  fontSize: 12
     */
    fontSize?: number;
    /**
     * @description text shadow style
     * @example
     *  shadowStyle: {
     *    dx: 10,
     *    dy: 10,
     *    radius: 10,
     *    color: '#aacc22'
     *  }
     */
    shadowStyle?: ShadowLayerStyle | null;
    /**
     * @description text background style
     * @example
     *  textBackgroundStyle: {
     *    paddingX: 10,
     *    paddingY: 10,
     *    type: TextBackgroundType.stretchX,
     *    color: '#aacc22'
     *  }
     */
    textBackgroundStyle?: TextBackgroundStyle | null;
    /**
     * @description text underline style
     * @defaultValue false
     * @example
     *  underline: true
     */
    underline?: boolean;
    /**
     * @description css italic with degree, you can use italic instead
     * @example
     *  skewX: 45
     */
    skewX?: number;
    /**
     * @description text stroke
     * @defaultValue false
     * @example
     *  strikeThrough: true
     */
    strikeThrough?: boolean;
    /**
     * @description text align
     * @defaultValue 'left'
     * @example
     *  textAlign: 'left'
     */
    textAlign?: 'left' | 'center' | 'right';
    /**
     * @description text italic
     * @defaultValue false
     * @example
     *  italic: true
     */
    italic?: boolean;
    /**
     * @description text bold
     * @defaultValue false
     * @example
     *  bold: true
     */
    bold?: boolean;
    /**
     * @description rotate text
     * @defaultValue 0
     * @example
     *  rotate: 45
     */
    rotate?: number;
  }
export interface Spec extends TurboModule {
  markWithText: (options: TextMarkOptions) => Promise<string>;
  markWithImage: (options: ImageMarkOptions) => Promise<string>;
} 
 
export default TurboModuleRegistry.get<Spec>('RNNativeImageMarker') as Spec;