export interface VerifierOptions {
  cwd?: string | URL;
  env?: NodeJS.ProcessEnv;
  timeout?: number;
  maxBuffer?: number;
  signal?: AbortSignal;
}
export interface VerifierResult {
  stdout: string;
  stderr: string;
  code: number | null;
  signal: NodeJS.Signals | null;
}
export function runVerifier(command: string, args: string[], options?: VerifierOptions): Promise<VerifierResult>;
