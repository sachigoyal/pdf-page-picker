import ModeToggle from "@/components/ModeToggle";
import PDFPageExtractor from "@/components/PdfExtract";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <a
          href="https://github.com/sachigoyal/pdf-page-picker"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <Icons.Github className="w-5 h-5" />
        </a>
        <ModeToggle className="border-none bg-transparent cursor-pointer rounded-full" />
      </div>
      <PDFPageExtractor />
    </div>
  );
}
