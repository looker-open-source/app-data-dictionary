// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import * as ReactDOM from 'react-dom'
import { ExtensionProvider40 } from '@looker/extension-sdk-react'
import { Extension } from './components/Extension'

window.addEventListener('DOMContentLoaded', () => {
  const root = document.createElement('div')
  document.body.appendChild(root)
  ReactDOM.render(
    <ExtensionProvider40 chattyTimeout={300000}>
      <Extension />
    </ExtensionProvider40>,
    root
  )
})
