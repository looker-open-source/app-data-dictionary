// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import styled from 'styled-components'
import { theme } from '@looker/components'
import humanize from 'humanize-string'

const Dimension = styled.div`
  color: ${theme.colors.text3};
`

const Measure = styled.div`
  color: ${theme.colors.text3};
`

export const DIMENSION = 'dimension'
export const MEASURE = 'measure'

export const CategorizedLabel: React.FC<{
  label: string
  category: string
}> = ({ label, category }) => {
  if (category === DIMENSION) {
    return <Dimension>{humanize(label)}</Dimension>
  } else if (category === MEASURE) {
    return <Measure>{humanize(label)}</Measure>
  } else {
    return <div>{humanize(label)}</div>
  }
}
