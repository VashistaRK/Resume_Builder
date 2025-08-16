import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import { useContext, useState, useEffect, useCallback } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"; // Official build
import { AIChatSession } from "../../../../../service/AIModal";
import { toast } from "sonner";
/*eslint-disable*/

const PROMPT = `Position Title: {positionTitle}
Generate 5–7 resume bullet points for this job title in valid HTML format.
Respond ONLY with a <ul> containing <li> elements. Do NOT include any JSON, text explanations, or extra tags.`;

type Props = {
  index: number;
  defaultValue: string;
  onRichTextEditorChange: (value: string) => void;
};

function RichTextEditor({
  index,
  defaultValue,
  onRichTextEditorChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize value only once when defaultValue changes
  useEffect(() => {
    if (!isInitialized && defaultValue !== value) {
      setValue(defaultValue);
      setIsInitialized(true);
    }
  }, [defaultValue, value, isInitialized]);

  const generateSummaryFromAI = useCallback(async () => {
    const title = resumeInfo?.experience?.[index]?.position;
    if (!title) {
      toast(
        "Please add a position title or save data before generating summary"
      );
      return;
    }

    setLoading(true);
    try {
      const prompt = PROMPT.replace("{positionTitle}", title);
      const result = await AIChatSession.sendMessage(prompt);
      const raw = await result.response.text();
      // console.log("Raw AI response:", raw);

      // Since the prompt asks for HTML format, directly use the response
      // Clean up the response to ensure it's valid HTML
      let cleanedResponse = raw.trim();
      
      // Remove any markdown code blocks if present
      cleanedResponse = cleanedResponse.replace(/```html\n?/g, '').replace(/```\n?/g, '');
      
      let newValue = '';
      
      // Check if the response contains a <ul> tag
      if (cleanedResponse.includes('<ul>') && cleanedResponse.includes('</ul>')) {
        newValue = cleanedResponse;
      } else {
        // If no proper HTML structure, treat as plain text and convert to HTML
        const lines = cleanedResponse.split('\n').filter(line => line.trim());
        newValue = `<ul>${lines
          .map(line => `<li>${line.replace(/^[-*•]\s*/, '').trim()}</li>`)
          .join('')}</ul>`;
      }
      
      setValue(newValue);
      onRichTextEditorChange(newValue);
      toast("Summary generated successfully!");
    } catch (err) {
      toast("Failed to generate summary");
      console.error("Error generating summary:", err);
    } finally {
      setLoading(false);
    }
  }, [resumeInfo, index, onRichTextEditorChange]);

  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleEditorChange = useCallback((_event: any, editor: any) => {
    const data = editor.getData();
    if (data !== value) {
      setValue(data);
      onRichTextEditorChange(data);
    }
  }, [value, onRichTextEditorChange]);

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={generateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin h-4 w-4" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>

      <CKEditor
        editor={ClassicEditor as any} // Cast as any to fix TS typing error
        data={value}
        onChange={handleEditorChange}
        config={{
          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            // Removed underline and strikethrough to avoid issues
            "|",
            "link",
            "bulletedList",
            "numberedList",
            "indent",
            "outdent",
            "insertTable",
            "mediaEmbed",
          ],
          // allowedContent: true, // allow full HTML (can be risky - safe in this context)
          htmlSupport: {
            allow: [
              {
                name: "ul",
                attributes: true,
                classes: true,
                styles: true,
              },
              {
                name: "li",
                attributes: true,
                classes: true,
                styles: true,
              },
            ],
          },
        }}
      />
    </div>
  );
}

export default RichTextEditor;