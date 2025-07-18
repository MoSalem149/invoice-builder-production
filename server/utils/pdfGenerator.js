import puppeteer from "puppeteer";
import fs from "fs";

export const htmlToPdf = async (html) => {
  console.log("HTML content received:", html);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    const wrappedHtml = `
  <!DOCTYPE html>
  <html lang="${html.includes('dir="rtl"') ? "ar" : "en"}" dir="${
      html.includes('dir="rtl"') ? "rtl" : "ltr"
    }">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: ${
            html.includes('dir="rtl"')
              ? "'Noto Sans Arabic', sans-serif"
              : "Arial, sans-serif"
          };
          direction: ${html.includes('dir="rtl"') ? "rtl" : "ltr"};
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
  </html>
`;

    // Optional: save to a file to debug
    fs.writeFileSync("invoice-preview.html", wrappedHtml, "utf8");

    await page.setContent(wrappedHtml, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    return pdf;
  } finally {
    await browser.close();
  }
};
