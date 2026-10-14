"""Validate and copy static PR bundles; never execute downloaded build output."""
import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

FILES = ('main.min.js', 'app.css', 'react.umd.js', 'react.dom.umd.js')


def copy_build(source, destination):
    for name in FILES + ('manifest.json',):
        path = source / name
        if path.is_symlink() or not path.is_file() or not path.stat().st_size:
            raise ValueError(f'Missing, empty, or linked asset: {path}')
    manifest = json.loads((source / 'manifest.json').read_text())
    if not re.fullmatch(r'[a-f0-9]{40}', manifest['sha']):
        raise ValueError('Invalid commit SHA')
    if destination.name != f"pr-{manifest['pr']}":
        raise ValueError('PR number does not match destination')
    for name in FILES:
        digest = hashlib.sha256((source / name).read_bytes()).hexdigest()
        if digest != manifest['sha256'][name]:
            raise ValueError(f'Asset checksum mismatch: {name}')
    destination.mkdir(parents=True, exist_ok=True)
    for name in FILES + ('manifest.json',):
        shutil.copyfile(source / name, destination / name)


def restore(store, site):
    if not store.exists():
        return
    for directory in store.iterdir():
        if directory.is_symlink() or not directory.is_dir() or not re.fullmatch(r'pr-[1-9]\d*', directory.name):
            raise ValueError(f'Unexpected saved preview: {directory}')
        copy_build(directory, site / directory.name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['save', 'restore'])
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    args = parser.parse_args()
    (copy_build if args.mode == 'save' else restore)(args.source, args.destination)
