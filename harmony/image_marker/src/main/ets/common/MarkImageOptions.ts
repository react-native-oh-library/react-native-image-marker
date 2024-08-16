/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Options } from './Options';
import { RNNativeImageMarker } from '@rnoh/react-native-openharmony/generated/turboModules/RNNativeImageMarker'
import { MarkerError } from './MarkerError';
import { ErrorCode } from './ErrorCode';
import { ImageOptions } from './ImageOptions';
import { Position } from './Position';
import { DefaultConstants } from './DefaultConstants';
import { handleDynamicToString, isCoilImg, getPixelMap,parseSpreadValue } from './Utils'
import WatermarkImageOptions from './WatermarkImageOptions';
import { drawing } from '@kit.ArkGraphics2D';

export class MarkImageOptions extends Options {
  watermarkImages: WatermarkImageOptions[];

  constructor(options: RNNativeImageMarker.ImageMarkOptions) {
    super(options);
    const markerImageOpts = options['watermarkImage'];
    const markerImagesOpts = options['watermarkImages'];
    if ((!markerImagesOpts || markerImagesOpts.length <= 0) && !markerImageOpts) {
      throw new MarkerError(
        ErrorCode.PARAMS_REQUIRED,
        "marker image is required"
      );
    }
    const myMarkerList: WatermarkImageOptions[] = [];
    if (markerImagesOpts && markerImagesOpts.length > 0) {
      for (let i = 0; i < markerImagesOpts.length; i++) {
        let opts = markerImagesOpts[i];
        const marker = new ImageOptions(opts);
        const positionOptions = opts.position || null;
        const x = positionOptions && positionOptions['X'] ? handleDynamicToString(positionOptions['X']) : null;
        const y = positionOptions && positionOptions['Y'] ? handleDynamicToString(positionOptions['Y']) : null;
        const markerOpts = new WatermarkImageOptions(marker, x, y, positionOptions)
        myMarkerList.push(markerOpts);
      }
    }

    if (markerImageOpts) {
      const marker = new ImageOptions(markerImageOpts);
      const positionOptions = options['watermarkPositions'] || null;
      const x = positionOptions && positionOptions['X'] ? handleDynamicToString(positionOptions['X']) : null;
      const y = positionOptions && positionOptions['Y'] ? handleDynamicToString(positionOptions['Y']) : null;
      const markerOpts = new WatermarkImageOptions(marker, x, y, positionOptions);
      myMarkerList.push(markerOpts);
    }
    this.watermarkImages = myMarkerList;
  }

  async applyStyle(canvas: drawing.Canvas, resoureManger, maxWidth: number,
    maxHeight: number) {
    if (this.watermarkImages.length > 0) {
      for (let index = 0; index < this.watermarkImages.length; index++) {
        canvas.save()
        const markImage = this.watermarkImages[index];
        let imageWidth = markImage.imageOption.src.width * markImage.imageOption.src.scale
        let imageHeight = markImage.imageOption.src.height * markImage.imageOption.src.scale
        let markerPixelMap = await getPixelMap(resoureManger, markImage.imageOption, false)
        let position
        if (markImage.positionEnum != null) {
          position =
            Position.getImageRectFromPosition(markImage.positionEnum, DefaultConstants.DEFAULT_MARGIN,
              maxWidth, maxHeight, imageWidth,
              imageHeight)
        } else if (markImage.x && markImage.y) {
          let x = parseSpreadValue(markImage.x,maxWidth)
          let y = parseSpreadValue(markImage.y,maxHeight)
          position = { "x":x , "y":y }
        }else{
          position =
            Position.getImageRectFromPosition(markImage.positionEnum, DefaultConstants.DEFAULT_MARGIN,
              maxWidth, maxHeight, imageWidth,
              imageHeight)
        }
        if (markImage.imageOption.rotate != 0) {
          let x = (position.x + (position.x + imageWidth)) / 2
          let y = (position.y + (position.y + imageHeight)) / 2
          canvas.rotate(markImage.imageOption.rotate, x, y)
        }
        canvas.drawImage(markerPixelMap, position.x, position.y)
        canvas.restore()
      }
    }
  }
}