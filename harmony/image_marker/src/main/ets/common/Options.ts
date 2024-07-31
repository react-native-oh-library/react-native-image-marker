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

import { ImageOptions } from './ImageOptions';
import { MarkerError } from './MarkerError';
import { ErrorCode } from './ErrorCode';
import { DefaultConstants } from './DefaultConstants';
import { RNNativeImageMarker } from '@rnoh/react-native-openharmony/generated/turboModules/RNNativeImageMarker'
import { getFormat, SaveFormat } from './Utils'

export class Options {
  options: RNNativeImageMarker.TextMarkOptions | RNNativeImageMarker.ImageMarkOptions;
  backgroundImage: ImageOptions;
  quality: number;
  filename?: string;
  saveFormat: SaveFormat;
  maxSize: number;
  scale?: number;
  constructor(options) {
    this.options = options;
    this.backgroundImage = this.options['backgroundImage']
      ? new ImageOptions(this.options['backgroundImage'])
      : (() => {
      throw new MarkerError(ErrorCode.PARAMS_REQUIRED, 'backgroundImage is required');
    })();

    this.quality = this.options['quality'] !== undefined ? this.options['quality'] : DefaultConstants.DEFAULT_QUALITY;
    this.maxSize = this.options['maxSize'] !== undefined ? this.options['maxSize'] : DefaultConstants.DEFAULT_MAX_SIZE;
    this.filename = this.options['filename'] || undefined;
    this.saveFormat = getFormat(this.options['saveFormat']);
    this.scale = this.options['scale']!== undefined ? this.options['quality'] : DefaultConstants.DEFAULT_SCALE;
  }

  static PROP_ICON_URI: string = "uri";

  static checkParams(opts: RNNativeImageMarker.TextMarkOptions | RNNativeImageMarker.ImageMarkOptions,
    reject: (arg0: string, arg1: string, arg2: Error | null) => void): Options | null {
    try {
      return new Options(opts);
    } catch (e) {
      if (e instanceof MarkerError) {
        reject(e.getErrorCode().toString(), e.getErrMsg(),e);
      }
      return null;
    }
  }
}