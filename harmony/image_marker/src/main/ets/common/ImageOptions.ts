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

import { RNImageSRC } from './RNImageSRC'
import { ErrorCode } from './ErrorCode'
import { MarkerError } from './MarkerError'
import { isCoilImg } from './Utils'
import { DefaultConstants } from './DefaultConstants'
import { RNNativeImageMarker } from '@rnoh/react-native-openharmony/generated/turboModules/RNNativeImageMarker'
import request from '@ohos.request';

export class ImageOptions {
  src: RNImageSRC;
  uri?: string;
  scale: number;
  rotate: number;
  alpha: number;

  constructor(options: RNNativeImageMarker.ImageOptions) {
    if (!options.src) {
      throw new MarkerError(ErrorCode.PARAMS_REQUIRED, "image is required");
    }
    let srcMap = this.getImageUri(options.src)
    this.src = new RNImageSRC(srcMap);
    this.uri = String(srcMap.get(ImageOptions.PROP_ICON_URI))
    this.scale = options.scale ? options.scale : DefaultConstants.DEFAULT_SCALE;
    this.rotate = options.rotate ? options.rotate : DefaultConstants.DEFAULT_ROTATE;
    this.alpha = options.alpha ? options.alpha : DefaultConstants.DEFAULT_ALPHA;
  }

  static readonly PROP_ICON_URI: string = "uri";

  getImageUri(src) {
    let srcObj
    if(JSON.parse(JSON.stringify(src)).uri){
      srcObj =JSON.parse(JSON.stringify(src))
    }else{
      srcObj = JSON.parse(src)
    }
    let uri = srcObj.uri
    let url = uri
    if (uri.indexOf("//") > 0) {
      let realUrl = uri.substring(uri.indexOf("//") + 2);
      url = "assets/" + realUrl;
    }
    let map = new Map<string, any>();
    map.set('uri', url)
    map.set('height', srcObj.height)
    map.set('width', srcObj.width)
    map.set('scale', srcObj.scale)
    return map;
  }
}


