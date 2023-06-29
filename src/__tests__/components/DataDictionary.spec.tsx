/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

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
