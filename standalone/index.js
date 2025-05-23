import React from 'react';
import ReactDOM from 'react-dom';
import { MDXProvider } from '@mdx-js/react';
import BlogPost from '../pages/blog/you-cant-replace-redux-with-hooks-and-context.mdx';

// Mock components to replace the imported ones
const mockComponent = (name) => ({ children }) => (
  <div className={`mock-${name.toLowerCase()}`}>{children}</div>
);

// Mock Layout components
const Layout = ({ children, ...props }) => (
  <div className="mock-layout">
    <header>
      <h1>{props.title || 'Blog Post'}</h1>
      {props.description && <p>{props.description}</p>}
    </header>
    <main>{children}</main>
  </div>
);

const components = {
  // Layout components
  Layout: Layout,
  ArticleLayout: ({ children }) => <article className="mock-article-layout">{children}</article>,
  TextSlide: ({ children }) => <section className="mock-text-slide">{children}</section>,
  LeadSlide: ({ children }) => <section className="lead-slide">{children}</section>,
  TextAndCodeSlide: ({ children }) => <section className="mock-text-and-code-slide">{children}</section>,
  
  // Code components
  CodeStep: ({ children }) => <div className="mock-code-step">{children}</div>,
  CodeHighlight: ({ children, lines }) => (
    <div className="mock-code-highlight" data-lines={lines?.join(',')}>
      {children}
    </div>
  ),
  ReRenderExample: () => (
    <div className="mock-re-render-example">
      <p>Re-render Example Visualization (placeholder)</p>
    </div>
  ),
  
  // Basic HTML components
  pre: props => <pre {...props} />,
  code: props => <code {...props} />,
  a: props => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

const App = () => (
  <MDXProvider components={components}>
    <BlogPost />
  </MDXProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
