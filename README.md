# Article "You can’t replace Redux with Hooks and Context"

This repository contains a single article of my blog post, exposed as a micro-frontend.

**Why?** This article in particular includes rich interactions, and to make it possible I used low-level MDX APIs. However with the new version of MDX, all those APIs broke. In order to make the article compile and work under a project using modern MDX, I'd need to rewrite it from scratch. But keeping it in a separate build allows me to load it in my blog without hassle.
