// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import renderer from 'react-test-renderer'
import { theme } from '@looker/components'
import { ThemeProvider } from 'styled-components'
import { mockCurrentExplore, mockModels } from '../MockData/MockData'

import { ExploreList } from '../../components/ExploreList'

jest.mock('react-router', () => {
  return {
    useHistory: jest.fn(() => {
      return {}
    }),
    useRouteMatch: jest.fn(() => {
      return ''
    }),
  }
})

jest.mock('../../utils/fetchers', () => {
  return {
    useAllModels: jest.fn(() => {
      return mockModels
    }),
  }
})

jest.mock('../../components/PanelFields', () => ({
  PanelFields: () => 'PanelFields',
}))

jest.mock('../../components/Sidebar', () => ({
  Sidebar: () => 'Sidebar',
}))

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <ExploreList
          currentExplore={mockCurrentExplore}
          loadingExplore={''}
          search={null}
        />
        )
      </ThemeProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
