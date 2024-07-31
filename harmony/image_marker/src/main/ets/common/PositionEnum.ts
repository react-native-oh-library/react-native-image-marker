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

export enum PositionEnum {
  TOP_LEFT = "topLeft",
  TOP_CENTER = "topCenter",
  TOP_RIGHT = "topRight",
  CENTER = "center",
  BOTTOM_LEFT = "bottomLeft",
  BOTTOM_CENTER = "bottomCenter",
  BOTTOM_RIGHT = "bottomRight"
}

export namespace PositionEnum {
  export function getPosition(position: string | null | undefined): PositionEnum {
    switch (position) {
      case "topLeft":
        return PositionEnum.TOP_LEFT;
      case "topCenter":
        return PositionEnum.TOP_CENTER;
      case "topRight":
        return PositionEnum.TOP_RIGHT;
      case "center":
        return PositionEnum.CENTER;
      case "bottomLeft":
        return PositionEnum.BOTTOM_LEFT;
      case "bottomCenter":
        return PositionEnum.BOTTOM_CENTER;
      default:
        return PositionEnum.BOTTOM_RIGHT;
    }
  }
}