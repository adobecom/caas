import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from importlib.util import module_from_spec, spec_from_file_location

spec = spec_from_file_location('preview_files', Path(__file__).with_name('preview-files.py'))
preview = module_from_spec(spec)
spec.loader.exec_module(preview)


class PreviewTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def bundle(self, pr, content='first'):
        path = self.root / f'incoming-{pr}-{content}'
        path.mkdir()
        hashes = {}
        for name in preview.FILES:
            (path / name).write_text(content)
            hashes[name] = hashlib.sha256(content.encode()).hexdigest()
        (path / 'manifest.json').write_text(json.dumps({'pr': pr, 'sha': 'a'*40, 'sha256': hashes}))
        return path

    def test_two_prs_republish_and_normal_site_deployment(self):
        store = self.root / 'saved'
        preview.copy_build(self.bundle(662), store / 'pr-662')
        preview.copy_build(self.bundle(654), store / 'pr-654')
        preview.copy_build(self.bundle(662, 'updated'), store / 'pr-662')
        site = self.root / 'site'
        site.mkdir()
        (site / 'index.html').write_text('existing site')
        preview.restore(store, site / 'pr-builds')
        self.assertEqual((site / 'index.html').read_text(), 'existing site')
        self.assertEqual((site / 'pr-builds/pr-662/main.min.js').read_text(), 'updated')
        self.assertEqual((site / 'pr-builds/pr-654/main.min.js').read_text(), 'first')
        next_site = self.root / 'normal-deployment'
        preview.restore(store, next_site / 'pr-builds')
        self.assertEqual((next_site / 'pr-builds/pr-654/app.css').read_text(), 'first')

    def test_missing_asset(self):
        source = self.bundle(662)
        (source / 'app.css').unlink()
        with self.assertRaises(ValueError):
            preview.copy_build(source, self.root / 'pr-662')

    def test_checksum_mismatch(self):
        source = self.bundle(662)
        (source / 'app.css').write_text('wrong build')
        with self.assertRaises(ValueError):
            preview.copy_build(source, self.root / 'pr-662')

    def test_wrong_pr(self):
        with self.assertRaises(ValueError):
            preview.copy_build(self.bundle(662), self.root / 'pr-654')

    def test_symlink_asset(self):
        source = self.bundle(662)
        (source / 'app.css').unlink()
        (source / 'app.css').symlink_to(source / 'main.min.js')
        with self.assertRaises(ValueError):
            preview.copy_build(source, self.root / 'pr-662')

    def test_empty_store(self):
        preview.restore(self.root / 'missing', self.root / 'site')


if __name__ == '__main__':
    unittest.main()
