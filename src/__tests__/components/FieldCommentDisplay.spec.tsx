// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithExtensionContext } from '../test_utils/render_with_extension'
import { FieldCommentDisplay } from '../../components/FieldCommentDisplay'

describe('<FieldCommentDisplay>', () => {
  it('renders correctly', () => {
    renderWithExtensionContext(
      <FieldCommentDisplay
        authorData={{
          display_name: 'Mr. Foo Bar',
          first_name: 'Foo',
          last_name: 'Bar',
          avatar_url: 'imgsrv.com/foo/bar',
        }}
        comment={{
          pk: 'timestamp::author',
          author: 1,
          content: 'This is my comment.',
          timestamp: 7171717171,
          edited: false,
        }}
        showDetails={() => ''}
        toggleEdit={jest.fn()}
        openDialog={jest.fn()}
      />
    )
    expect(screen.getByText(/FB/)).toBeInTheDocument()
    expect(screen.getByText(/Mr. Foo Bar/)).toBeInTheDocument()
    expect(screen.getByText(/3\/25\/1970, 12:08:37 AM/)).toBeInTheDocument()
    expect(screen.getByText(/This is my comment./)).toBeInTheDocument()
  })
})
