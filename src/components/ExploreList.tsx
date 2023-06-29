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
import { FlexItem, List, ListItem, theme } from '@looker/components'
import './styles.css'
import { useHistory } from 'react-router'
import type { ILookmlModelExplore } from '@looker/sdk'
import { internalExploreURL, useCurrentModel } from '../utils/routes'

const isActive = (
  currentExplore: ILookmlModelExplore,
  listExplore: ILookmlModelExplore,
  loadingExplore: string
) => {
  if (
    !loadingExplore &&
    currentExplore &&
    listExplore.name === currentExplore.name
  ) {
    return 'active'
  } else if (loadingExplore && listExplore.name === loadingExplore) {
    return 'active'
  } else {
    return null
  }
}

export const ExploreList: React.FC<{
  currentExplore: ILookmlModelExplore
  search: string
  loadingExplore: string
}> = ({ currentExplore, loadingExplore, search }) => {
  const currentModel = useCurrentModel()
  const history = useHistory()
  return (
    <FlexItem pt="xlarge" ml="xsmall">
      <List density={0} color={theme.colors.key}>
        {currentModel &&
          currentModel.explores &&
          currentModel.explores.map((explore: any) => {
            if (
              !explore.hidden &&
              (!search ||
                explore.label.toLowerCase().includes(search.toLowerCase()))
            ) {
              return (
                <ListItem
                  key={explore.name}
                  truncate={true}
                  onClick={() => {
                    history.push(
                      internalExploreURL({
                        model: currentModel.name || '',
                        explore: explore.name,
                      })
                    )
                  }}
                  selected={isActive(currentExplore, explore, loadingExplore)}
                >
                  {explore.label}
                </ListItem>
              )
            }
            return undefined
          })}
      </List>
    </FlexItem>
  )
}
