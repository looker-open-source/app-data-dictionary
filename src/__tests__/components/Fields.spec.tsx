// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import renderer from 'react-test-renderer'
import { theme } from '@looker/components'
import { ThemeProvider } from 'styled-components'
import type { IUser } from '@looker/sdk'
import { columns } from '../../components/DataDictionary'
import {
  mockGroups,
  mockCurrentExplore,
  mockCurrentModel,
} from '../MockData/MockData'
import { defaultShowColumns } from '../../components/PanelFields'

import { Fields } from '../../components/Fields'
import type { CommentPermissions } from '../../components/interfaces'

jest.mock('../../components/DetailDrawer', () => ({
  DetailDrawer: () => 'DetailDrawer',
}))

it('renders correctly', () => {
  const fn = jest.fn()
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <Fields
          columns={columns}
          explore={mockCurrentExplore}
          label={mockGroups[0][0]}
          model={mockCurrentModel}
          fields={mockGroups[0][1]}
          search={null}
          shownColumns={defaultShowColumns}
          comments=""
          addComment={fn}
          editComment={fn}
          deleteComment={fn}
          authors={[]}
          me={{} as IUser}
          permissions={{} as CommentPermissions}
        />
      </ThemeProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
