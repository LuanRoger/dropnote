import { DocxExportPlugin } from "@platejs/docx-io";
import { KEYS } from "platejs";
import { CalloutElementDocx } from "../components/callout-node-static";
import {
  CodeBlockElementDocx,
  CodeLineElementDocx,
  CodeSyntaxLeafDocx,
} from "../components/code-block-node-static";
import {
  ColumnElementDocx,
  ColumnGroupElementDocx,
} from "../components/column-node-static";
import {
  EquationElementDocx,
  InlineEquationElementDocx,
} from "../components/equation-node-static";
import { TocElementDocx } from "../components/toc-node-static";

export const DocxExportKit = [
  DocxExportPlugin.configure({
    override: {
      components: {
        [KEYS.codeBlock]: CodeBlockElementDocx,
        [KEYS.codeLine]: CodeLineElementDocx,
        [KEYS.codeSyntax]: CodeSyntaxLeafDocx,
        [KEYS.column]: ColumnElementDocx,
        [KEYS.columnGroup]: ColumnGroupElementDocx,
        [KEYS.equation]: EquationElementDocx,
        [KEYS.inlineEquation]: InlineEquationElementDocx,
        [KEYS.callout]: CalloutElementDocx,
        [KEYS.toc]: TocElementDocx,
      },
    },
  }),
];
