const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat
} = require("docx");

async function svgToPng(svgStr, width = 200) {
  return sharp(Buffer.from(svgStr)).resize(width, width, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function main() {
  // ── Prepare logos ──
  // Vulcan - starburst
  const vulcanSvg = fs.readFileSync("/Users/gagan.kapoor/Downloads/Downloads/vulcan_logo.svg", "utf8");
  const vulcanPng = await svgToPng(vulcanSvg.replace(/fill="#1E2328"/g, 'fill="none"').replace(/fill="#FFFFFF"/g, 'fill="#0E7490"').replace(/fill="#CBD5E1"/g, 'fill="#0E7490"').replace(/stroke="#CBD5E1"/g, 'stroke="#0E7490"').replace(/#8899AA/g, '#0E7490'), 120);

  // Vulcan DMS - V shape
  const dmsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 450" width="120" height="108" fill="#7C3AED"><polygon points="0,0 110,0 222,450 108,450"/><rect x="170" y="0" width="330" height="88"/><polygon points="170,88 500,88 340,450 222,450"/></svg>`;
  const dmsPng = await svgToPng(dmsSvg, 120);

  // Test Pilot - chevrons
  const tpSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>`;
  const tpPng = await svgToPng(tpSvg, 120);

  // Corerun - network nodes
  const gwSvg = fs.readFileSync("/Users/gagan.kapoor/Downloads/Token Factory/assets/logo-black.svg", "utf8");
  const gwPng = await svgToPng(gwSvg.replace(/fill="#000000"/g, 'fill="#059669"'), 120);

  // Vulcan hires logo for header
  const vulcanHiRes = fs.readFileSync("/Users/gagan.kapoor/Downloads/Downloads/vulcan_logo_hires.png");
  const headerLogo = await sharp(vulcanHiRes).resize(180, null).png().toBuffer();

  // ── Colors ──
  const TEAL = "0E7490";
  const VIOLET = "7C3AED";
  const AMBER = "D97706";
  const EMERALD = "059669";
  const DARK = "1F2937";
  const GRAY = "6B7280";
  const LIGHT_BG = "F9FAFB";
  const BORDER = "E5E7EB";

  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
  const thinBorder = (color) => ({ style: BorderStyle.SINGLE, size: 1, color });

  // Content width = 9360 DXA (US Letter with 1" margins)
  const contentWidth = 9360;
  const cardWidth = Math.floor(contentWidth / 2); // 4680 each

  function makeProductCard(name, subtitle, desc, features, statusText, statusColor, accentColor, logoPng) {
    const cellBorder = { style: BorderStyle.SINGLE, size: 6, color: accentColor };
    const cellBorderLight = { style: BorderStyle.SINGLE, size: 1, color: BORDER };

    return new TableCell({
      width: { size: cardWidth, type: WidthType.DXA },
      borders: {
        top: cellBorder,
        left: cellBorderLight,
        right: cellBorderLight,
        bottom: cellBorderLight,
      },
      shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      children: [
        // Logo + Status row via nested table
        new Table({
          width: { size: cardWidth - 400, type: WidthType.DXA },
          columnWidths: [800, cardWidth - 1200],
          rows: [new TableRow({
            children: [
              new TableCell({
                width: { size: 800, type: WidthType.DXA },
                borders: noBorders,
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({
                  spacing: { after: 0 },
                  children: [new ImageRun({
                    type: "png",
                    data: logoPng,
                    transformation: { width: 36, height: 36 },
                    altText: { title: name, description: `${name} logo`, name: `${name}-logo` },
                  })],
                })],
              }),
              new TableCell({
                width: { size: cardWidth - 1200, type: WidthType.DXA },
                borders: noBorders,
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: 0 },
                  children: [new TextRun({
                    text: `\u25CF ${statusText}`,
                    font: "Arial",
                    size: 16,
                    color: statusColor,
                    bold: true,
                  })],
                })],
              }),
            ],
          })],
        }),
        // Name
        new Paragraph({
          spacing: { before: 140, after: 0 },
          children: [new TextRun({ text: name, font: "Arial", size: 26, bold: true, color: DARK })],
        }),
        // Subtitle
        new Paragraph({
          spacing: { before: 40, after: 120 },
          children: [new TextRun({ text: subtitle, font: "Arial", size: 17, color: accentColor, bold: true })],
        }),
        // Description
        new Paragraph({
          spacing: { before: 0, after: 140 },
          children: [new TextRun({ text: desc, font: "Arial", size: 17, color: GRAY })],
        }),
        // Divider
        new Paragraph({
          spacing: { before: 0, after: 100 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER, space: 1 } },
          children: [],
        }),
        // Features
        ...features.map(f => new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: "\u25B8 ", font: "Arial", size: 16, color: accentColor }),
            new TextRun({ text: f, font: "Arial", size: 16, color: "4B5563" }),
          ],
        })),
      ],
    });
  }

  // ── Build products ──
  const vulcanCell = makeProductCard(
    "Vulcan", "Project Management",
    "AI-powered product management platform with a 4-step wizard that transforms ideas into projects, Kanban boards, sprint planning, and 12 auto-generated documents.",
    ["AI Product Wizard (4-step)", "Kanban, List & Timeline Views", "12 Auto-Generated Documents", "SSO & Team Management"],
    "Live", EMERALD, TEAL, vulcanPng
  );

  const dmsCell = makeProductCard(
    "Vulcan DMS", "Document Management",
    "Notion-style document management system with rich Tiptap editor, review/approval workflows, version control, and a public MkDocs-style reader portal.",
    ["Tiptap v3 Rich Editor", "Review & Approval Workflows", "Version History & Diff", "Client-Themed Reader Portal"],
    "Staging", "2563EB", VIOLET, dmsPng
  );

  const tpCell = makeProductCard(
    "Test Pilot", "QA Automation",
    "AI-driven QA platform that scans web apps, auto-generates test cases, and executes them via LLM-powered browser automation (Stagehand).",
    ["AI Test Case Generation", "Stagehand Browser Automation", "Auth-Aware Testing", "Real-time Streaming Results"],
    "In Development", AMBER, AMBER, tpPng
  );

  const gwCell = makeProductCard(
    "Corerun AI Gateway", "LLM Infrastructure",
    "Multi-tenant LLM API gateway (OpenAI-compatible) with Envoy proxy, auth & rate limiting, K8s model deployment, GitOps, and live GPU metrics.",
    ["OpenAI-Compatible Unified API", "Envoy + Go Control Plane", "K8s Model Deploy & GitOps", "Live GPU Metrics Dashboard"],
    "In Development", AMBER, EMERALD, gwPng
  );

  // ── Spacer cell ──
  const spacerCell = (w) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders: noBorders,
    children: [new Paragraph({ spacing: { after: 0 }, children: [] })],
  });

  const spacerWidth = 200;
  const actualCardWidth = Math.floor((contentWidth - spacerWidth) / 2);

  // ── Document ──
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1440, bottom: 720, left: 1440 },
        },
      },
      children: [
        // Header logo
        new Paragraph({
          spacing: { after: 0 },
          children: [new ImageRun({
            type: "png",
            data: headerLogo,
            transformation: { width: 140, height: 43 },
            altText: { title: "Infinia", description: "Infinia logo", name: "infinia-logo" },
          })],
        }),

        // Title
        new Paragraph({
          spacing: { before: 200, after: 0 },
          children: [new TextRun({ text: "Product Suite", font: "Arial", size: 44, bold: true, color: DARK })],
        }),

        // Tagline
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [new TextRun({ text: "Building the AI infrastructure layer for the enterprise", font: "Arial", size: 20, color: GRAY })],
        }),

        // Status legend
        new Paragraph({
          spacing: { before: 80, after: 200 },
          children: [
            new TextRun({ text: "\u25CF Live", font: "Arial", size: 16, color: EMERALD, bold: true }),
            new TextRun({ text: "     ", font: "Arial", size: 16 }),
            new TextRun({ text: "\u25CF Staging", font: "Arial", size: 16, color: "2563EB", bold: true }),
            new TextRun({ text: "     ", font: "Arial", size: 16 }),
            new TextRun({ text: "\u25CF In Development", font: "Arial", size: 16, color: AMBER, bold: true }),
          ],
        }),

        // Divider
        new Paragraph({
          spacing: { before: 0, after: 200 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BORDER, space: 1 } },
          children: [],
        }),

        // Row 1: Vulcan + Vulcan DMS
        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [actualCardWidth, spacerWidth, actualCardWidth],
          rows: [new TableRow({
            children: [
              makeProductCard(
                "Vulcan", "Project Management",
                "AI-powered product management platform with a 4-step wizard that transforms ideas into projects, Kanban boards, sprint planning, and 12 auto-generated documents.",
                ["AI Product Wizard (4-step)", "Kanban, List & Timeline Views", "12 Auto-Generated Documents", "SSO & Team Management"],
                "Live", EMERALD, TEAL, vulcanPng
              ),
              spacerCell(spacerWidth),
              makeProductCard(
                "Vulcan DMS", "Document Management",
                "Notion-style document management system with rich Tiptap editor, review/approval workflows, version control, and a public MkDocs-style reader portal.",
                ["Tiptap v3 Rich Editor", "Review & Approval Workflows", "Version History & Diff", "Client-Themed Reader Portal"],
                "Staging", "2563EB", VIOLET, dmsPng
              ),
            ],
          })],
        }),

        // Gap between rows
        new Paragraph({ spacing: { before: 160, after: 0 }, children: [] }),

        // Row 2: Test Pilot + Corerun
        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [actualCardWidth, spacerWidth, actualCardWidth],
          rows: [new TableRow({
            children: [
              makeProductCard(
                "Test Pilot", "QA Automation",
                "AI-driven QA platform that scans web apps, auto-generates test cases, and executes them via LLM-powered browser automation (Stagehand).",
                ["AI Test Case Generation", "Stagehand Browser Automation", "Auth-Aware Testing", "Real-time Streaming Results"],
                "In Development", AMBER, AMBER, tpPng
              ),
              spacerCell(spacerWidth),
              makeProductCard(
                "Corerun AI Gateway", "LLM Infrastructure",
                "Unified open-source LLM inference platform providing dual-compatible API endpoints (OpenAI + Anthropic) to open-source and fine-tuned models on self-hosted GPUs with cost intelligence, enterprise governance, and compliance-as-architecture.",
                ["Dual API (OpenAI + Anthropic)", "Self-Hosted GPU Inference", "Cost Intelligence & Billing", "Enterprise Governance & Compliance"],
                "In Development", AMBER, EMERALD, gwPng
              ),
            ],
          })],
        }),

        // Footer
        new Paragraph({ spacing: { before: 300, after: 0 }, children: [] }),
        new Paragraph({
          spacing: { before: 0, after: 0 },
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: BORDER, space: 4 } },
          children: [
            new TextRun({ text: "Infinia Technologies  |  IHC Group  |  Abu Dhabi, UAE  |  March 2026", font: "Arial", size: 15, color: "9CA3AF" }),
          ],
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = "/Users/gagan.kapoor/Downloads/Token Factory/Infinia-Product-Suite-OnePager.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("Created:", outPath);
}

main().catch(console.error);
