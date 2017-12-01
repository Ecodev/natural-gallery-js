#!/bin/sh

pass=true

files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E 'app\/.*\.ts$')
if [ "$files" != "" ]; then

    # Run TSLint validation before commit
    for file in ${files}; do
        ./node_modules/.bin/tslint ${file}
        if [ $? -ne 0 ]; then
            pass=false
        fi
    done
fi

if $pass; then
    exit 0
else
    echo ""
    echo "PRE-COMMIT HOOK FAILED:"
    echo "Code style validation failed. Please fix errors and try committing again."
    exit 1
fi
