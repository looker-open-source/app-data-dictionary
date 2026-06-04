// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import {
  Box,
  Flex,
  FlexItem,
  Heading,
  Table,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableBody,
  theme,
} from '@looker/components'
import styled from 'styled-components'
import type {
  ILookmlModel,
  ILookmlModelExplore,
  ILookmlModelExploreField,
  IUser,
} from '@looker/sdk'
import { DETAILS_PANE } from '../utils/constants'
import type { ColumnDescriptor, CommentPermissions } from './interfaces'
import { DetailDrawer } from './DetailDrawer'

export const TableWrapper = styled(Box as any)`
  border-bottom: 0.5px solid ${theme.colors.ui2};

  &:last-child {
    border-bottom: none;
  }
`

// Sticky Table Header
export const StickyHeader = styled(TableHeaderCell as any)`
  @supports (position: sticky) {
    position: sticky;
    top: 0;
  }
`

export const Fields: React.FC<{
  columns: ColumnDescriptor[]
  explore: ILookmlModelExplore
  label: string
  model: ILookmlModel
  fields: ILookmlModelExploreField[]
  search: string
  shownColumns: string[]
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
  label,
  fields,
  model,
  search,
  shownColumns,
  comments,
  addComment,
  editComment,
  deleteComment,
  authors,
  me,
  permissions,
}) => {
  const [tab, setTab] = React.useState(DETAILS_PANE)
  return (
    <TableWrapper p="xxlarge">
      <Flex>
        <FlexItem>
          <Heading as="h2" fontWeight="semiBold" mb="large">
            {label}
          </Heading>
        </FlexItem>
      </Flex>
      <Flex flexDirection="column">
        <Table width="100%">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                if (shownColumns.includes(column.rowValueDescriptor)) {
                  return (
                    <StickyHeader
                      key={column.label}
                      backgroundColor="ui1"
                      fontWeight="medium"
                      color="text"
                      fontSize="small"
                      p="medium"
                      pl="small"
                    >
                      {column.label}
                    </StickyHeader>
                  )
                }
                return undefined
              })}
            </TableRow>
          </TableHead>
          <TableBody fontSize="small">
            {fields.map((field) => {
              if (
                !search ||
                (field.label_short &&
                  field.label_short
                    .toLowerCase()
                    .includes(search.toLowerCase())) ||
                (field.description &&
                  field.description
                    .toLowerCase()
                    .includes(search.toLowerCase())) ||
                (field.field_group_label &&
                  field.field_group_label
                    .toLowerCase()
                    .includes(search.toLowerCase()))
              ) {
                return (
                  <DetailDrawer
                    field={field}
                    columns={columns}
                    explore={explore}
                    key={field.name}
                    model={model}
                    shownColumns={shownColumns}
                    tab={tab}
                    setTab={setTab}
                    comments={comments}
                    addComment={addComment}
                    editComment={editComment}
                    deleteComment={deleteComment}
                    authors={authors}
                    me={me}
                    permissions={permissions}
                  />
                )
              }
              return undefined
            })}
          </TableBody>
        </Table>
      </Flex>
    </TableWrapper>
  )
}
