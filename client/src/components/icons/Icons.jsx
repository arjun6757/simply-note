import { Bold, Underline, Italic, Heading1, Heading2, Heading3, List, ListOrdered, TextQuote, Image, AArrowDown, AArrowUp } from "lucide-react";

export function BoldIcon() {
    return <Bold className="h-4 w-4" />
}

export function UnderlineIcon() {
    return <Underline className="h-4 w-4" />
}

export function ItalicIcon() {
    return <Italic className="h-4 w-4" />
}

export function Heading1Icon() {
    return <Heading1 className="h-4 w-4" />
}

export function Heading2Icon() {
    return <Heading2 className="h-4 w-4" />
}

export function Heading3Icon() {
    return <Heading3 className="h-4 w-4" />
}

export function ListIcon() {
    return <List className="h-4 w-4" />
}

export function ListOrderedIcon() {
    return <ListOrdered className="h-4 w-4" />
}

export function QuoteIcon() {
    return <TextQuote className="h-4 w-4" />
}

export function ImageIcon() {
    return <Image className="h-4 w-4" />
}

export function IncreaseFontIcon() {
    return <AArrowUp className="h-4 w-4" />
}

export function DecreaseFontIcon() {
    return <AArrowDown className="h-4 w-4" />
}