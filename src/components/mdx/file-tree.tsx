import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  FileTree                                                           */
/* ------------------------------------------------------------------ */

interface TreeNode {
  name: string;
  isFolder: boolean;
  children: TreeNode[];
}

function parseTreeText(text: string): TreeNode[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const root: TreeNode[] = [];
  const stack: { indent: number; children: TreeNode[] }[] = [
    { indent: -1, children: root },
  ];

  for (const line of lines) {
    const trimmed = line.replace(/^[\s│├└─┬┤┼]*/, "");
    const name = trimmed.trim();
    if (!name) continue;

    // Calculate indent level from leading spaces
    const indent = line.search(/\S/);
    const isFolder = name.endsWith("/");
    const cleanName = isFolder ? name.slice(0, -1) : name;

    const node: TreeNode = {
      name: cleanName,
      isFolder,
      children: [],
    };

    // Pop stack until we find a parent with smaller indent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);

    if (isFolder) {
      stack.push({ indent, children: node.children });
    }
  }

  return root;
}

function TreeItem({
  node,
  isLast,
  depth,
}: {
  node: TreeNode;
  isLast: boolean;
  depth: number;
}) {
  return (
    <li className="list-none">
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-sm px-1 py-0.5 text-sm",
          "hover:bg-muted/50"
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        {node.isFolder ? (
          <svg
            className="size-4 shrink-0 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
          </svg>
        ) : (
          <svg
            className="size-4 shrink-0 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          </svg>
        )}
        <span
          className={cn(
            "font-mono text-[13px]",
            node.isFolder ? "font-medium text-foreground" : "text-foreground/80"
          )}
        >
          {node.name}
        </span>
      </div>
      {node.children.length > 0 && (
        <ul className="m-0 p-0">
          {node.children.map((child, i) => (
            <TreeItem
              key={child.name}
              node={child}
              isLast={i === node.children.length - 1}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

interface FileTreeProps {
  children: ReactNode;
}

export function FileTree({ children }: FileTreeProps) {
  // Extract plain text from children
  const text =
    typeof children === "string"
      ? children
      : String(children ?? "");

  const tree = parseTreeText(text);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-muted/20">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
        <svg
          className="size-4 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
        <span className="text-xs font-medium text-muted-foreground">
          File Tree
        </span>
      </div>
      <ul className="m-0 p-2">
        {tree.map((node, i) => (
          <TreeItem
            key={node.name}
            node={node}
            isLast={i === tree.length - 1}
            depth={0}
          />
        ))}
      </ul>
    </div>
  );
}
