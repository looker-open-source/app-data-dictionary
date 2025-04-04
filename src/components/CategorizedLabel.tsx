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
import styled from 'styled-components'
import { theme } from '@looker/components'
import humanize from 'humanize-string'

const Dimension = styled.div`
  color: ${theme.colors.text3};
`

const Measure = styled.div`
  color: ${theme.colors.text3};
`

export const DIMENSION = 'dimension'
export const MEASURE = 'measure'

export const CategorizedLabel: React.FC<{
  label: string
  category: string
}> = ({ label, category }) => {
  if (category === DIMENSION) {
    return <Dimension>{humanize(label)}</Dimension>
  } else if (category === MEASURE) {
    return <Measure>{humanize(label)}</Measure>
  } else {
    return <div>{humanize(label)}</div>
  }
}
