// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import type { LinkProps } from '@looker/components'
import { Link } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'

export const ExternalLink: React.FC<Omit<LinkProps, 'color'>> = (
  props: any
) => {
  return (
    <ExtensionContext40.Consumer>
      {(context) => {
        return (
          <Link
            onClick={(...args) => {
              const event = args[0]
              if (event.preventDefault) {
                event.preventDefault()
              }
              if (props.href) {
                context.extensionSDK.updateLocation(
                  props.href,
                  undefined,
                  props.target
                )
              }
              if (props.onClick) {
                props.onClick(...args)
              }
            }}
            {...props}
          />
        )
      }}
    </ExtensionContext40.Consumer>
  )
}
