import ModeToggle from "@/components/ModeToggle";
import PDFPageExtractor from "@/components/PdfExtrtact";
import Image from "next/image";

export default function Home() {
  return (
<div>
  <div className="absolute top-4 right-4">
    <ModeToggle className="border-none bg-transparent cursor-pointer rounded-full" />
  </div>
  <PDFPageExtractor/>
</div>
  );
}
