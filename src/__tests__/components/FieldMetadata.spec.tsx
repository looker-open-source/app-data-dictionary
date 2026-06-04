// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithExtensionContext } from '../test_utils/render_with_extension'
import { FieldMetadata } from '../../components/FieldMetadata'

jest.mock('../../components/DetailDrawerRow', () => ({
  DetailDrawerRow: () => 'DetailDrawerRow',
}))

jest.mock('../../components/QueryChart', () => ({
  QueryChart: () => 'QueryChart',
}))

jest.mock('../../components/ExternalLink', () => ({
  ExternalLink: () => 'ExternalLink',
}))

jest.mock('../../components/FieldCommentList', () => ({
  FieldCommentList: () => 'FieldCommentList',
}))

describe('<FieldMetadata>', () => {
  beforeEach(() => {
    ;(global as any).ResizeObserver = class {
      observe() {
        // noop
      }

      disconnect() {
        // noop
      }
    }
  })
  it('renders correctly', () => {
    renderWithExtensionContext(
      <FieldMetadata
        field={{}}
        columns={[]}
        explore={{}}
        key={''}
        model={{}}
        tab={0}
        detailsPane={jest.fn()}
        commentsPane={jest.fn()}
        sortedComments={[]}
        addComment={jest.fn()}
        editComment={jest.fn()}
        deleteComment={jest.fn()}
        fieldCommentLength={0}
        commentAuthors={[]}
        me={{}}
        permissions={{}}
        canViewComments={true}
      />
    )
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Comments')).toBeInTheDocument()
    expect(screen.getByText('About this Field')).toBeInTheDocument()
    expect(screen.getByText(/QueryChart/)).toBeInTheDocument()
    expect(screen.getByText(/ExternalLink/)).toBeInTheDocument()
  })
})
