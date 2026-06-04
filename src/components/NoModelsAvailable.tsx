// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { Flex } from '@looker/components'
import styled from 'styled-components'

const Main = styled(Flex as any)`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #ff000021;
  color: red;
`

export const NoModelsAvailable = () => {
  return (
    <Main
      pt="large"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <div>Error: No Models Available</div>
      <div>Are all the explores on your model hidden?</div>
    </Main>
  )
}
