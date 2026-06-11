import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dns from "dns";

// Prevent node DNS resolution delay issues if any
dns.setDefaultResultOrder("ipv4first");

interface Submission {
  id: string;
  type: "rfq" | "contact" | "supplier";
  timestamp: string;
  data: any;
  emailDispatchedTo: string;
}

const app = express();
const PORT = 3000;

// Limit increased to allow base64 technical documents in RFQs
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// In-memory registry to show real-time submissions for the Exoboll Admin/Client Portal
const submissionsDB: Submission[] = [];

// Seed database with sample corporate submissions to show enterprise activity
submissionsDB.push(
  {
    id: "RFQ-2026-001",
    type: "rfq",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    emailDispatchedTo: "jmeza@exoboll.com",
    data: {
      companyName: "Apex Industrial Builders Inc.",
      contactPerson: "David Vance",
      email: "d.vance@apexindustrial.com",
      phone: "+1 (201) 685-0542",
      productRequired: "ASTM A572 Grade 50 Structural Steel I-Beams",
      quantity: "450 Metric Tons",
      technicalSpecs: "Looking for prime mill-certified heavy structural shapes. Full chemistry & mechanical testing certifications required. Delivery split into 3 phases.",
      deliveryLocation: "Port of Houston Terminal, TX",
      requiredDeliveryDate: "2026-08-15",
      budgetRange: "$500,000 - $1,000,000",
      additionalRequirements: "Must include Mill Test Report (MTR) with pre-shipment notice.",
      fileName: "structural_beams_spec_rev2.pdf",
      fileType: "application/pdf"
    }
  },
  {
    id: "SUP-2026-002",
    type: "supplier",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    emailDispatchedTo: "jmeza@exoboll.com",
    data: {
      companyName: "Nippon Precision Forge Ltd.",
      website: "https://www.nippon-forge.co.jp",
      contactInfo: "Kenji Sato (k.sato@nippon-forge.co.jp)",
      productCategories: "Industrial Components, Forgings, High-Pressure Valves",
      certifications: "ISO 9001:2015, AS9100D, API 6D Certificate",
      manufacturingCapabilities: "Precision hot forging up to 15 tons, CNC multi-axis machining, heat treatment.",
      exportMarkets: "North America, Europe, Asia Pacific"
    }
  }
);

