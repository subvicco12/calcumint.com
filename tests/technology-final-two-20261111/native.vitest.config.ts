import path from 'node:path';
import {defineConfig} from 'vitest/config';
const appRoot=path.resolve(process.env.FINAL_TWO_APP_ROOT??process.cwd());
export default defineConfig({resolve:{alias:{'@':path.join(appRoot,'src')}},server:{fs:{allow:[process.cwd(),appRoot]}},test:{environment:'node',include:['tests/technology-final-two-20261111/native.test.ts']}});
