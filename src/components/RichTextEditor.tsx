import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, Underline } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

function toInitialHtml(value: string) {
  if (!value || /<[a-z][\s\S]*>/i.test(value)) return value;
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return value.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
}

export function RichTextEditor({ id, value, onChange }: { id?: string; value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, blockquote: false, codeBlock: false, code: false, horizontalRule: false, strike: false, orderedList: false, link: false }),
    ],
    content: toInitialHtml(value),
    editorProps: {
      attributes: {
        id: id ?? "",
        class: "min-h-24 px-3 py-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-1",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      underline: editor?.isActive("underline") ?? false,
      list: editor?.isActive("bulletList") ?? false,
    }),
  });

  useEffect(() => {
    if (editor && value === "" && !editor.isEmpty) editor.commands.clearContent();
  }, [editor, value]);

  const btn = (active: boolean | undefined, label: string, onClick: () => void, Icon: typeof Bold) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={!!active}
      onClick={onClick}
      className={cn("rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground", active && "bg-accent text-foreground")}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="rounded-md border border-input bg-transparent">
      <div className="flex gap-1 border-b border-input p-1">
        {btn(state?.bold, "Negrito", () => editor?.chain().focus().toggleBold().run(), Bold)}
        {btn(state?.italic, "Itálico", () => editor?.chain().focus().toggleItalic().run(), Italic)}
        {btn(state?.underline, "Sublinhado", () => editor?.chain().focus().toggleUnderline().run(), Underline)}
        {btn(state?.list, "Lista", () => editor?.chain().focus().toggleBulletList().run(), List)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
