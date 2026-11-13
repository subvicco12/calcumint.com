import {restoreBalancedLayout} from '../ci-balance-20261113/workflow.mjs';
export const pdfToolsStep=`      - name: Require independent PDF reader and renderer
        run: |
          if ! command -v pdftotext >/dev/null || ! command -v pdffonts >/dev/null || ! command -v pdftoppm >/dev/null || ! command -v pdfinfo >/dev/null; then
            sudo apt-get update -qq
            sudo apt-get install -y --no-install-recommends poppler-utils
          fi
          node scripts/assert-pdf-tools.mjs
`;
/** Normalize only this exact additive prerequisite for immutable historical comparisons. */
export function historicalWorkflowWithoutPdfTools(workflow){
 workflow=restoreBalancedLayout(workflow);
 if(workflow.split(pdfToolsStep).length!==2)throw Error('Missing or altered mandatory independent PDF prerequisite');
 return workflow.replace(pdfToolsStep,'');
}
