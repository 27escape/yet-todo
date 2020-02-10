# yet-todo

I keep meeting notes in either markdown or plaintext TODO format. All these files generally live somewhere under a parent directory. This simple too finds those items that are yet-todo, by finding all those lines with '[ ]' in them and then displaying them.

## Install

To install, download this repo and run, its not on the NPM site so a couple of manual steps are required...

    npm install
    npm link

## To use

To find your outstanding tasks

    yet-todo -d "$HOME/markdown files"

To edit the files that have outstanding tasks, use the ```-e``` flag.

    yet-todo -e -d "$HOME/markdown files"
