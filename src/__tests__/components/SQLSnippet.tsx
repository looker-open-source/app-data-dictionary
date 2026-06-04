// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import renderer from 'react-test-renderer'
import { theme } from '@looker/components'
import { ThemeProvider } from 'styled-components'

import { SQLSnippet } from '../../components/SQLSnippet'

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <SQLSnippet isRow={false} src={'SELECT * from users;'} />)
      </ThemeProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
