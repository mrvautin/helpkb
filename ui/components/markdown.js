import { React } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

function Markdown(markdown) { 
    return (
        <ReactMarkdown
            // eslint-disable-next-line react/no-children-prop
            children={markdown.children}
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                    <SyntaxHighlighter
                        // eslint-disable-next-line react/no-children-prop
                        children={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        style={oneLight}
                        PreTag="div"
                        {...props}
                    />
                    ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                    )
                },
                img: ({node, ...props}) => {
                    // eslint-disable-next-line @next/next/no-img-element
                    return <img src={node.properties.src} alt={node.properties.alt} className="img-fluid" {...props}/>
                }
            }}
        />
    )
}

export default Markdown