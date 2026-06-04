// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { AddComment } from '@styled-icons/material-rounded'
import { Comment } from '@styled-icons/material'
import {
  FlexItem,
  ButtonTransparent,
  IconButton,
  Tooltip,
} from '@looker/components'

export const CommentIcon: React.FC<{
  count: number
}> = ({ count }) => {
  return (
    <FlexItem>
      {' '}
      {count !== null ? (
        <Tooltip content="View Comments">
          <ButtonTransparent
            iconBefore={<Comment />}
            color="neutral"
            size="small"
          >
            {count}
          </ButtonTransparent>
        </Tooltip>
      ) : (
        <IconButton
          label="Add Comment"
          icon={<AddComment />}
          color="neutral"
          className="disabled"
        />
      )}
    </FlexItem>
  )
}
