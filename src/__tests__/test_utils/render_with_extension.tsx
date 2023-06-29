/*

 MIT License

 Copyright (c) 2021 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import type { ReactElement } from 'react'
import React from 'react'
import { renderWithTheme } from '@looker/components-test-utils'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import type { LookerHostData, ExtensionHostApi } from '@looker/extension-sdk'
import { registerHostApi } from '@looker/extension-sdk'
import type { ILooker40SDK } from '@looker/sdk'

const withExtensionContext = (consumer: ReactElement<any>) => {
  const extensionSDK = {
    lookerHostData: {} as Readonly<LookerHostData>,
    error: (_: ErrorEvent) => {
      // noop
    },
  } as ExtensionHostApi
  registerHostApi(extensionSDK)
  const extensionContext: ExtensionContextData40 = {
    extensionSDK,
    coreSDK: {} as ILooker40SDK,
    route: '',
  }
  return (
    <ExtensionContext40.Provider value={extensionContext}>
      {consumer}
    </ExtensionContext40.Provider>
  )
}

export const renderWithExtensionContext = (component: ReactElement<any>) =>
  renderWithTheme(withExtensionContext(component))
