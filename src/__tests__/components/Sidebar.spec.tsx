// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { screen } from '@testing-library/react'
import { Sidebar } from '../../components/Sidebar'
import { renderWithExtensionContext } from '../test_utils/render_with_extension'
import {
  mockCurrentExplore,
  mockCurrentModel,
  mockModels,
} from '../MockData/MockData'

jest.mock('react-router', () => {
  return {
    useHistory: jest.fn(),
  }
})

jest.mock('../../components/ExploreList', () => ({
  ExploreList: () => 'ExploreList',
}))

describe('<Sidebar/>', () => {
  it('renders loading', () => {
    renderWithExtensionContext(
      <Sidebar
        loadingExplore="products"
        currentExplore={mockCurrentExplore}
        currentModel={mockCurrentModel}
        models={mockModels}
        search=""
        setSearch={jest.fn()}
      />
    )
    expect(screen.getByText('Select a Model')).toBeInTheDocument()
    expect(screen.getByText('Explores')).toBeInTheDocument()
    expect(screen.getByText('ExploreList')).toBeInTheDocument()
  })
})
