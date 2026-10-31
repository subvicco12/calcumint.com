import unittest,pathlib,tempfile,importlib.util,json,copy
spec=importlib.util.spec_from_file_location('native_blueprint','scripts/reconcile-native-blueprint.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class NativeBlueprint(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.native,cls.old,cls.matrix=m.reconcile(pathlib.Path('docs/blueprint-reconciliation/input/master-blueprint.docx'))
 def test_native_crc_original_scope_and_table_context(self):
  self.assertEqual(self.native['source']['uploadedOriginalSHA256'],m.SOURCE_SHA);self.assertTrue(self.native['source']['zipCRCVerified']);self.assertEqual(len(self.native['source']['memberHashes']),19);self.assertEqual(len(self.native['paragraphs']),1116);self.assertEqual(len(self.native['tables']),33)
  text={p['paragraphId']:p for p in self.native['paragraphs']};self.assertEqual(text['BP-0481']['text'],'Invent a competing mathematical answer.');self.assertTrue(text['BP-0481']['tableContexts']);table=self.native['tables'][text['BP-0481']['tableContexts'][0]['table']-1];self.assertIn('Not allowed',json.dumps(table['headerCandidate']))
 def test_historical_424_records_are_exact_not_exhaustive(self):
  self.assertEqual(self.old['historicalRecordsPreserved'],424);self.assertEqual(len(self.old['exactMatches']),410);self.assertEqual(len(self.old['nonNativeRecords']),14);self.assertEqual(self.old['nativeParagraphsCovered'],800);self.assertEqual(len(self.old['previouslyUnrepresentedNativeParagraphs']),316);self.assertEqual(len(self.old['allNativeParagraphTraceability']),1116)
  missing={p['paragraphId'] for p in self.old['previouslyUnrepresentedNativeParagraphs']};self.assertTrue({'BP-0401','BP-0598','BP-0747'}<=missing)
 def test_540_dispositions_do_not_promote_architecture_to_calculator_contract(self):
  rows=self.matrix['rows'];self.assertEqual(len(rows),540);self.assertEqual(len({r['masterId'] for r in rows}),540);self.assertEqual(sum(r['canonicalDisposition']=='AUTHORITY_BLOCKED' for r in rows),43)
  for r in rows:self.assertTrue(r['blueprintSourceAvailable']);self.assertFalse(r['canonicalAccepted']);self.assertTrue(r['activeEngineeringGate']['blocksApplicationExtension']);self.assertTrue(r['releaseHold']);self.assertFalse(r['publicationAuthorized']);self.assertTrue(r['missingCanonicalRequirements'])
  for mid in [1,2,26,51,52,138,388]:self.assertTrue(next(r for r in rows if r['masterId']==mid)['referenceSixNativeParagraphIds'])
  self.assertIn('rather than duplicated row-for-row',self.matrix['sourceBoundary'])
 def test_source_tampering_rejected_before_scope_claim(self):
  raw=pathlib.Path('docs/blueprint-reconciliation/input/master-blueprint.docx').read_bytes();altered=bytearray(raw);altered[len(raw)//2]^=1
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'bad.docx';p.write_bytes(altered)
   with self.assertRaisesRegex(ValueError,'SHA256'):m.source(p)
 def test_artifacts_reproduce_exactly(self):
  for name,content in m.artifacts(pathlib.Path('docs/blueprint-reconciliation/input/master-blueprint.docx')).items():self.assertEqual((pathlib.Path('docs/blueprint-reconciliation')/name).read_text(),content)
if __name__=='__main__':unittest.main()
