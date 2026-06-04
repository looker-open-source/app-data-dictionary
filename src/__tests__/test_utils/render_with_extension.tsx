// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

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
