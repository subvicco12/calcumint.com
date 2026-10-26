import importlib.util
from pathlib import Path
import ssl
import tempfile
import unittest

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('capture',HERE/'capture-sources.py')
capture=importlib.util.module_from_spec(spec);spec.loader.exec_module(capture)

class CaptureSafety(unittest.TestCase):
    def test_only_explicit_https_publisher_hosts(self):
        hosts={'www.gov.uk'}
        capture.validate_url('https://www.gov.uk/income-tax-rates',hosts)
        for bad in ['http://www.gov.uk/a','https://user:secret@www.gov.uk/a','https://127.0.0.1/a','https://www.gov.uk.evil.test/a','https://www.gov.uk:444/a','https://unapproved.test/a']:
            with self.assertRaises(ValueError):capture.validate_url(bad,hosts)
    def test_redirects_are_validated_before_following(self):
        handler=capture.ApprovedRedirect({'www.gov.uk'})
        from urllib.request import Request
        with self.assertRaises(ValueError):handler.redirect_request(Request('https://www.gov.uk/a'),None,302,'redirect',{},'https://unapproved.test/b')
    def test_tls_keeps_certificate_and_hostname_validation(self):
        context=capture.tls_context()
        self.assertEqual(context.verify_mode,ssl.CERT_REQUIRED);self.assertTrue(context.check_hostname)
    def test_a_download_does_not_supply_review_or_effective_dates(self):
        with tempfile.TemporaryDirectory() as directory:
            r=capture.store_capture('https://www.gov.uk/a','https://www.gov.uk/a',b'official page fixture',{'Content-Type':'text/plain','Last-Modified':'Mon, 01 Jan 2024 00:00:00 GMT'},Path(directory))
            self.assertEqual(r['status'],'CAPTURED_UNREVIEWED')
            self.assertFalse(r['sourceVerified']);self.assertFalse(r['certificationAuthorized']);self.assertFalse(r['publicationAuthorized'])
            self.assertIsNone(r['normativeRevision']);self.assertIsNone(r['effectiveFrom'])
            self.assertTrue((Path(directory)/r['bodyFile']).is_file())

if __name__=='__main__':unittest.main(verbosity=2)
