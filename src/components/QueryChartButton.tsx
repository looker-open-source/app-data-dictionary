// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { theme, ButtonOutline, FlexItem, Text } from '@looker/components'
import { Cached } from '@styled-icons/material'
import styled from 'styled-components'

const DisabledText = styled.div`
  font-style: italic;
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.ui4};
  margin-top: 0.2em;
`

export const QueryChartButton: React.FC<{
  disabledText: string
  enabled: boolean
  onClick: () => void
  title: string
}> = ({ disabledText, enabled, title, onClick }) => {
  return (
    <FlexItem pb="medium">
      <FlexItem mb="small">
        <Text fontSize="medium" fontWeight="bold">
          {title}
        </Text>
      </FlexItem>
      <ButtonOutline
        onClick={onClick}
        disabled={!enabled}
        iconBefore={<Cached />}
      >
        Calculate
      </ButtonOutline>
      {!enabled ? <DisabledText>{disabledText}</DisabledText> : null}
    </FlexItem>
  )
}
