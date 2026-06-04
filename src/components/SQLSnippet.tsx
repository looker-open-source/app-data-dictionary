// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import styled from 'styled-components'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { SQL_SNIPPET_LENGTH } from '../utils/constants'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const theme = require('react-syntax-highlighter/dist/cjs/styles/prism/vs')
  .default
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sql = require('react-syntax-highlighter/dist/cjs/languages/prism/sql')
  .default

SyntaxHighlighter.registerLanguage('sql', sql)

const CodeTag = styled.code`
  white-space: pre-wrap !important;
  word-break: break-word !important;
`

export const SQLSnippet = ({ src, isRow }: { src: string; isRow: boolean }) => {
  let truncatedSrc = src
  if (isRow && src && src.length > SQL_SNIPPET_LENGTH) {
    truncatedSrc = src.substring(0, SQL_SNIPPET_LENGTH) + '...'
  }
  return (
    <SyntaxHighlighter
      language="sql"
      CodeTag={CodeTag}
      style={{
        ...theme,
        hljs: { margin: '0' },
      }}
    >
      {truncatedSrc}
    </SyntaxHighlighter>
  )
}
