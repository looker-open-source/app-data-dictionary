// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import renderer from 'react-test-renderer'

import { ExternalLink } from '../../components/ExternalLink'

jest.mock('@looker/components', () => ({
  Link: () => 'Link',
  LinkProps: () => 'LinkProps',
}))

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ExternalLink target="_blank" href="looker.com">
        <div>External Link</div>
      </ExternalLink>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