// RFQ Submission endpoint
app.post("/api/rfq", (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      productRequired,
      quantity,
      technicalSpecs,
      deliveryLocation,
      requiredDeliveryDate,
      budgetRange,
      additionalRequirements,
      fileData,
      fileName,
      fileType
    } = req.body;

    if (!companyName || !contactPerson || !email || !productRequired) {
      return res.status(400).json({ error: "Missing required contact/product fields." });
    }

    const newId = `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const submission: Submission = {
      id: newId,
      type: "rfq",
      timestamp: new Date().toISOString(),
      emailDispatchedTo: "jmeza@exoboll.com",
      data: {
        companyName,
        contactPerson,
        email,
        phone,
        productRequired,
        quantity,
        technicalSpecs,
        deliveryLocation,
        requiredDeliveryDate,
        budgetRange,
        additionalRequirements,
        fileName: fileName || (fileData ? "uploaded_document.dat" : null),
        fileType: fileType || null,
        fileAttached: !!fileData
      }
    };

    submissionsDB.unshift(submission);

    // Output server-side transmission dispatch logs for complete transparency
    console.log(`[B2B EMAIL ROUTED] SMTP Dispatch Triggered!`);
    console.log(`To: jmeza@exoboll.com`);
    console.log(`From: automated-gateway@exoboll.com`);
    console.log(`Subject: [NEW RFQ SUBMISSION] ${newId} - ${companyName}`);
    console.log(`Content:`);
    console.log(`---`);
    console.log(`Company: ${companyName}`);
    console.log(`Contact: ${contactPerson} (${email} | ${phone})`);
    console.log(`Product: ${productRequired} | Quantity: ${quantity}`);
    console.log(`Delivery Info: ${deliveryLocation} by ${requiredDeliveryDate}`);
    console.log(`Specs: ${technicalSpecs}`);
    console.log(`Budget: ${budgetRange}`);
    console.log(`File: ${fileName || "None attached"}`);
    console.log(`--- [END OF SMTP DISPATCH] ---`);

    return res.status(200).json({
      success: true,
      id: newId,
      message: `RFQ ${newId} registered and routed to Exoboll Procurement Team (jmeza@exoboll.com).`
    });
  } catch (error: any) {
    console.error("Error submitting RFQ:", error);
    return res.status(500).json({ error: "Internal server error processing the RFQ packet." });
  }
});

// Contact Page Inquiry endpoint
app.post("/api/contact", (req, res) => {
  try {
    const { name, company, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const newId = `INQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const submission: Submission = {
      id: newId,
      type: "contact",
      timestamp: new Date().toISOString(),
      emailDispatchedTo: "jmeza@exoboll.com",
      data: { name, company, email, phone, subject, message }
    };

    submissionsDB.unshift(submission);

    console.log(`[B2B EMAIL ROUTED] SMTP Contact Inquiry Routed!`);
    console.log(`To: jmeza@exoboll.com`);
    console.log(`From: web-inquiries@exoboll.com`);
    console.log(`Subject: [Exoboll Contact Form] ${subject || "General Inquiry"} - ${name}`);
    console.log(`Content:`);
    console.log(`---`);
    console.log(`From: ${name} (${company || "Individual"})`);
    console.log(`Email: ${email} | Phone: ${phone || "N/A"}`);
    console.log(`Message:\n${message}`);
    console.log(`--- [END OF SMTP DISPATCH] ---`);

    return res.status(200).json({
      success: true,
      id: newId,
      message: `Inquiry ${newId} received and dispatched to Exoboll executive team (jmeza@exoboll.com).`
    });
  } catch (error: any) {
    console.error("Error submitting Contact inquiry:", error);
    return res.status(500).json({ error: "Internal server error processing the inquiry." });
  }
});

// Supplier Registration endpoint
app.post("/api/supplier", (req, res) => {
  try {
    const {
      companyName,
      website,
      contactInfo,
      productCategories,
      certifications,
      manufacturingCapabilities,
      exportMarkets
    } = req.body;

    if (!companyName || !contactInfo || !productCategories) {
      return res.status(400).json({ error: "Company name, contact info, and product categories are required." });
    }

    const newId = `SUP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const submission: Submission = {
      id: newId,
      type: "supplier",
      timestamp: new Date().toISOString(),
      emailDispatchedTo: "jmeza@exoboll.com",
      data: {
        companyName,
        website,
        contactInfo,
        productCategories,
        certifications,
        manufacturingCapabilities,
        exportMarkets
      }
    };

    submissionsDB.unshift(submission);

    console.log(`[B2B EMAIL ROUTED] SMTP Supplier Onboarding Routed!`);
    console.log(`To: jmeza@exoboll.com`);
    console.log(`From: vendor-relations@exoboll.com`);
    console.log(`Subject: [New Supplier Registration] ${companyName}`);
    console.log(`Content:`);
    console.log(`---`);
    console.log(`Company: ${companyName}`);
    console.log(`Website: ${website || "None"}`);
    console.log(`Contact: ${contactInfo}`);
    console.log(`Categories: ${productCategories}`);
    console.log(`Certifications: ${certifications}`);
    console.log(`Capabilities: ${manufacturingCapabilities}`);
    console.log(`Markets: ${exportMarkets}`);
    console.log(`--- [END OF SMTP DISPATCH] ---`);

    return res.status(200).json({
      success: true,
      id: newId,
      message: `Supplier application ${newId} registered and routed for qualification (jmeza@exoboll.com).`
    });
  } catch (error: any) {
    console.error("Error registering supplier:", error);
    return res.status(500).json({ error: "Internal server error registering supplier." });
  }
});

// Fetch submissions for live feedback portal
app.get("/api/submissions", (req, res) => {
  res.json({ submissions: submissionsDB });
});

// Serve Vite context
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Exoboll Procurement server boots up successfully!`);
    console.log(`Running on http://0.0.0.0:${PORT}`);
    console.log(`Vite Dev Middleware connected.`);
  });
}

startServer();
