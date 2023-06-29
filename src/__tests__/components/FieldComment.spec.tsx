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
import renderer from 'react-test-renderer'
import { theme } from '@looker/components'
import { ThemeProvider } from 'styled-components'
import { FieldComment } from '../../components/FieldComment'

jest.mock('../../components/FieldCommentDisplay', () => ({
  FieldCommentDisplay: () => 'FieldCommentDisplay',
}))

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <FieldComment
          comment={{
            pk: 'timestamp::author',
            author: 1,
            content: 'This is my comment.',
            timestamp: 7171717171,
            edited: false,
          }}
          editingComment={''}
          setEditingComment={jest.fn()}
          setCommentContent={jest.fn()}
          editComment={jest.fn()}
          deleteComment={jest.fn()}
          commentContent={''}
          field={{}}
          authorData={{
            display_name: 'Mr. Foo Bar',
            first_name: 'Foo',
            last_name: 'Bar',
            avatar_url: 'imgsrv.com/foo/bar',
          }}
          me={{}}
          addingNew={false}
          permissions={{}}
        />
      </ThemeProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
