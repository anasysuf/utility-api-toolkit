export function getPlaygroundHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Utility API Toolkit - Self-Hosted Playground</title>
  <meta name="description" content="Self-hosted utility API playground for image compression, QR generation, and slug conversion.">
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #10b981;
      --danger: #ef4444;
      --radius: 8px;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px 16px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
    }
    .badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      background: #1e3a8a;
      color: #93c5fd;
      padding: 3px 8px;
      border-radius: 4px;
      margin-left: 8px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-links a {
      color: #60a5fa;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      padding: 6px 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      transition: all 0.2s;
    }
    .nav-links a:hover {
      background: var(--border);
      color: #fff;
    }
    .auth-banner {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px 16px;
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }
    .auth-banner label {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .auth-banner input {
      flex: 1;
      min-width: 220px;
      padding: 8px 12px;
      background: #0b1120;
      border: 1px solid var(--border);
      border-radius: 6px;
      color: #fff;
      font-size: 0.875rem;
      font-family: monospace;
    }
    .auth-banner button {
      padding: 8px 16px;
      background: var(--border);
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
    }
    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
    }
    .tab-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 600;
      padding: 10px 16px;
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      color: #fff;
      background: rgba(51, 65, 85, 0.5);
    }
    .tab-btn.active {
      color: #fff;
      background: var(--primary);
    }
    .panel {
      display: none;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      margin-bottom: 24px;
    }
    .panel.active {
      display: block;
    }
    .form-group {
      margin-bottom: 18px;
    }
    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text);
    }
    input[type="text"], input[type="number"], select, textarea {
      width: 100%;
      padding: 10px 14px;
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 6px;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
    }
    input[type="text"]:focus, select:focus, textarea:focus {
      border-color: var(--primary);
    }
    .row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .btn-submit {
      padding: 10px 20px;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      min-height: 44px;
    }
    .btn-submit:hover {
      background: var(--primary-hover);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .result-box {
      margin-top: 20px;
      padding: 16px;
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 6px;
      display: none;
    }
    .result-box.show {
      display: block;
    }
    .result-box h4 {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .code-output {
      font-family: monospace;
      font-size: 0.95rem;
      color: #a7f3d0;
      word-break: break-all;
      background: #040813;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #1e293b;
    }
    .btn-copy {
      margin-top: 10px;
      padding: 6px 12px;
      background: #334155;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-copy:hover {
      background: #475569;
    }
    .error-box {
      margin-top: 16px;
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid var(--danger);
      color: #fca5a5;
      border-radius: 6px;
      font-size: 0.875rem;
      display: none;
    }
    .error-box.show {
      display: block;
    }
    .qr-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
    }
    .qr-preview img {
      max-width: 250px;
      background: #fff;
      padding: 12px;
      border-radius: 8px;
    }
    .img-dropzone {
      border: 2px dashed var(--border);
      border-radius: 8px;
      padding: 28px;
      text-align: center;
      cursor: pointer;
      background: #0f172a;
      transition: border-color 0.2s;
    }
    .img-dropzone:hover {
      border-color: var(--primary);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 12px;
      text-align: center;
    }
    .stat-card {
      background: #0f172a;
      border: 1px solid var(--border);
      padding: 12px;
      border-radius: 6px;
    }
    .stat-card .val {
      font-size: 1.1rem;
      font-weight: 700;
      color: #60a5fa;
    }
    .stat-card .lbl {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>Utility API Toolkit <span class="badge">Self-Hosted</span></h1>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 4px;">
          Modular REST API for image compression, QR generation, and slug conversion.
        </p>
      </div>
      <div class="nav-links">
        <a href="/docs" target="_blank">OpenAPI Docs (/docs)</a>
        <a href="https://github.com/anasysuf/utility-api-toolkit" target="_blank" rel="noopener">GitHub</a>
      </div>
    </header>

    <div class="auth-banner">
      <label for="apiKeyInput">API Key (Optional Header):</label>
      <input type="text" id="apiKeyInput" placeholder="Enter x-api-key if set in .env" value="test-secret-key-12345">
      <button type="button" onclick="saveApiKey()">Save Key</button>
    </div>

    <div class="tabs">
      <button class="tab-btn active" onclick="showTab('slug')">Text to Slug</button>
      <button class="tab-btn" onclick="showTab('qr')">QR Code</button>
      <button class="tab-btn" onclick="showTab('image')">Image Compressor</button>
    </div>

    <!-- Panel 1: Slug -->
    <div id="slug" class="panel active">
      <div class="form-group">
        <label for="slugText">Input Text</label>
        <input type="text" id="slugText" placeholder="e.g. Clean Code and Architecture in TypeScript" value="Clean Code and Architecture in TypeScript">
      </div>
      <div class="row">
        <div class="form-group">
          <label for="slugSeparator">Separator</label>
          <input type="text" id="slugSeparator" value="-" maxlength="5">
        </div>
        <div class="form-group">
          <label for="slugLowercase">Lowercase</label>
          <select id="slugLowercase">
            <option value="true" selected>True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
      <button class="btn-submit" id="btnGenSlug" onclick="generateSlug()">Generate Slug</button>
      <div id="slugError" class="error-box"></div>
      <div id="slugResult" class="result-box">
        <h4>Generated Slug</h4>
        <div id="slugOutput" class="code-output"></div>
        <button class="btn-copy" onclick="copySlug()">Copy to Clipboard</button>
      </div>
    </div>

    <!-- Panel 2: QR Code -->
    <div id="qr" class="panel">
      <div class="form-group">
        <label for="qrText">Text or URL</label>
        <input type="text" id="qrText" placeholder="https://github.com/anasysuf/utility-api-toolkit" value="https://github.com/anasysuf/utility-api-toolkit">
      </div>
      <div class="row">
        <div class="form-group">
          <label for="qrFormat">Format</label>
          <select id="qrFormat">
            <option value="base64" selected>Base64 JSON</option>
            <option value="png">PNG Binary</option>
            <option value="svg">SVG Markup</option>
          </select>
        </div>
        <div class="form-group">
          <label for="qrSize">Size (px)</label>
          <input type="number" id="qrSize" value="250" min="50" max="1000">
        </div>
      </div>
      <button class="btn-submit" id="btnGenQr" onclick="generateQr()">Generate QR Code</button>
      <div id="qrError" class="error-box"></div>
      <div id="qrResult" class="result-box">
        <h4>Generated QR Code</h4>
        <div class="qr-preview" id="qrPreviewArea"></div>
      </div>
    </div>

    <!-- Panel 3: Image Compressor -->
    <div id="image" class="panel">
      <div class="form-group">
        <label>Select Image File (JPEG, PNG, WebP up to 10MB)</label>
        <div class="img-dropzone" onclick="document.getElementById('imgFileInput').click()">
          <p id="dropzoneText">Click to browse or drag file here</p>
          <input type="file" id="imgFileInput" accept="image/jpeg,image/png,image/webp" style="display:none" onchange="handleFileSelected(this)">
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="imgQuality">Quality (1 - 100)</label>
          <input type="number" id="imgQuality" value="75" min="1" max="100">
        </div>
        <div class="form-group">
          <label for="imgFormat">Target Format</label>
          <select id="imgFormat">
            <option value="webp" selected>WebP (Recommended)</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </div>
      </div>
      <button class="btn-submit" id="btnCompressImg" onclick="compressImage()">Compress Image</button>
      <div id="imgError" class="error-box"></div>
      <div id="imgResult" class="result-box">
        <h4>Compression Results</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="val" id="statOrig">-</div>
            <div class="lbl">Original Size</div>
          </div>
          <div class="stat-card">
            <div class="val" id="statComp">-</div>
            <div class="lbl">Compressed Size</div>
          </div>
          <div class="stat-card">
            <div class="val" id="statSave">-</div>
            <div class="lbl">Saved</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 16px;">
          <a id="btnDownloadImg" class="btn-submit" style="display: inline-block; text-decoration: none; padding: 8px 16px;" download="compressed">Download Image</a>
        </div>
      </div>
    </div>
  </div>

  <script>
    const savedKey = localStorage.getItem("toolkit_api_key");
    if (savedKey) {
      document.getElementById("apiKeyInput").value = savedKey;
    }

    function saveApiKey() {
      const key = document.getElementById("apiKeyInput").value.trim();
      localStorage.setItem("toolkit_api_key", key);
      alert("API Key saved to browser local storage.");
    }

    function getApiKey() {
      return document.getElementById("apiKeyInput").value.trim();
    }

    function showTab(id) {
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.getElementById(id).classList.add("active");
      event.target.classList.add("active");
    }

    async function generateSlug() {
      const btn = document.getElementById("btnGenSlug");
      const errBox = document.getElementById("slugError");
      const resBox = document.getElementById("slugResult");
      errBox.classList.remove("show");
      resBox.classList.remove("show");
      btn.disabled = true;

      try {
        const text = document.getElementById("slugText").value;
        const separator = document.getElementById("slugSeparator").value;
        const lowercase = document.getElementById("slugLowercase").value === "true";

        const headers = { "Content-Type": "application/json" };
        const key = getApiKey();
        if (key) headers["x-api-key"] = key;

        const res = await fetch("/api/v1/slug", {
          method: "POST",
          headers,
          body: JSON.stringify({ text, separator, lowercase })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ? data.error.message : "Slug generation failed");
        }

        document.getElementById("slugOutput").textContent = data.data.slug;
        resBox.classList.add("show");
      } catch (err) {
        errBox.textContent = err.message;
        errBox.classList.add("show");
      } finally {
        btn.disabled = false;
      }
    }

    function copySlug() {
      const slug = document.getElementById("slugOutput").textContent;
      navigator.clipboard.writeText(slug);
      alert("Slug copied to clipboard!");
    }

    async function generateQr() {
      const btn = document.getElementById("btnGenQr");
      const errBox = document.getElementById("qrError");
      const resBox = document.getElementById("qrResult");
      const area = document.getElementById("qrPreviewArea");
      errBox.classList.remove("show");
      resBox.classList.remove("show");
      area.innerHTML = "";
      btn.disabled = true;

      try {
        const text = document.getElementById("qrText").value;
        const format = document.getElementById("qrFormat").value;
        const size = Number(document.getElementById("qrSize").value) || 250;

        const headers = { "Content-Type": "application/json" };
        const key = getApiKey();
        if (key) headers["x-api-key"] = key;

        const res = await fetch("/api/v1/qr/generate", {
          method: "POST",
          headers,
          body: JSON.stringify({ text, format, size })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error ? errData.error.message : "QR generation failed");
        }

        if (format === "base64") {
          const data = await res.json();
          const img = document.createElement("img");
          img.src = data.data.qr;
          img.alt = "QR Code";
          area.appendChild(img);
        } else if (format === "svg") {
          const svgText = await res.text();
          const div = document.createElement("div");
          div.innerHTML = svgText;
          area.appendChild(div);
        } else {
          const blob = await res.blob();
          const img = document.createElement("img");
          img.src = URL.createObjectURL(blob);
          img.alt = "QR Code";
          area.appendChild(img);
        }

        resBox.classList.add("show");
      } catch (err) {
        errBox.textContent = err.message;
        errBox.classList.add("show");
      } finally {
        btn.disabled = false;
      }
    }

    let selectedImageFile = null;
    function handleFileSelected(input) {
      if (input.files && input.files[0]) {
        selectedImageFile = input.files[0];
        document.getElementById("dropzoneText").textContent = selectedImageFile.name + " (" + Math.round(selectedImageFile.size / 1024) + " KB)";
      }
    }

    async function compressImage() {
      const btn = document.getElementById("btnCompressImg");
      const errBox = document.getElementById("imgError");
      const resBox = document.getElementById("imgResult");
      errBox.classList.remove("show");
      resBox.classList.remove("show");

      if (!selectedImageFile) {
        errBox.textContent = "Please select an image file first.";
        errBox.classList.add("show");
        return;
      }

      btn.disabled = true;
      try {
        const quality = document.getElementById("imgQuality").value;
        const format = document.getElementById("imgFormat").value;

        const formData = new FormData();
        formData.append("file", selectedImageFile);
        formData.append("quality", quality);
        formData.append("format", format);
        formData.append("response", "json");

        const headers = {};
        const key = getApiKey();
        if (key) headers["x-api-key"] = key;

        const res = await fetch("/api/v1/image/compress", {
          method: "POST",
          headers,
          body: formData
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ? data.error.message : "Compression failed");
        }

        document.getElementById("statOrig").textContent = Math.round(data.data.originalSize / 1024) + " KB";
        document.getElementById("statComp").textContent = Math.round(data.data.compressedSize / 1024) + " KB";
        document.getElementById("statSave").textContent = data.data.savingsPercentage + "%";

        const dlBtn = document.getElementById("btnDownloadImg");
        dlBtn.href = data.data.base64;
        dlBtn.download = "compressed." + data.data.format;

        resBox.classList.add("show");
      } catch (err) {
        errBox.textContent = err.message;
        errBox.classList.add("show");
      } finally {
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>`;
}
