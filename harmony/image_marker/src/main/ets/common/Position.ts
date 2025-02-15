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
import { DefaultConstants } from "./DefaultConstants";

export class Position {
  constructor(public x: number, public y: number) {
  }

  static getTextPosition(
    position: string | null | undefined,
    width: number,
    height: number,
    textWidth: number,
    textHeight: number
  ): Position {
    let margin = DefaultConstants.DEFAULT_MARGIN;
    if (position === null) {
      return new Position(margin, margin);
    }
    switch (position) {
      case "topCenter":
        return new Position(
          (width - textWidth) / 2,
          margin
        );
      case "topRight":
        return new Position(
          width - textWidth - margin,
          margin
        );
      case "center":
        return new Position(
          (width - textWidth) / 2,
          (height - textHeight) / 2
        );
      case "bottomLeft":
        return new Position(
          margin,
          height - textHeight - margin
        );
      case "bottomCenter":
        return new Position(
          (width - textWidth) / 2,
          height - textHeight - margin
        );
      case "bottomRight":
        return new Position(
          width - textWidth - margin,
          height - textHeight - margin
        );
      default:
      // topLeft
        return new Position(
          margin,
          margin
        );
    }
  }

  static getImageRectFromPosition(
    position: string | null,
    maxWidth: number,
    maxHeight: number,
    imageWidth: number,
    imageHeight: number
  ): Position {
    let margin = DefaultConstants.DEFAULT_MARGIN;
    const pos = new Position(margin, margin);
    if (position === null) {
      return pos;
    }
    switch (position) {
      case "topCenter":
        pos.x = (maxWidth - imageWidth) / 2;
        break;
      case "topRight":
        pos.x = maxWidth - margin - imageWidth;
        break;
      case "center":
        pos.x = maxWidth / 2 - imageWidth / 2;
        pos.y = maxHeight / 2 - imageHeight / 2;
        break;
      case "bottomLeft":
        pos.y = maxHeight - imageHeight - margin;
        break;
      case "bottomRight":
        pos.x = maxWidth - imageWidth - margin;
        pos.y = maxHeight - imageHeight - margin;
        break;
      case "bottomCenter":
        pos.x = (maxWidth - imageWidth) / 2;
        pos.y = maxHeight - imageHeight - margin;
        break;
      default:
        break;
    }
    return pos;
  }
}