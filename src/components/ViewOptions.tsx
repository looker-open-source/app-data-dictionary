// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import type { SyntheticEvent } from 'react'
import React from 'react'
import {
  ButtonOutline,
  FieldCheckbox,
  Popover,
  PopoverContent,
} from '@looker/components'
import type { ColumnDescriptor } from './interfaces'

const checkChange = (
  setShownColumns: (newState: string[]) => void,
  shownColumns: string[],
  columnDesc: string
) => {
  return (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement
    if (target.checked) {
      setShownColumns([...shownColumns, columnDesc])
    } else {
      setShownColumns(shownColumns.filter((x) => x !== columnDesc))
    }
  }
}

export const ViewOptions: React.FC<{
  columns: ColumnDescriptor[]
  shownColumns: string[]
  setShownColumns: (newState: string[]) => void
}> = ({ columns, shownColumns, setShownColumns }) => {
  return (
    <Popover
      content={
        <PopoverContent p="xsmall" width="150px">
          {columns.map((column) => {
            return (
              <FieldCheckbox
                key={column.name}
                name={column.name}
                label={column.label}
                onChange={checkChange(
                  setShownColumns,
                  shownColumns,
                  column.rowValueDescriptor
                )}
                checked={shownColumns.includes(column.rowValueDescriptor)}
              />
            )
          })}
        </PopoverContent>
      }
    >
      <ButtonOutline aria-haspopup="true">View Options</ButtonOutline>
    </Popover>
  )
}
