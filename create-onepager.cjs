const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Icon rendering helpers
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

async function svgFileToBase64Png(filePath, width = 256) {
  const svgBuffer = fs.readFileSync(filePath);
  const pngBuffer = await sharp(svgBuffer).resize(width).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

async function main() {
  // Import icons
  const { MdRocketLaunch, MdDashboard, MdDescription, MdBugReport, MdApi } = require("react-icons/md");
  const { FaNetworkWired, FaFileAlt, FaBrain, FaRocket, FaCheckCircle, FaCog, FaShieldAlt, FaCloud } = require("react-icons/fa");
  const { HiLightningBolt, HiDocumentText } = require("react-icons/hi");

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Infinia Technologies";
  pres.title = "Infinia Product Suite - One Pager";

  // Colors
  const BG = "0F1419";
  const CARD_BG = "1A2332";
  const CARD_BORDER = "2A3A4E";
  const WHITE = "FFFFFF";
  const MUTED = "8899AA";
  const ACCENT_TEAL = "22D3EE";
  const ACCENT_VIOLET = "A78BFA";
  const ACCENT_AMBER = "FBBF24";
  const ACCENT_EMERALD = "34D399";
  const STATUS_ACTIVE = "34D399";
  const STATUS_DEV = "FBBF24";
  const STATUS_STAGING = "38BDF8";

  // Helper: fresh shadow factory
  const cardShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.3 });

  // Pre-render react-icons as fallbacks
  const [fallbackVulcan, fallbackDms, fallbackTestPilot, fallbackGateway] = await Promise.all([
    iconToBase64Png(MdDashboard, "#22D3EE", 256),
    iconToBase64Png(HiDocumentText, "#A78BFA", 256),
    iconToBase64Png(MdBugReport, "#FBBF24", 256),
    iconToBase64Png(FaNetworkWired, "#34D399", 256),
  ]);

  // Load actual product logos from SVG files
  // Vulcan PM - starburst/sun logo (render white on transparent)
  let vulcanLogo;
  try {
    const svgBuf = fs.readFileSync("/Users/gagan.kapoor/Downloads/Downloads/vulcan_logo.svg");
    // Replace dark fill with white for dark background
    let svgStr = svgBuf.toString();
    svgStr = svgStr.replace(/fill="#1E2328"/g, 'fill="none"');
    svgStr = svgStr.replace(/fill="#FFFFFF"/g, 'fill="#22D3EE"');
    svgStr = svgStr.replace(/fill="#CBD5E1"/g, 'fill="#22D3EE"');
    svgStr = svgStr.replace(/stroke="#CBD5E1"/g, 'stroke="#22D3EE"');
    svgStr = svgStr.replace(/#8899AA/g, '#22D3EE');
    const pngBuffer = await sharp(Buffer.from(svgStr)).resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    vulcanLogo = "image/png;base64," + pngBuffer.toString("base64");
  } catch (e) {
    console.log("Vulcan logo fallback:", e.message);
    vulcanLogo = fallbackVulcan;
  }

  // Vulcan DMS - V shape logo
  let dmsLogo;
  try {
    const dmsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 450" width="256" height="230" fill="#A78BFA">
      <polygon points="0,0 110,0 222,450 108,450" />
      <rect x="170" y="0" width="330" height="88" />
      <polygon points="170,88 500,88 340,450 222,450" />
    </svg>`;
    const pngBuffer = await sharp(Buffer.from(dmsSvg)).resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    dmsLogo = "image/png;base64," + pngBuffer.toString("base64");
  } catch (e) {
    console.log("DMS logo fallback:", e.message);
    dmsLogo = fallbackDms;
  }

  // Test Pilot - ChevronsRight style icon (>> arrow)
  let testPilotLogo;
  try {
    const tpSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m6 17 5-5-5-5"/>
      <path d="m13 17 5-5-5-5"/>
    </svg>`;
    const pngBuffer = await sharp(Buffer.from(tpSvg)).resize(256, 256).png().toBuffer();
    testPilotLogo = "image/png;base64," + pngBuffer.toString("base64");
  } catch (e) {
    console.log("Test Pilot logo fallback:", e.message);
    testPilotLogo = fallbackTestPilot;
  }

  // Corerun AI Gateway - network nodes logo (Token Factory logo)
  let gatewayLogo;
  try {
    const svgBuf = fs.readFileSync("/Users/gagan.kapoor/Downloads/Token Factory/assets/logo-black.svg");
    let svgStr = svgBuf.toString();
    // Recolor from black to emerald green for dark bg
    svgStr = svgStr.replace(/fill="#000000"/g, 'fill="#34D399"');
    const pngBuffer = await sharp(Buffer.from(svgStr)).resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    gatewayLogo = "image/png;base64," + pngBuffer.toString("base64");
  } catch (e) {
    console.log("Gateway logo fallback:", e.message);
    gatewayLogo = fallbackGateway;
  }

  const slide = pres.addSlide();
  slide.background = { color: BG };

  // ── Top bar accent line ──
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.04,
    fill: { color: ACCENT_TEAL }
  });

  // ── Header section ──
  // Company branding
  slide.addText("INFINIA", {
    x: 0.5, y: 0.15, w: 3, h: 0.4,
    fontSize: 14, fontFace: "Arial Black", color: ACCENT_TEAL,
    charSpacing: 6, margin: 0
  });
  slide.addText("TECHNOLOGIES", {
    x: 0.5, y: 0.45, w: 3, h: 0.25,
    fontSize: 8, fontFace: "Arial", color: MUTED,
    charSpacing: 4, margin: 0
  });

  // Title
  slide.addText("Product Suite", {
    x: 0.5, y: 0.75, w: 6, h: 0.45,
    fontSize: 26, fontFace: "Arial Black", color: WHITE, margin: 0
  });
  slide.addText("Building the AI infrastructure layer for the enterprise", {
    x: 0.5, y: 1.15, w: 8, h: 0.3,
    fontSize: 11, fontFace: "Arial", color: MUTED, margin: 0
  });

  // Status legend (top right)
  slide.addShape(pres.shapes.OVAL, { x: 6.9, y: 0.35, w: 0.12, h: 0.12, fill: { color: STATUS_ACTIVE } });
  slide.addText("Live", { x: 7.05, y: 0.27, w: 0.4, h: 0.3, fontSize: 9, fontFace: "Arial", color: STATUS_ACTIVE, margin: 0 });
  slide.addShape(pres.shapes.OVAL, { x: 7.45, y: 0.35, w: 0.12, h: 0.12, fill: { color: STATUS_STAGING } });
  slide.addText("Staging", { x: 7.6, y: 0.27, w: 0.6, h: 0.3, fontSize: 9, fontFace: "Arial", color: STATUS_STAGING, margin: 0 });
  slide.addShape(pres.shapes.OVAL, { x: 8.2, y: 0.35, w: 0.12, h: 0.12, fill: { color: STATUS_DEV } });
  slide.addText("In Development", { x: 8.35, y: 0.27, w: 1.2, h: 0.3, fontSize: 9, fontFace: "Arial", color: STATUS_DEV, margin: 0 });

  // ── Separator line ──
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 1.5, w: 9, h: 0,
    line: { color: "2A3A4E", width: 1 }
  });

  // ── Product Cards ──
  const cardW = 2.05;
  const cardH = 3.6;
  const startX = 0.5;
  const startY = 1.7;
  const gap = 0.3;

  const products = [
    {
      name: "Vulcan",
      subtitle: "Project Management",
      accent: ACCENT_TEAL,
      icon: vulcanLogo,
      status: "Live",
      statusColor: STATUS_ACTIVE,
      desc: "AI-powered product management platform with a 4-step wizard that transforms ideas into projects, Kanban boards, sprint planning, and 12 auto-generated documents.",
      features: ["AI Product Wizard (4-step)", "Kanban, List & Timeline", "12 Auto-Gen Documents", "SSO & Team Management"]
    },
    {
      name: "Vulcan DMS",
      subtitle: "Document Management",
      accent: ACCENT_VIOLET,
      icon: dmsLogo,
      status: "Staging",
      statusColor: STATUS_STAGING,
      desc: "Notion-style document management system with rich Tiptap editor, review/approval workflows, version control, and a public MkDocs-style reader portal.",
      features: ["Tiptap v3 Rich Editor", "Review & Approval Flow", "Version History & Diff", "Client-Themed Reader"]
    },
    {
      name: "Test Pilot",
      subtitle: "QA Automation",
      accent: ACCENT_AMBER,
      icon: testPilotLogo,
      status: "In Development",
      statusColor: STATUS_DEV,
      desc: "AI-driven QA platform that scans web apps, auto-generates test cases, and executes them via LLM-powered browser automation (Stagehand).",
      features: ["AI Test Generation", "Stagehand Automation", "Auth-Aware Testing", "Real-time Streaming"]
    },
    {
      name: "Corerun AI Gateway",
      subtitle: "LLM Infrastructure",
      accent: ACCENT_EMERALD,
      icon: gatewayLogo,
      status: "In Development",
      statusColor: STATUS_DEV,
      desc: "Multi-tenant LLM API gateway (OpenAI-compatible) with Envoy proxy, auth & rate limiting, K8s model deployment, GitOps, and live GPU metrics.",
      features: ["OpenAI-Compatible API", "Envoy + Go Control Plane", "K8s Model Deploy & GitOps", "Live GPU Metrics Dashboard"]
    }
  ];

  products.forEach((prod, i) => {
    const x = startX + i * (cardW + gap);
    const y = startY;

    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 0.5 },
      shadow: cardShadow()
    });

    // Top accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: 0.05,
      fill: { color: prod.accent }
    });

    // Logo - large and prominent
    const logoSize = 0.6;
    const logoCX = x + cardW / 2;
    const logoCY = y + 0.5;
    // Background circle for logo
    slide.addShape(pres.shapes.OVAL, {
      x: logoCX - 0.4, y: logoCY - 0.4, w: 0.8, h: 0.8,
      fill: { color: prod.accent, transparency: 80 },
      line: { color: prod.accent, width: 1.5, transparency: 50 }
    });
    // Logo image
    slide.addImage({
      data: prod.icon,
      x: logoCX - logoSize / 2, y: logoCY - logoSize / 2, w: logoSize, h: logoSize
    });

    // Status indicator (top right of card)
    slide.addShape(pres.shapes.OVAL, {
      x: x + cardW - 0.7, y: y + 0.12, w: 0.1, h: 0.1,
      fill: { color: prod.statusColor }
    });
    slide.addText(prod.status, {
      x: x + cardW - 0.6, y: y + 0.05, w: 0.55, h: 0.24,
      fontSize: 7, fontFace: "Arial", color: prod.statusColor, margin: 0
    });

    // Product name
    slide.addText(prod.name, {
      x: x + 0.12, y: y + 1.05, w: cardW - 0.24, h: 0.3,
      fontSize: 13, fontFace: "Arial Black", color: WHITE, margin: 0, align: "center"
    });

    // Subtitle
    slide.addText(prod.subtitle, {
      x: x + 0.12, y: y + 1.3, w: cardW - 0.24, h: 0.2,
      fontSize: 8, fontFace: "Arial", color: prod.accent, margin: 0, align: "center"
    });

    // Description
    slide.addText(prod.desc, {
      x: x + 0.12, y: y + 1.55, w: cardW - 0.24, h: 0.75,
      fontSize: 8, fontFace: "Arial", color: MUTED, margin: 0
    });

    // Divider
    slide.addShape(pres.shapes.LINE, {
      x: x + 0.12, y: y + 2.35, w: cardW - 0.24, h: 0,
      line: { color: CARD_BORDER, width: 0.5 }
    });

    // Features list
    const featureTexts = prod.features.map((feat, fi) => ({
      text: feat,
      options: {
        bullet: { code: "2022" },
        breakLine: fi < prod.features.length - 1,
        fontSize: 8,
        fontFace: "Arial",
        color: "C0CDD8",
        paraSpaceAfter: 4
      }
    }));
    slide.addText(featureTexts, {
      x: x + 0.12, y: y + 2.45, w: cardW - 0.24, h: 1.05,
      margin: 0, valign: "top"
    });
  });

  // ── Footer ──
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325,
    fill: { color: "111820" }
  });
  slide.addText("Infinia Technologies  |  IHC Group  |  Abu Dhabi, UAE", {
    x: 0.5, y: 5.32, w: 5, h: 0.28,
    fontSize: 8, fontFace: "Arial", color: MUTED, margin: 0
  });
  slide.addText("March 2026", {
    x: 7, y: 5.32, w: 2.5, h: 0.28,
    fontSize: 8, fontFace: "Arial", color: MUTED, align: "right", margin: 0
  });

  // Save
  const outputPath = "/Users/gagan.kapoor/Downloads/Token Factory/Infinia-Product-Suite-OnePager.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("Created:", outputPath);
}

main().catch(console.error);
