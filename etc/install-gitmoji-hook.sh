#!/usr/bin/env bash
# install gitmoji as a commit hook
root="$(git rev-parse --show-toplevel)"
hook="$root/.git/hooks/prepare-commit-msg"
cat >"$hook" <<EOF
#!/usr/bin/env bash

# check for skip var
if [[ "\$SKIP_GITMOJI_HOOK" != "" ]]; then exit 0; fi

# check for existing gitmoji message
if [[ -f "\$1" ]] && [[ "\$2" == "message" ]] && {
	[[ "\$(grep -E \$'^[\\u0000-\\u007f]' <\$1)" != "" ]]
} then exit 0; fi

# prompt for gitmoji
exec < /dev/tty
npx --package=gitmoji-cli -- gitmoji --hook \$1 \$2
EOF
chmod a+x "$hook"
