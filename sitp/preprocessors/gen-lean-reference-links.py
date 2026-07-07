#!/usr/bin/env python3
"""Generate the slim Lean-reference link table used by `mdbook-lean`.

The Lean Language Reference publishes a Verso cross-reference database at
`https://lean-lang.org/doc/reference/<version>/xref.json` (a few MB). This
script distills the domains we can link from into a compact
`lean-reference-links.json` that maps identifier -> "<address>#<anchor>":

  * const  <- domain "Verso.Genre.Manual.doc"            (declarations)
  * syntax <- domain "Verso.Genre.Manual.doc.syntaxKind" (commands/notation)
  * option <- domain "Verso.Genre.Manual.doc.option"     (compiler options)

Usage:
  gen-lean-reference-links.py <version>              # fetch from lean-lang.org
  gen-lean-reference-links.py <version> --from FILE  # use a local xref.json
Writes lean-reference-links.json next to this script.
"""
import json
import os
import sys
import urllib.request

DOMAINS = {
    "const": "Verso.Genre.Manual.doc",
    "syntax": "Verso.Genre.Manual.doc.syntaxKind",
    "option": "Verso.Genre.Manual.doc.option",
}


def distill(domain_contents):
    out = {}
    for name, locations in domain_contents.items():
        if not locations:
            continue
        loc = locations[0]  # first documented location wins
        addr, anchor = loc.get("address"), loc.get("id")
        if addr and anchor:
            out[name] = "%s#%s" % (addr, anchor)
    return out


def main():
    if len(sys.argv) < 2:
        sys.stderr.write(__doc__)
        sys.exit(2)
    version = sys.argv[1]
    base = "https://lean-lang.org/doc/reference/%s" % version

    if "--from" in sys.argv:
        src = sys.argv[sys.argv.index("--from") + 1]
        with open(src) as f:
            xref = json.load(f)
    else:
        url = "%s/xref.json" % base
        sys.stderr.write("fetching %s\n" % url)
        with urllib.request.urlopen(url) as r:
            xref = json.load(r)

    table = {"base": base, "version": version}
    for key, domain in DOMAINS.items():
        contents = xref.get(domain, {}).get("contents", {})
        table[key] = distill(contents)
        sys.stderr.write("  %-7s %d entries\n" % (key, len(table[key])))

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                            "lean-reference-links.json")
    with open(out_path, "w") as f:
        json.dump(table, f, separators=(",", ":"), sort_keys=True)
    sys.stderr.write("wrote %s (%d bytes)\n" % (out_path, os.path.getsize(out_path)))


if __name__ == "__main__":
    main()
