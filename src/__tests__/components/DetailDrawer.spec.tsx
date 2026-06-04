// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import renderer from 'react-test-renderer'
import { theme } from '@looker/components'
import { ThemeProvider } from 'styled-components'
import { mockCurrentModel, mockCurrentExplore } from '../MockData/MockData'
import { columns } from '../../components/DataDictionary'
import { defaultShowColumns } from '../../components/PanelFields'
import { DetailDrawer } from '../../components/DetailDrawer'

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

jest.mock('../../components/DetailDrawerRow', () => ({
  DetailDrawerRow: () => 'DetailDrawerRow',
}))

jest.mock('../../components/QueryChart', () => ({
  QueryChart: () => 'QueryChart',
}))

jest.mock('../../components/ExternalLink', () => ({
  ExternalLink: () => 'ExternalLink',
}))

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <DetailDrawer
          columns={columns}
          explore={mockCurrentExplore}
          model={mockCurrentModel}
          field={mockCurrentExplore.fields.dimensions[0]}
          shownColumns={defaultShowColumns}
          tab={0}
          setTab={jest.fn()}
          comments={'{}'}
          addComment={jest.fn()}
          editComment={jest.fn()}
          deleteComment={jest.fn()}
          authors={[]}
          me={{}}
          permissions={{}}
        />
      </ThemeProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
