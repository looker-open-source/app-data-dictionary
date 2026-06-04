// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithExtensionContext } from '../test_utils/render_with_extension'
import {
  mockModels,
  mockComments,
  mockCurrentModel,
  mockCurrentExplore,
} from '../MockData/MockData'
import { DataDictionary } from '../../components/DataDictionary'

jest.mock('../../utils/fetchers', () => {
  return {
    useAllModels: jest.fn(() => {
      return mockModels
    }),
    useComments: jest.fn(() => {
      return mockComments
    }),
  }
})

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

jest.mock('../../components/PanelFields', () => ({
  PanelFields: () => 'PanelFields',
}))

jest.mock('../../components/Sidebar', () => ({
  Sidebar: () => 'Sidebar',
}))

jest.mock('../../components/CategorizedLabel', () => ({
  CategorizedLabel: () => 'CategorizedLabel',
}))

describe('<DataDictionary>', () => {
  it('renders correctly', () => {
    renderWithExtensionContext(<DataDictionary />)
    expect(screen.getByText(/Data Dictionary/)).toBeInTheDocument()
    expect(screen.getByText(/Close Sidebar/)).toBeInTheDocument()
    expect(screen.getByText(/PanelFields/)).toBeInTheDocument()
  })
})
