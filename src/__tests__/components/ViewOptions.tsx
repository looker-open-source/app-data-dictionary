// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import renderer from 'react-test-renderer'
import { theme } from '@looker/components'
import { ThemeProvider } from 'styled-components'

import { ViewOptions } from '../../components/ViewOptions'
import { columns } from '../../components/DataDictionary'
import { defaultShowColumns } from '../../components/PanelFields'

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <ViewOptions
          columns={columns}
          shownColumns={defaultShowColumns}
          setShownColumns={() => {
            // noop
          }}
        />
        )
      </ThemeProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
