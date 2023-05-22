import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import styles from './code.module.css';

export default function Code({ code, language }) {
    return (
        <SyntaxHighlighter className={styles.codeblock} language={language}>
            {code}
        </SyntaxHighlighter>
    );
}
