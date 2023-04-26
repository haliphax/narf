#!/usr/bin/env bash
# install gitmoji as a commit hook
root="$(git rev-parse --show-toplevel)"
hook="$root/.git/hooks/prepare-commit-msg"
cat >"$hook" <<EOF
#!/bin/sh
exec < /dev/tty
npx --package=gitmoji-cli -- gitmoji --hook \$1 \$2
EOF
chmod a+x "$hook"

