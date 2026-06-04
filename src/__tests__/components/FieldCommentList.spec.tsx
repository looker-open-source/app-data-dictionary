// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import renderer from 'react-test-renderer'
import { theme } from '@looker/components'
import { ThemeProvider } from 'styled-components'
import { FieldCommentList } from '../../components/FieldCommentList'

jest.mock('../../components/FieldComment', () => ({
  FieldComment: () => 'FieldComment',
}))

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <FieldCommentList
          sortedComments={[]}
          addComment={jest.fn()}
          editComment={jest.fn()}
          deleteComment={jest.fn()}
          explore={{}}
          field={{}}
          commentAuthors={[]}
          me={{}}
          permissions={{}}
        />
      </ThemeProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
