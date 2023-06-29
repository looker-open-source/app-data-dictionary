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
import { Code, TableRow, TableDataCell } from '@looker/components'

import type { ILookmlModelExploreField } from '@looker/sdk'
import type { ColumnDescriptor } from './interfaces'

export const DetailDrawerRow: React.FC<{
  column: ColumnDescriptor
  field: ILookmlModelExploreField
}> = ({ column, field }) => {
  const unformattedValue =
    field[column.rowValueDescriptor as keyof ILookmlModelExploreField]
  const displayValue = unformattedValue ? String(unformattedValue) : undefined
  const Formatter = column.Formatter
  return (
    <TableRow key={column.rowValueDescriptor}>
      <TableDataCell color="text" p="medium" pl="small" pr="small">
        {column.label}
      </TableDataCell>
      <TableDataCell
        className="break"
        color="text3"
        p="medium"
        pl="small"
        pr="small"
      >
        <Code color="text3" fontSize="small" className="break">
          <Formatter
            x={displayValue}
            isRow={false}
            field={field}
            tags={unformattedValue as string[]}
          />
        </Code>
      </TableDataCell>
    </TableRow>
  )
}
