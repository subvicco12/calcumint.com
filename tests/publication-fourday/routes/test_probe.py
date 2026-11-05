"""Offline parser acceptance checks; never contacts production."""
import importlib.util
import pathlib
import unittest
from unittest.mock import MagicMock, patch

spec = importlib.util.spec_from_file_location('probe', pathlib.Path(__file__).with_name('probe.py'))
probe = importlib.util.module_from_spec(spec); spec.loader.exec_module(probe)

class ParserTests(unittest.TestCase):
    def test_extracts_visible_technical_version_and_route_evidence(self):
        body = b'''<link rel="canonical" href="https://calcumint.com/calculators/science/example"><h1>Example Calculator</h1><input type="search"><div class="calculator-ui"><input><select></select><div class="account-actions"><input></div><div class="scenario-controls"><textarea></textarea></div></div><h2>How this calculator works</h2><h2>Formula</h2><h2>Worked example</h2><h2>Methodology &amp; sources</h2><strong>Technical calculation version:</strong> 1.<script>Technical calculation version: 99</script><a href="/calculators/science/example">Example</a>'''
        result = probe.inspect(body)
        self.assertEqual(result['displayedVersion'], 1)
        self.assertEqual(result['h1'], 'Example Calculator')
        self.assertEqual(result['inputControls'], 2)
        self.assertTrue(all(result['contentMarkers'].values()))
        self.assertEqual(result['canonical'], 'https://calcumint.com/calculators/science/example')
    def test_static_correct_markers_and_nav_search_do_not_establish_calculator_surface(self):
        result = probe.inspect(b'<h1>Example Calculator</h1><nav><input type="search"></nav><h2>How this calculator works</h2><h2>Formula</h2><h2>Worked example</h2><h2>Methodology &amp; sources</h2><strong>Technical calculation version:</strong> 1.')
        self.assertTrue(all(result['contentMarkers'].values()))
        self.assertEqual(result['displayedVersion'], 1)
        self.assertEqual(result['inputControls'], 0)
        self.assertEqual(result['evidenceScope'], probe.EVIDENCE_SCOPE)
        target = {'url': 'https://calcumint.com/calculators/science/example', 'kind': 'engine', 'expectedTitle': 'Example Calculator', 'expectedVersion': 1}
        response = MagicMock(status=200, url=target['url'])
        response.read.return_value = b'<link rel="canonical" href="https://calcumint.com/calculators/science/example"><h1>Example Calculator</h1><nav><input type="search"></nav><h2>How this calculator works</h2><h2>Formula</h2><h2>Worked example</h2><h2>Methodology &amp; sources</h2><strong>Technical calculation version:</strong> 1.'
        response.__enter__.return_value = response
        with patch.object(probe.urllib.request, 'build_opener') as opener:
            opener.return_value.open.return_value = response
            self.assertFalse(probe.probe(target)['renderVerified'])

    def test_soft404_or_script_payload_does_not_establish_rendering(self):
        result = probe.inspect(b'<h1>Not Found</h1><script>Technical calculation version: 1 Formula Worked example</script>')
        self.assertIsNone(result['displayedVersion'])
        self.assertEqual(result['inputControls'], 0)
        self.assertFalse(any(result['contentMarkers'].values()))

if __name__ == '__main__': unittest.main()
