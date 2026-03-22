import { useState, useEffect, useCallback } from 'react';
import {
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEditorStore } from '@entities/editor/model/editor-store';

interface DirEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface TreeNodeData {
  entry: DirEntry;
  children: TreeNodeData[] | null; // null = not loaded, [] = empty
  expanded: boolean;
}

function getFileIcon(name: string): LucideIcon {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  switch (ext) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
    case 'py':
    case 'java':
    case 'go':
    case 'rs':
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
    case 'sh':
    case 'bash':
    case 'css':
    case 'scss':
    case 'less':
    case 'html':
    case 'htm':
    case 'xml':
    case 'sql':
    case 'graphql':
      return FileCode;
    case 'json':
      return FileJson;
    case 'md':
    case 'txt':
    case 'yml':
    case 'yaml':
    case 'toml':
    case 'ini':
      return FileText;
    default:
      return File;
  }
}

function sortEntries(entries: DirEntry[]): DirEntry[] {
  const dirs = entries.filter((e) => e.isDirectory).sort((a, b) => a.name.localeCompare(b.name));
  const files = entries.filter((e) => !e.isDirectory).sort((a, b) => a.name.localeCompare(b.name));
  return [...dirs, ...files];
}

function TreeNode({
  node,
  depth,
  selectedPath,
  onSelectFile,
  onToggleFolder,
}: {
  node: TreeNodeData;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (entry: DirEntry) => void;
  onToggleFolder: (node: TreeNodeData) => void;
}): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const { entry } = node;
  const isSelected = selectedPath === entry.path;

  const handleClick = () => {
    if (entry.isDirectory) {
      onToggleFolder(node);
    } else {
      onSelectFile(entry);
    }
  };

  const IconComponent = entry.isDirectory
    ? node.expanded
      ? FolderOpen
      : Folder
    : getFileIcon(entry.name);

  const iconColor = entry.isDirectory ? '#60a5fa' : '#a1a1aa';

  return (
    <>
      <div
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          height: 22,
          paddingLeft: 8 + depth * 16,
          paddingRight: 8,
          cursor: 'pointer',
          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : hovered ? '#18181b' : 'transparent',
          color: isSelected ? '#60a5fa' : '#a1a1aa',
          fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          fontSize: 12,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          userSelect: 'none',
        }}
      >
        <IconComponent size={14} style={{ color: iconColor, flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.name}</span>
      </div>
      {entry.isDirectory && node.expanded && node.children && (
        <>
          {node.children.map((child) => (
            <TreeNode
              key={child.entry.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
              onToggleFolder={onToggleFolder}
            />
          ))}
          {node.children.length === 0 && (
            <div
              style={{
                paddingLeft: 8 + (depth + 1) * 16,
                fontSize: 11,
                color: '#52525b',
                fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                height: 22,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              (empty)
            </div>
          )}
        </>
      )}
    </>
  );
}

export function FileExplorer(): React.JSX.Element {
  const workspacePath = useEditorStore((s) => s.workspacePath);
  const setWorkspacePath = useEditorStore((s) => s.setWorkspacePath);
  const openFile = useEditorStore((s) => s.openFile);

  const [tree, setTree] = useState<TreeNodeData[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const electronAPI = typeof window !== 'undefined' ? (window as any).electronAPI : null;

  const loadDir = useCallback(
    async (dirPath: string): Promise<TreeNodeData[]> => {
      try {
        const entries: DirEntry[] = await electronAPI?.fileSystem?.readDir(dirPath);
        if (!entries) return [];
        const sorted = sortEntries(entries);
        return sorted.map((entry) => ({
          entry,
          children: null,
          expanded: false,
        }));
      } catch {
        return [];
      }
    },
    [electronAPI],
  );

  // Initialize root
  useEffect(() => {
    if (!electronAPI?.fileSystem) {
      setError('Electron runtime required');
      return;
    }

    const init = async () => {
      let rootPath = workspacePath;
      if (!rootPath) {
        rootPath = await electronAPI.fileSystem.getHomePath();
        if (rootPath) {
          setWorkspacePath(rootPath);
        }
      }
      if (rootPath) {
        const nodes = await loadDir(rootPath);
        setTree(nodes);
      }
    };

    init();
  }, [electronAPI, workspacePath, setWorkspacePath, loadDir]);

  const handleToggleFolder = useCallback(
    async (targetNode: TreeNodeData) => {
      const toggleInTree = async (nodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
        const result: TreeNodeData[] = [];
        for (const node of nodes) {
          if (node.entry.path === targetNode.entry.path) {
            if (node.expanded) {
              result.push({ ...node, expanded: false });
            } else {
              const children = node.children ?? (await loadDir(node.entry.path));
              result.push({ ...node, expanded: true, children });
            }
          } else if (node.children && node.expanded) {
            result.push({ ...node, children: await toggleInTree(node.children) });
          } else {
            result.push(node);
          }
        }
        return result;
      };

      setTree(await toggleInTree(tree));
    },
    [tree, loadDir],
  );

  const handleSelectFile = useCallback(
    async (entry: DirEntry) => {
      setSelectedPath(entry.path);
      try {
        const content = await electronAPI?.fileSystem?.readFile(entry.path);
        if (content != null) {
          openFile({ path: entry.path, name: entry.name, content });
        }
      } catch (err) {
        console.error('Failed to read file:', err);
      }
    },
    [electronAPI, openFile],
  );

  if (error) {
    return (
      <div
        style={{
          padding: 16,
          color: '#71717a',
          fontSize: 12,
          fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 4, paddingBottom: 4 }}>
      {tree.map((node) => (
        <TreeNode
          key={node.entry.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={handleSelectFile}
          onToggleFolder={handleToggleFolder}
        />
      ))}
    </div>
  );
}
