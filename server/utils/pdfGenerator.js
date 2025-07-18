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
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic&display=swap');
            body {
              font-family: 'Noto Sans Arabic', sans-serif;
              direction: rtl;
              padding: 2rem;
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
