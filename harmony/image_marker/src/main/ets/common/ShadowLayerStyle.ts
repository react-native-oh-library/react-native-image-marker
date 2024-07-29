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

import {convertHexToArgb} from './Utils'
import { common2D,  } from '@kit.ArkGraphics2D';
import { RNNativeImageMarker } from '@rnoh/react-native-openharmony/generated/turboModules/RNNativeImageMarker'
export class ShadowLayerStyle {
  radius: number;
  dx: number;
  dy: number;
  color:common2D.Color ;

  constructor(shadow: RNNativeImageMarker.ShadowLayerStyle | null | undefined) {
    this.radius = 0;
    this.dx = 0;
    this.dy = 0;
    this.color ;
    if (shadow) {
      try {
        this.setColor(shadow.color);
        this.dx = shadow.dx;
        this.dy = shadow.dy;
        this.radius =shadow.radius;
      } catch (e) {
        throw new Error('Error parsing shadow style options ')
      }
    }
  }

  private setColor(color: string | undefined) {
    try {
      if (color) {
        // Assuming Utils.transRGBColor exists and performs the color transformation
        const parsedColor =convertHexToArgb(color);
        this.color = parsedColor;
      }
    } catch (e) {
      throw new Error('Error parsing color string ')
    }
  }
}