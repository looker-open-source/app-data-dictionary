// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

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
