// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { screen } from '@testing-library/react'
import { PanelFields } from '../../components/PanelFields'
import { renderWithExtensionContext } from '../test_utils/render_with_extension'
import { columns } from '../../components/DataDictionary'
import { mockCurrentModel, mockCurrentExplore } from '../MockData/MockData'

jest.mock('../../components/DetailDrawer', () => ({
  DetailDrawer: () => 'DetailDrawer',
}))

jest.mock('../../components/Fields', () => ({
  Fields: () => 'Fields',
}))

jest.mock('../../components/ViewOptions', () => ({
  ViewOptions: () => 'ViewOptions',
}))

jest.mock('../../components/ExternalLink', () => ({
  ExternalLink: () => 'ExternalLink',
}))

jest.mock('../../components/QuickSearch', () => ({
  QuickSearch: () => 'QuickSearch',
}))

jest.mock('../../utils/routes', () => {
  return {
    useCurrentModel: jest.fn(() => {
      return mockCurrentModel
    }),
    useCurrentExplore: jest.fn(() => {
      return mockCurrentExplore
    }),
  }
})

describe('<PanelFields>', () => {
  it('renders correctly', () => {
    renderWithExtensionContext(
      <PanelFields
        currentModel={mockCurrentModel}
        currentExplore={mockCurrentExplore}
        loadingExplore={null}
        columns={columns}
        comments={'{}'}
        addComment={jest.fn()}
        editComment={jest.fn()}
        deleteComment={jest.fn()}
        authors={[]}
        me={{}}
        permissions={{}}
      />
    )
    expect(screen.getByText('Snowflake Usage')).toBeInTheDocument()
    expect(
      screen.getByText('Select a field for more information.')
    ).toBeInTheDocument()
    expect(screen.getByText(/ExternalLink/)).toBeInTheDocument()
    expect(screen.getByText(/ViewOptions/)).toBeInTheDocument()
    expect(screen.getByText(/Fields/)).toBeInTheDocument()
  })
})
