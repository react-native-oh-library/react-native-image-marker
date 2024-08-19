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

export class Position {
  constructor(public x: number, public y: number) {
  }

  static getTextPosition(
    position: string | null | undefined,
    margin: number,
    width: number,
    height: number,
    textWidth: number,
    textHeight: number
  ): Position {
    if (!position) {
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
          width - textWidth,
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
          textHeight + margin
        );
    }
  }

  static getImageRectFromPosition(
    position: string | null,
    margin: number,
    maxWidth: number,
    maxHeight: number,
    imageWidth: number,
    imageHeight: number
  ): Position {
    let left = margin;
    let top = margin;
    const pos = new Position(left, top);
    if (position === null) {
      return pos;
    }
    switch (position) {
      case "topCenter":
        left = maxWidth / 2 - imageWidth / 2;
        pos.x = left;
        break;
      case "topRight":
        pos.x = maxWidth - margin - imageWidth;
        break;
      case "center":
        left = maxWidth / 2 - imageWidth / 2;
        top = maxHeight / 2 - imageHeight / 2;
        pos.x = left;
        pos.y = top;
        break;
      case "bottomLeft":
        top = maxHeight - imageHeight;
        pos.y = top - margin;
        break;
      case "bottomRight":
        top = maxHeight - imageHeight;
        left = maxWidth - imageWidth - margin;
        pos.x = left;
        pos.y = top - margin;
        break;
      case "bottomCenter":
        top = maxHeight - imageHeight;
        left = maxWidth / 2 - imageWidth / 2;
        pos.x = left - margin;
        pos.y = top - margin;
        break;
      default:
        break;
    }
    return pos;
  }
}