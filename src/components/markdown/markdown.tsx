'use client';

import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'github-markdown-css/github-markdown.css';

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn('markdown-body', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag='div'
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ ...props }) => (
            <h1 className='mt-6 mb-4 text-2xl font-bold' {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className='mt-5 mb-3 text-xl font-bold' {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className='mt-4 mb-2 text-lg font-semibold' {...props} />
          ),
          p: ({ ...props }) => (
            <p className='mb-4 leading-relaxed' {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className='mb-4 list-disc space-y-1 pl-6' {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className='mb-4 list-decimal space-y-1 pl-6' {...props} />
          ),
          li: ({ ...props }) => <li className='mb-1' {...props} />,
          a: ({ ...props }) => (
            <a
              className='text-blue-600 hover:underline'
              target='_blank'
              rel='noopener noreferrer'
              {...props}
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className='border-l-4 border-gray-300 pl-4 text-gray-600 italic'
              {...props}
            />
          )
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
