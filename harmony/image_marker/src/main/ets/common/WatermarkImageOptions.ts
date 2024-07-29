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

import { RNNativeImageMarker } from '@rnoh/react-native-openharmony/generated/turboModules/RNNativeImageMarker'
import { ImageOptions } from './ImageOptions'
import { PositionEnum } from './PositionEnum'
import { handleDynamicToString } from './Utils'

class WatermarkImageOptions {
  imageOption: ImageOptions;
  x: string | null;
  y: string | null;
  positionEnum: PositionEnum | null;

  static createWatermarkImageOptions(options: RNNativeImageMarker.WatermarkImageOptions | null) {
    let imageOption = new ImageOptions(options); // Initialize ImageOptions
    let x = null;
    let y = null;
    let positionOptions = null;
    if (options) {
      imageOption = new ImageOptions(options);
      positionOptions = options.position;
      x = positionOptions && positionOptions.X ? handleDynamicToString(positionOptions.X) : null;
      y = positionOptions && positionOptions.Y ? handleDynamicToString(positionOptions.Y) : null;
    }
    return new WatermarkImageOptions(imageOption, x, y, positionOptions)
  }

  constructor(watermarkImage: ImageOptions, x: string | null, y: string | null,
    position: RNNativeImageMarker.PositionOptions | null) {
    this.imageOption = watermarkImage;
    const positionOptions = position;
    this.x = x
    this.y = y
    this.positionEnum =
      positionOptions && positionOptions.position ? PositionEnum.getPosition(positionOptions.position) : null;
  }

}

export default WatermarkImageOptions;