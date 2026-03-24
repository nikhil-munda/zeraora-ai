import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface PythonSuccessResponse<T> {
  success: true;
  result?: T;
  matches?: T;
}

interface PythonErrorResponse {
  success: false;
  error: string;
}

export interface IngestionResult {
  url?: string;
  video_url?: string;
  repo?: string;
  repo_url?: string;
  files?: number;
  file_name?: string;
  title?: string;
  transcript_length?: number;
  characters?: number;
  chunks?: number;
  chunks_created?: number;
  embeddings?: number;
  embeddings_generated?: number;
  stored_points?: number;
  stored_vectors?: number;
}

export interface RetrievalMatch {
  text: string;
  file_name: string;
  source_id: string;
  score: number;
}

const ingestionRoot = path.resolve(__dirname, '../../../ingestion');
const workspaceRoot = path.resolve(__dirname, '../../..');

function resolvePythonBin(): string {
  const configuredPython = process.env.PYTHON_BIN?.trim();
  const genericPythonCommands = new Set(['python', 'python3']);

  if (configuredPython && !genericPythonCommands.has(configuredPython)) {
    return configuredPython;
  }

  const unixVenvPython = path.join(workspaceRoot, '.venv', 'bin', 'python');
  if (fs.existsSync(unixVenvPython)) {
    return unixVenvPython;
  }

  const windowsVenvPython = path.join(workspaceRoot, '.venv', 'Scripts', 'python.exe');
  if (fs.existsSync(windowsVenvPython)) {
    return windowsVenvPython;
  }

  return 'python3';
}

function runPythonJson<T>(scriptRelativePath: string, args: string[]): Promise<T> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(ingestionRoot, scriptRelativePath);
    const pythonBin = resolvePythonBin();
    const child = spawn(pythonBin, [scriptPath, ...args], {
      cwd: ingestionRoot,
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8',
      },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      const output = stdout.trim();
      if (!output) {
        reject(new Error(stderr.trim() || `Python process exited with code ${code ?? 'unknown'}`));
        return;
      }

      const parseCandidates: string[] = [output];
      const lines = output
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      for (let i = lines.length - 1; i >= 0; i -= 1) {
        if (lines[i].startsWith('{') && lines[i].endsWith('}')) {
          parseCandidates.push(lines[i]);
        }
      }

      try {
        let parsed: PythonSuccessResponse<T> | PythonErrorResponse | null = null;
        for (const candidate of parseCandidates) {
          try {
            parsed = JSON.parse(candidate) as PythonSuccessResponse<T> | PythonErrorResponse;
            break;
          } catch {
            // Keep trying with smaller candidates (typically final JSON line).
          }
        }

        if (!parsed) {
          throw new Error('No JSON payload found in Python output');
        }

        if (!parsed.success) {
          reject(new Error(parsed.error || stderr.trim() || 'Python process failed'));
          return;
        }

        if ('result' in parsed && parsed.result !== undefined) {
          resolve(parsed.result);
          return;
        }

        if ('matches' in parsed && parsed.matches !== undefined) {
          resolve(parsed.matches);
          return;
        }

        reject(new Error('Python process returned an unexpected payload'));
      } catch {
        reject(new Error(stderr.trim() || output));
      }
    });
  });
}

export function ingestPdfWithPython(params: {
  filePath: string;
  fileName: string;
  sourceId: string;
  userId: string;
}): Promise<IngestionResult> {
  const { filePath, fileName, sourceId, userId } = params;
  return runPythonJson<IngestionResult>('cli/ingest_pdf.py', [
    filePath,
    '--source-id',
    sourceId,
    '--user-id',
    userId,
    '--file-name',
    fileName,
  ]);
}

export function ingestWebsiteWithPython(params: {
  url: string;
  fileName: string;
  sourceId: string;
  userId: string;
}): Promise<IngestionResult> {
  const { url, fileName, sourceId, userId } = params;
  return runPythonJson<IngestionResult>('cli/ingest_website.py', [
    url,
    '--source-id',
    sourceId,
    '--user-id',
    userId,
    '--file-name',
    fileName,
  ]);
}

export function ingestGithubWithPython(params: {
  repoUrl: string;
  sourceId: string;
  userId: string;
}): Promise<IngestionResult> {
  const { repoUrl, sourceId, userId } = params;
  return runPythonJson<IngestionResult>('cli/ingest_github.py', [
    repoUrl,
    '--source-id',
    sourceId,
    '--user-id',
    userId,
  ]);
}

export function ingestYoutubeWithPython(params: {
  url: string;
  sourceId: string;
  userId: string;
}): Promise<IngestionResult> {
  const { url, sourceId, userId } = params;
  return runPythonJson<IngestionResult>('cli/ingest_youtube.py', [
    url,
    '--source-id',
    sourceId,
    '--user-id',
    userId,
  ]);
}

export function ingestRedditWithPython(params: {
  subreddit: string;
  query?: string;
  sourceId: string;
  userId: string;
}): Promise<IngestionResult> {
  const { subreddit, query, sourceId, userId } = params;
  const args = [
    subreddit,
    '--source-id',
    sourceId,
    '--user-id',
    userId,
  ];

  if (query) {
    args.push('--query', query);
  }

  return runPythonJson<IngestionResult>('cli/ingest_reddit.py', args);
}

export function retrieveContextWithPython(params: {
  query: string;
  userId: string;
  limit?: number;
}): Promise<RetrievalMatch[]> {
  const { query, userId, limit = 5 } = params;
  return runPythonJson<RetrievalMatch[]>('cli/query_context.py', [
    query,
    '--user-id',
    userId,
    '--limit',
    String(limit),
  ]);
}