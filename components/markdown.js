import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

function Markdown(markdown) {
    return (
        <ReactMarkdown
            // eslint-disable-next-line react/no-children-prop
            children={markdown.children}
            components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            // eslint-disable-next-line react/no-children-prop
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            PreTag="div"
                            style={oneLight}
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
                img: ({ node, ...props }) => {
                    return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            alt={node.properties.alt}
                            className="img-fluid"
                            src={node.properties.src}
                            {...props}
                        />
                    );
                },
            }}
        />
    );
}

export default Markdown;
