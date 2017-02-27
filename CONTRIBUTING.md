# Note
One aim of [gown.js][gown] is to make it as easy as possible for existing [pixi.js][pixi] contributors
to contribute to gown.js. So the guidelines are the same as for [pixi.js][pixi]

# How to contribute

It is essential to the development of gown.js that the community is empowered
to make changes and get them into the library. Here are some guidelines to make
that process silky smooth for all involved.

## Reporting issues

To report a bug, request a feature, or even ask a question, make use of the GitHub Issues
section for [gown.js][issues]. When submitting an issue please take the following steps:

1. **Search for existing issues.** Your question or bug may have already been answered or fixed,
be sure to search the issues first before putting in a duplicate issue.

2. **Create an isolated and reproducible test case.** If you are reporting a bug, make sure you
also have a minimal, runnable, code example that reproduces the problem you have.

3. **Include a live example.** After narrowing your code down to only the problem areas, make use
of [jsFiddle][fiddle], [jsBin][jsbin], or a link to your live site so that we can view a live example of the problem.

4. **Share as much information as possible.** Include browser version affected, your OS, version of
the library, steps to reproduce, etc. "X isn't working!!!1!" will probably just be closed.

## Contributing Changes

### Setting Up

To setup for making changes you will need to take a few steps, we've outlined them below:

1. Ensure you have node.js installed. You can download node.js from [nodejs.org][node]. Because
gown uses modern JS features, you will need a modern version of node. v4+ is recommended.

2. Fork the [gown.js][gown] repository, if you are unsure how to do this GitHub has a guides
for the [command line][fork-cli] and for the [GitHub Client][fork-gui].

3. Next, run `npm install` from within your clone of your fork. That will install dependencies
necessary to build pixi.js

4. After you made your changes build the package running `npm run dist`. This will build the original
and modified version of gown.js


### Making a Change

Once you have node.js, the repository, and have installed dependencies are you almost ready to make your
change. The only other thing before you start is to checkout the correct branch. Which branch you should
make your change to (and send a PR to) depends on the type of change you are making.

Here is our branch breakdown:

- `master` - This is the current development branch
- `v0.1.x` - bugfix-only branch

Your change should be made directly to the branch in your fork, or to a branch in your fork made off of
one of the above branches.

### Testing Your Change

You can test your change by using the automated tests packaged with gown.js. You can run these tests
by running `npm test` from the command line. If you fix a bug please add a test that will catch that
bug if it ever happens again. This prevents regressions from sneaking in. Please keep in mind that
this will not build your packeage so you want to run `npm run dist` first

### Submitting Your Change

After you have made and tested your change, commit and push it to your fork. Then, open a Pull Request
from your fork to the main gown.js repository on the branch you used in the `Making a Change` section of this document.

## Quickie Code Style Guide

- Use 4 spaces for tabs, never tab characters.
- No trailing whitespace, blank lines should have no whitespace.
- Always favor strict equals `===` unless you *need* to use type coercion.
- Follow conventions already in the code, and listen to eslint.
- **Ensure changes are eslint validated.** After making a change be sure to run the build process
to ensure that you didn't break anything. You can do this with `npm test` which will run
eslint, rebuild, then run the test suite.

[gown]: https://github.com/GreyRook/gown.js/issues
[issues]: https://github.com/GreyRook/gown.js/issues
[pixi]: https://github.com/pixijs/pixi.js
[fiddle]: http://jsfiddle.net
[jsbin]: http://jsbin.com/
[node]: http://nodejs.org
[fork-cli]: https://help.github.com/articles/fork-a-repo/
[fork-gui]: https://guides.github.com/activities/forking/

## Contributor Code of Conduct

[Code of Conduct](CODE_OF_CONDUCT.md) is adapted from [Contributor Covenant, version 1.4](http://contributor-covenant.org/version/1/4)
