// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import {
  FlexItem,
  Card,
  CardContent,
  Flex,
  AvatarUser,
  Text,
  IconButton,
  SpaceVertical,
  Menu,
  MenuItem,
} from '@looker/components'
import { MoreVert, Create, Delete } from '@styled-icons/material'
import styled from 'styled-components'
import type { FieldComments, UserData } from './interfaces'

const CustomCommentCard = styled(Card as any)`
  .show {
    visibility: hidden;
  }

  .hide {
    visibility: hidden;
  }

  &:hover .show {
    visibility: visible;
  }
`

export const FieldCommentDisplay: React.FC<{
  authorData: UserData
  comment: FieldComments
  showDetails: () => string
  toggleEdit: () => void
  openDialog: () => void
}> = ({ authorData, comment, showDetails, toggleEdit, openDialog }) => {
  const timestamp = new Date(comment.timestamp)

  return (
    <CustomCommentCard aria-label="FieldCommentDisplay">
      <CardContent>
        <FlexItem>
          <Flex pb="small">
            <FlexItem flexBasis="10%" pr="xsmall" pt="xxxsmall">
              <AvatarUser user={authorData} size="xsmall" />
            </FlexItem>
            <FlexItem flexBasis="80%" aria-label="FieldCommentDisplayNameTime">
              <FlexItem>
                <Text fontSize="small" fontWeight="semiBold">
                  {authorData.display_name}
                </Text>
              </FlexItem>
              <FlexItem>
                <Text fontSize="xsmall" variant="secondary">
                  {timestamp.toLocaleString()}
                  {comment.edited ? ' (edited)' : null}
                </Text>
              </FlexItem>
            </FlexItem>
            <FlexItem flexBasis="10%">
              <SpaceVertical align="end">
                <Menu
                  density={-1}
                  content={
                    <>
                      <MenuItem onClick={toggleEdit} icon={<Create />}>
                        Edit Comment
                      </MenuItem>
                      <MenuItem onClick={openDialog} icon={<Delete />}>
                        Delete Comment
                      </MenuItem>
                    </>
                  }
                >
                  <IconButton
                    icon={<MoreVert />}
                    label="More Options"
                    className={showDetails()}
                  />
                </Menu>
              </SpaceVertical>
            </FlexItem>
          </Flex>
          <Text fontSize="small" aria-label="FieldCommentDisplayContent">
            {decodeURI(comment.content)}
          </Text>
        </FlexItem>
      </CardContent>
    </CustomCommentCard>
  )
}
