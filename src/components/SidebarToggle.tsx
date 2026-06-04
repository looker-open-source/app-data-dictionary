// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import type { FC } from 'react'
import React from 'react'
import { ChevronLeft, ChevronRight } from '@styled-icons/material-rounded'
import { IconButton } from '@looker/components'
import styled from 'styled-components'

interface SidebarToggleProps {
  isOpen: boolean
  headerHeight: string
  onClick: () => void
}

const SidebarToggle: FC<SidebarToggleProps> = ({
  isOpen,
  onClick,
  headerHeight,
}) => {
  const icon = isOpen ? <ChevronLeft /> : <ChevronRight />

  return (
    <SidebarToggleWrapper headerHeight={headerHeight}>
      <IconButton
        shape="round"
        icon={icon}
        onClick={onClick}
        label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
        size="small"
        outline
      />
    </SidebarToggleWrapper>
  )
}

interface WrapperProps {
  headerHeight?: string
}

const SidebarToggleWrapper = styled.div<WrapperProps>`
  position: relative;
  margin-top: calc(${(props) => props.headerHeight} / 2);
  z-index: 1;
  ${IconButton} {
    background: #fff;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
  }
`

export default SidebarToggle
