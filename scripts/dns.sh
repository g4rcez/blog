#!/usr/bin/env bash

set -euo pipefail

DOMAIN="${1:-garcez.dev}"
AGENT="${2:-}"
PROTOCOL="${3:-}"

failures=0

say() {
    printf '%s\n' "$*"
}

section() {
    printf '\n== %s ==\n' "$1"
}

check_record() {
    local label="$1"
    shift

    local output
    output="$(dig +short "$@")"

    if [[ -n "$output" ]]; then
        say "PASS $label"
        say "$output"
    else
        say "FAIL $label (no answer)"
        failures=$((failures + 1))
    fi
}

check_warning() {
    local label="$1"
    shift

    local output
    output="$(dig +short "$@")"

    if [[ -n "$output" ]]; then
        say "PASS $label"
        say "$output"
    else
        say "WARN $label (no answer)"
    fi
}

if ! command -v dig >/dev/null 2>&1; then
    say "dig is required"
    exit 2
fi

section "DNS-AID check for ${DOMAIN}"

check_record "authoritative nameservers" NS "${DOMAIN}"
check_warning "DNSSEC DS record" DS "${DOMAIN}"

section "Agent discovery records"

check_record "organization index" SVCB "_index._agents.${DOMAIN}"

if [[ -n "${AGENT}" || -n "${PROTOCOL}" ]]; then
    if [[ -z "${AGENT}" || -z "${PROTOCOL}" ]]; then
        say "FAIL agent/protocol check requires both AGENT and PROTOCOL"
        failures=$((failures + 1))
    else
        check_record "agent leaf (${AGENT}/${PROTOCOL})" SVCB "_${AGENT}._${PROTOCOL}._agents.${DOMAIN}"
    fi
fi

section "Summary"

if [[ "$failures" -eq 0 ]]; then
    say "PASS DNS-AID records look configured"
else
    say "FAIL DNS-AID checks had ${failures} problem(s)"
    say ""
    say "Expected at minimum:"
    say "  _index._agents.${DOMAIN}.  IN SVCB 1 ${DOMAIN}. alpn=\"h2\" port=443 mandatory=alpn,port"
fi

exit "$failures"
