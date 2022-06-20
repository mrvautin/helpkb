import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import styles from './code.module.css'

export default function Code({ code, language }) {
    return (
        <SyntaxHighlighter language={language} className={styles.codeblock}>
            {code}
        </SyntaxHighlighter>
    );
}