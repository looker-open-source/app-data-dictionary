// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithExtensionContext } from '../test_utils/render_with_extension'
import { CommentIcon } from '../../components/CommentIcon'

describe('<CommentIcon>', () => {
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

  it('renders correctly when count is null', () => {
    renderWithExtensionContext(<CommentIcon count={null as any} />)
  })

  it('renders correctly when count is 10', () => {
    renderWithExtensionContext(<CommentIcon count={10} />)
    expect(screen.getByText(/10/)).toBeInTheDocument()
  })
})
