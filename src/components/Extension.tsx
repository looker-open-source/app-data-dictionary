// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { theme } from '@looker/components'
import { ThemeProvider } from 'styled-components'
import { DataDictionary } from './DataDictionary'

export const Extension: React.FC = () => (
  <ThemeProvider theme={theme}>
    <DataDictionary />
  </ThemeProvider>
)
