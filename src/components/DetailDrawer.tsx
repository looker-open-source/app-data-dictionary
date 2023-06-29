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
import { theme, Drawer, TableRow, TableDataCell } from '@looker/components'
import styled from 'styled-components'
import type {
  ILookmlModel,
  ILookmlModelExplore,
  ILookmlModelExploreField,
  IUser,
} from '@looker/sdk'
import { useHistory } from 'react-router'
import { DETAILS_PANE, COMMENTS_PANE } from '../utils/constants'
import { internalExploreURL, usePathNames } from '../utils/routes'
import type {
  ColumnDescriptor,
  FieldComments,
  CommentPermissions,
} from './interfaces'
import { FieldMetadata } from './FieldMetadata'

const TableRowCustom = styled(TableRow as any)`
  transition: background-color 0.3s ease;
  &.active,
  &:hover {
    background-color: ${theme.colors.ui1};
  }

  .disabled {
    visibility: hidden;
  }

  &:hover .disabled {
    visibility: visible;
  }

  td {
    word-break: break-word;
  }
  cursor: pointer;
`

export const DetailDrawer: React.FC<{
  columns: ColumnDescriptor[]
  explore: ILookmlModelExplore
  model: ILookmlModel
  field: ILookmlModelExploreField
  shownColumns: string[]
  tab: number
  setTab: (tabIndex: number) => void
  comments: string
  addComment: (newCommentStr: string, field: string) => void
  editComment: (newCommentStr: string, field: string) => void
  deleteComment: (newCommentStr: string, field: string) => void
  authors: IUser[]
  me: IUser
  permissions: CommentPermissions
}> = ({
  columns,
  explore,
  field,
  model,
  shownColumns,
  tab,
  setTab,
  comments,
  addComment,
  editComment,
  deleteComment,
  authors,
  me,
  permissions,
}) => {
  const history = useHistory()
  const path = usePathNames()

  const parsedComments = JSON.parse(comments)

  const getFieldCommentsLength = (field: string) => {
    const exploreComments = parsedComments[explore.name]
      ? parsedComments[explore.name]
      : {}
    const commentFields = Object.keys(exploreComments)
    if (commentFields.includes(field) && exploreComments[field].length > 0) {
      return exploreComments[field].length
    } else {
      return null
    }
  }

  const fieldComments =
    (parsedComments[explore.name] &&
      parsedComments[explore.name][field.name]) ||
    []
  const sortedComments = fieldComments.sort(
    (x: FieldComments, y: FieldComments) => {
      return x.timestamp - y.timestamp
    }
  )

  const canViewComments = () => {
    if (permissions.disabled) {
      return false
    } else {
      return (
        (permissions.reader && sortedComments.length > 0) ||
        permissions.writer ||
        permissions.manager
      )
    }
  }

  function paneUrl(pane: number) {
    field &&
      history.push(
        internalExploreURL({
          model: explore.model_name,
          explore: explore.name,
          field: field.name,
          tab: pane.toString(),
        })
      )
  }

  function closePaneUrl() {
    field &&
      history.push(
        internalExploreURL({
          model: explore.model_name,
          explore: explore.name,
        })
      )
  }

  function detailsPane() {
    paneUrl(DETAILS_PANE)
    setTab(DETAILS_PANE)
  }

  function commentsPane() {
    canViewComments() && paneUrl(COMMENTS_PANE)
    canViewComments() && setTab(COMMENTS_PANE)
  }

  return (
    <Drawer
      content={
        <FieldMetadata
          field={field}
          columns={columns}
          explore={explore}
          key={field.name}
          model={model}
          tab={path.detailPane ? parseInt(path.detailPane) : tab}
          detailsPane={detailsPane}
          commentsPane={commentsPane}
          sortedComments={sortedComments}
          addComment={addComment}
          editComment={editComment}
          deleteComment={deleteComment}
          fieldCommentLength={getFieldCommentsLength(field.name)}
          commentAuthors={authors}
          me={me}
          permissions={permissions}
          canViewComments={canViewComments()}
        />
      }
      isOpen={field.name === path.fieldName}
      onClose={closePaneUrl}
    >
      <TableRowCustom>
        {columns.map(({ Formatter, ...props }) => {
          if (shownColumns.includes(props.rowValueDescriptor)) {
            const unformattedValue =
              field[props.rowValueDescriptor as keyof ILookmlModelExploreField]
            const displayValue = unformattedValue
              ? String(unformattedValue)
              : undefined
            return (
              <TableDataCell
                color="text3"
                p="medium"
                pl="small"
                fontWeight="normal"
                key={props.rowValueDescriptor}
                maxWidth={props.maxWidth}
                minWidth={props.minWidth}
                onClick={
                  props.rowValueDescriptor === 'comment'
                    ? commentsPane
                    : detailsPane
                }
              >
                <Formatter
                  x={displayValue}
                  isRow={true}
                  field={field}
                  commentCount={getFieldCommentsLength(field.name)}
                  canComment={canViewComments()}
                  reader={permissions.reader}
                  tags={unformattedValue as string[]}
                />
              </TableDataCell>
            )
          }
          return undefined
        })}
      </TableRowCustom>
    </Drawer>
  )
}
