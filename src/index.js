import React from 'react';
import {createRoot} from 'react-dom/client';
import {Layout} from "./components";
import BlogPost from './you-cant-replace-redux-with-hooks-and-context.mdx';

const root = createRoot(document.getElementById('root'));

root.render(<Layout><BlogPost /></Layout>);
