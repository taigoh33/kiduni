import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

dotenv.config();

// Initialize Gemini with telemetry header as required by skill
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Database path for registered users
  const USERS_DB_PATH = path.join(process.cwd(), "users.json");

  // Helper to load registered users from database
  const loadUsersDatabase = () => {
    try {
      if (fs.existsSync(USERS_DB_PATH)) {
        const fileContent = fs.readFileSync(USERS_DB_PATH, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error("[Database] Error loading users.json:", e);
    }
    // Seed default admin/teacher account if database does not exist
    return {
      "teacher": { username: "Teacher", password: "123456", paid: true }
    };
  };

  // Helper to save registered users to database
  const saveUsersDatabase = (users: any) => {
    try {
      fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error("[Database] Error saving users.json:", e);
      return false;
    }
  };

  // AI Routes
  app.post("/api/ai/analyze-drawing", async (req, res) => {
    try {
      const { image, ageGroup } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "AI API Key is missing on server. Check Settings > Secrets." });
      }

      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      // Extract base64 correctly or fetch if URL
      let base64Data: string;
      let finalMimeType = 'image/jpeg';

      if (image.startsWith('http')) {
        try {
          console.log(`[AI Analysis] Fetching image from URL: ${image.substring(0, 50)}...`);
          const fetchRes = await fetch(image);
          if (!fetchRes.ok) throw new Error(`Failed to fetch image: ${fetchRes.statusText} (${fetchRes.status})`);
          const buffer = await fetchRes.arrayBuffer();
          base64Data = Buffer.from(buffer).toString('base64');
          const contentType = fetchRes.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) finalMimeType = contentType;
          console.log(`[AI Analysis] URL fetch successful. MimeType: ${finalMimeType}`);
        } catch (fetchErr: any) {
          console.error(`[AI Analysis] URL Fetch Error:`, fetchErr);
          return res.status(400).json({ error: `Could not retrieve image from the provided URL. ${fetchErr.message}` });
        }
      } else {
        if (image.includes('base64,')) {
          const parts = image.split('base64,');
          base64Data = parts[1];
          const mimeMatch = parts[0].match(/data:([a-zA-Z0-9.+/-]+);/);
          if (mimeMatch) finalMimeType = mimeMatch[1];
        } else if (image.includes(',')) {
          base64Data = image.split(',')[1];
        } else {
          base64Data = image; 
        }
        console.log(`[AI Analysis] Base64 image received. MimeType: ${finalMimeType}, Data length: ${base64Data.length}`);
      }
      
      const promptText = `Imagine you are a kid-friendly psychologist and a magical storyteller. 
Analyze this ${ageGroup}-year-old child's artwork.
Focus on being POSITIVE, encouraging, and non-diagnostic for the analysis.
Then, based on the drawing, create a short, magical story where the characters or elements in the drawing come to life!

You MUST follow this exact format:
[ANALYSIS_ZH]
(Simplified Chinese analysis)
[STORY_ZH]
(Simplified Chinese story)

[ANALYSIS_EN]
(English analysis)
[STORY_EN]
(English story)

[ANALYSIS_MS]
(Malay analysis)
[STORY_MS]
(Malay story)

Keep analysis parts around 60-80 words/characters and stories around 70-80 words/characters. Do not include anything else.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are a professional children's psychologist and storyteller. You ALWAYS provide analysis and stories in THREE languages: Simplified Chinese, English, and Malay. Never omit any language. Use the exact tags [ANALYSIS_ZH], [STORY_ZH], [ANALYSIS_EN], [STORY_EN], [ANALYSIS_MS], [STORY_MS].",
          temperature: 0.7
        },
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: finalMimeType,
                data: base64Data
              }
            },
            { text: promptText }
          ]
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty analysis from AI");
      
      res.json({ analysis: text });
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze drawing" });
    }
  });

  app.post("/api/ai/magic-explorer", async (req, res) => {
    try {
      const { image } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "AI API Key missing" });
      }

      if (!image) {
        return res.status(400).json({ error: "No image" });
      }

      let base64Data: string;
      let finalMimeType = 'image/jpeg';

      if (image.includes('base64,')) {
        const parts = image.split('base64,');
        base64Data = parts[1];
        const mimeMatch = parts[0].match(/data:([a-zA-Z0-9.+/-]+);/);
        if (mimeMatch) finalMimeType = mimeMatch[1];
      } else {
        base64Data = image; 
      }
      
      const promptText = `Imagine you are an "AI Magic Lens" for children. 
Explore this image and provide a fun, educational, and magical response.

You MUST follow this exact format:
[ID_ZH] (Simplified Chinese: Identify what is in the picture in 1-3 words)
[FACT_ZH] (Simplified Chinese: A short educational fact, max 20 characters)
[STORY_ZH] (Simplified Chinese: A magical story about the image. TARGET: exactly 80-100 characters)

[ID_EN] (English: Identity, 1-3 words)
[FACT_EN] (English: Short Fact, max 10 words)
[STORY_EN] (English: Story. TARGET: exactly 30-40 words)

[ID_MS] (Malay: Identiti, 1-3 perkataan)
[FACT_MS] (Malay: Fakta pendek, maks 10 perkataan)
[STORY_MS] (Malay: Cerita. TARGET: tepat 30-40 perkataan)

Be extremely trilingual. Don't omit any section. The total length for each language should be very concise, focusing on the story being short and magical. ZH: 80-100 chars, EN/MS: 30-40 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are a friendly AI tutor and storyteller for kids. You ALWAYS output content in ZH, EN, and MS using the specific tags provided. Use simple, child-friendly language. STORY MUST be around 80 characters/words. Concise and magical.",
          temperature: 0.8
        },
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: finalMimeType,
                data: base64Data
              }
            },
            { text: promptText }
          ]
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      
      res.json({ result: text });
    } catch (error: any) {
      console.error("AI Magic Explorer error:", error);
      res.status(500).json({ error: error.message || "Failed exploration" });
    }
  });

  app.post("/api/ai/generate-story", async (req, res) => {
    try {
      const { theme, customDescription, childName, lang } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "AI API Key is missing on server. Check Settings > Secrets." });
      }

      const childContext = childName?.trim() ? `The main character is a child named "${childName}". Please include their name throughout the story as the protagonist.` : "The main character should be a relatable child.";
      const userPromptDetails = customDescription?.trim() ? `with specific details: "${customDescription}"` : `about "${theme}"`;

      const promptText = `Write a TRILINGUAL bedtime story for a 5-year-old child ${userPromptDetails}. 
      ${childContext}
      The story must be positive and end with a gentle lesson.
      
      CRITICAL REQUIREMENT: 
      1. You MUST provide the story in THREE languages: Simplified Chinese, English, AND Malay.
      2. The TITLE field MUST be in ${lang === 'zh' ? 'Simplified Chinese ONLY' : lang === 'ms' ? 'Malay ONLY' : 'English ONLY'}. DO NOT use English if the user is in Chinese mode.
      3. Skip any preamble or conversational filler. NEVER say "Okay" or "Sure". Go STRAIGHT to the story content.
      
      You MUST follow this EXACT format:
      TITLE: [One short Title in ${lang === 'zh' ? 'Simplified Chinese' : lang === 'ms' ? 'Malay' : 'English'}]
      CONTENT:
      [ZH]
      (Simplified Chinese version here. You MUST include Pinyin in brackets for ALL difficult words, e.g. 勇敢(yǒng gǎn))
      
      [EN]
      (English version here)
      
      [MS]
      (Malay version here)

      Keep each language section around 60-80 words/characters.
      Do not include any preamble. Start directly with TITLE:`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptText,
        config: {
          systemInstruction: `You are a professional children's storyteller. You ALWAYS provide stories in THREE languages: Simplified Chinese, English, and Malay. Never omit any language. Always use the markers [ZH], [EN], and [MS]. NO PREAMBLE. NO CONVERSATION. ONLY THE STORY.`,
          temperature: 0.8
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty story from AI");
      
      res.json({ story: text });
    } catch (error: any) {
      console.error("AI Story generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate story" });
    }
  });

  app.post("/api/ai/translate", async (req, res) => {
    try {
      const { text, sourceLang } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "AI API Key is missing on server. Check Settings > Secrets." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate "${text}" to Simplified Chinese, English, and Malay (from ${sourceLang}). Also provide pinyin for the Chinese translation.`,
        config: {
          systemInstruction: "You are a professional trilingual translator for kids. Return ONLY a JSON object.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              zh: { type: Type.STRING },
              en: { type: Type.STRING },
              ms: { type: Type.STRING },
              pinyin: { type: Type.STRING }
            },
            required: ["zh", "en", "ms", "pinyin"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Translation failed");
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error("AI Translation error:", error);
      res.status(500).json({ error: error.message || "Translation error" });
    }
  });

  app.post("/api/ai/generate-flashcard", async (req, res) => {
    try {
      const { text } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "AI API Key is missing on server. Check Settings > Secrets." });
      }

      if (!text || !text.trim()) {
        return res.status(400).json({ error: "Input text is required" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a children's learning card details based on the input term: "${text}". The term can be in English, Chinese, or Malay. Translate/generate details so we have:
1. Simplified Chinese word (zh)
2. Accurate Pinyin for the Chinese word with tone marks (pinyin)
3. English translation/word (en)
4. Malay translation/word (ms)
5. A single, highly relevant, specific emoji representing this item (emoji)
6. Choose the most appropriate general theme from: "school", "nature", "food", "family" (theme).`,
        config: {
          systemInstruction: "You are a professional children's trilingual educator. Generate and return a clean, correct flashcard object matching the exact JSON schema provided.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              zh: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              en: { type: Type.STRING },
              ms: { type: Type.STRING },
              emoji: { type: Type.STRING },
              theme: { type: Type.STRING }
            },
            required: ["zh", "pinyin", "en", "ms", "emoji", "theme"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Flashcard generation failed");
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error("AI Flashcard Generation error:", error);
      res.status(500).json({ error: error.message || "Flashcard generation error" });
    }
  });

  // Billplz Settings (These should be in .env)
  const BILLPLZ_API_KEY = process.env.BILLPLZ_API_KEY || "YOUR_API_KEY";
  const BILLPLZ_COLLECTION_ID = process.env.BILLPLZ_COLLECTION_ID || "YOUR_COLLECTION_ID";
  
  // Force Production mode if BILLPLZ_PRODUCTION is 'true', otherwise check NODE_ENV
  const IS_PRODUCTION = process.env.BILLPLZ_PRODUCTION === "true" || process.env.NODE_ENV === "production";
  const BILLPLZ_URL = IS_PRODUCTION 
    ? "https://www.billplz.com/api/v3/bills" 
    : "https://www.billplz-sandbox.com/api/v3/bills";
  
  console.log(`[Billplz Setup] Mode: ${IS_PRODUCTION ? 'PRODUCTION' : 'SANDBOX'}`);
  if (!IS_PRODUCTION) {
    console.log(`[Billplz Setup] Using sandbox URL. If you have production keys, set BILLPLZ_PRODUCTION=true in Settings.`);
  }

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  app.post("/api/checkout/create-bill", async (req, res) => {
    try {
      const { planId, planName, amount, email, name, phone, paymentMethod, username, password } = req.body;

      // Validate inputs
      if (!planId || !amount || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (username && password) {
        const cleanUsername = username.trim();
        const key = cleanUsername.toLowerCase();
        
        // Block taken whitelisted users
        const staticUsersEnv = process.env.ALLOWED_USERS || "";
        const staticUsersList = staticUsersEnv.split(",").filter(Boolean);
        for (const entry of staticUsersList) {
          const [u] = entry.split(":");
          if (u && u.trim().toLowerCase() === key) {
            return res.status(400).json({ error: "Username is already reserved. Please choose another username." });
          }
        }

        const users = loadUsersDatabase();
        if (users[key] && users[key].paid) {
          return res.status(400).json({ error: "Username is already taken by an active subscriber. Please choose another." });
        }
      }

      // Billplz expects amount in cents
      const amountInCents = Math.round(parseFloat(amount) * 100);

      // Support dynamic key inputs directly from frontend (Enter environment variables to continue)
      const { billplzApiKey, billplzCollectionId } = req.body;
      const activeApiKey = (billplzApiKey && billplzApiKey.trim()) || BILLPLZ_API_KEY;
      const activeCollectionId = (billplzCollectionId && billplzCollectionId.trim()) || BILLPLZ_COLLECTION_ID;

      if (activeApiKey === "YOUR_API_KEY" || activeCollectionId === "YOUR_COLLECTION_ID" || !activeApiKey || !activeCollectionId) {
        return res.status(400).json({ 
          error: "Billplz not configured", 
          message: "Please set BILLPLZ_API_KEY and BILLPLZ_COLLECTION_ID in the app settings, or enter them in the config settings below." 
        });
      }

      // Basic Auth for Billplz: base64(api_key:)
      const auth = Buffer.from(`${activeApiKey}:`).toString('base64');

      console.log(`[Billplz Checkout] Attempting to create bill...`);
      console.log(`[Billplz Checkout] Key: ${activeApiKey.substring(0, 5)}...`);
      console.log(`[Billplz Checkout] Collection: ${activeCollectionId}`);
      console.log(`[Billplz Checkout] Mode: ${IS_PRODUCTION ? 'PROD' : 'SANDBOX'}`);
      
      const formData = new URLSearchParams();
      formData.append("collection_id", activeCollectionId);
      formData.append("email", email);
      formData.append("name", name || username || "Customer");
      formData.append("amount", amountInCents.toString());
      formData.append("callback_url", `${req.headers.origin}/api/hooks/billplz`);
      formData.append("description", `KidUni ${planName}${paymentMethod ? ` (${paymentMethod.toUpperCase()})` : ''}`);
      formData.append("redirect_url", `${req.headers.origin}/payment-status`);
      if (phone) formData.append("mobile", phone);
      if (paymentMethod) {
        formData.append("reference_1_label", "Payment Method");
        formData.append("reference_1", paymentMethod.toUpperCase());
      }
      formData.append("deliver", "true");

      const response = await fetch(BILLPLZ_URL, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString(),
      });

      let data;
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("[Billplz] Non-JSON response:", responseText);
        return res.status(500).json({ 
          error: "Billplz API returned invalid response", 
          message: responseText.substring(0, 200)
        });
      }
      
      if (response.ok && data.id && data.url) {
        console.log(`[Billplz] Bill created: ${data.id}`);

        // Register pending paid user in users.json!
        if (username && password) {
          const cleanUsername = username.trim();
          const cleanPassword = password.trim();
          const key = cleanUsername.toLowerCase();
          
          const users = loadUsersDatabase();
          users[key] = {
            username: cleanUsername,
            password: cleanPassword,
            email: email,
            phone: phone || "",
            billId: data.id,
            paid: false,
            planId: planId,
            registeredAt: new Date().toISOString()
          };
          saveUsersDatabase(users);
          console.log(`[Database] Registered pending subscription for ${cleanUsername} under bill ${data.id}`);
        }
        
        let finalUrl = data.url;
        if (paymentMethod) {
          // Map internal method IDs to Billplz method codes
          // Codes: fpx, tng, grabpay, boost
          let bpMethod = paymentMethod;
          if (paymentMethod === "grab") bpMethod = "grabpay";
          
          // Billplz documentation suggests lowercase codes
          // Use auto_submit=1 (numeric) as it's more common in web parameters
          finalUrl += (finalUrl.includes("?") ? "&" : "?") + `payment_method=${bpMethod.toLowerCase()}&auto_submit=1`;
          console.log(`[Billplz] Redirecting with payment_method=${bpMethod.toLowerCase()} and auto_submit=1`);
        }

        return res.json({ 
          redirectUrl: finalUrl, 
          billCode: data.id 
        });
      } else {
        const errorMsg = data.error?.message || data.message || JSON.stringify(data);
        console.error("[Billplz] API Failure:", errorMsg);
        return res.status(response.status || 500).json({ 
          error: "Failed to create bill with Billplz", 
          message: errorMsg,
          details: data 
        });
      }
    } catch (error) {
      console.error("Checkout server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Verification/Activation route for payments
  app.post("/api/auth/verify-and-activate", async (req, res) => {
    try {
      const { billId, billplzApiKey } = req.body;
      if (!billId) {
        return res.status(400).json({ error: "Bill ID is required" });
      }

      console.log(`[Activation] Verifying bill ID: ${billId}`);
      const users = loadUsersDatabase();
      let foundKey = "";
      for (const k in users) {
        if (users[k].billId === billId) {
          foundKey = k;
          break;
        }
      }

      if (!foundKey) {
        console.error(`[Activation] No pending account exists for bill ID: ${billId}`);
        return res.status(444).json({ error: "No pending registration found for this payment reference." });
      }

      const getBillUrl = IS_PRODUCTION 
        ? `https://www.billplz.com/api/v3/bills/${billId}`
        : `https://www.billplz-sandbox.com/api/v3/bills/${billId}`;

      const activeApiKey = (billplzApiKey && billplzApiKey.trim()) || BILLPLZ_API_KEY;
      const auth = Buffer.from(`${activeApiKey}:`).toString('base64');
      const bpResponse = await fetch(getBillUrl, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${auth}`
        }
      });

      if (!bpResponse.ok) {
        console.error(`[Activation] Billplz gateway query failed. Status: ${bpResponse.status}`);
        return res.status(400).json({ error: "Could not query payment details from Billplz gateway" });
      }

      const billData = await bpResponse.json();
      const isPaid = billData.paid === true || billData.paid === "true" || billData.state === "paid";

      if (isPaid) {
        users[foundKey].paid = true;
        users[foundKey].activatedAt = new Date().toISOString();
        saveUsersDatabase(users);
        console.log(`[Database] Successfully verified and activated user: ${users[foundKey].username}`);
        return res.json({ 
          success: true, 
          username: users[foundKey].username,
          planId: users[foundKey].planId
        });
      }

      console.log(`[Activation] Bill is not paid yet: ${billData.state}`);
      return res.status(400).json({ error: "This bill has not been paid yet." });
    } catch (e: any) {
      console.error("[Verify and Activate] Error:", e);
      return res.status(500).json({ error: "Error verifying payment status: " + e.message });
    }
  });

  // Webhook for Billplz
  app.post("/api/hooks/billplz", (req, res) => {
    console.log("Billplz Webhook received:", req.body);
    const { id, paid, state } = req.body;
    const isPaid = paid === "true" || paid === true || state === "paid";
    
    if (id && isPaid) {
      const users = loadUsersDatabase();
      let found = false;
      for (const k in users) {
        if (users[k].billId === id) {
          users[k].paid = true;
          users[k].activatedAt = new Date().toISOString();
          found = true;
          break;
        }
      }
      if (found) {
        saveUsersDatabase(users);
        console.log(`[Webhook] Activated account for bill ID ${id}`);
      }
    }
    res.send("OK");
  });

  // Endpoint for student signup/registration
  app.post("/api/auth/register", (req, res) => {
    const { username, password, registrationKey } = req.body;

    if (!username || !password || !registrationKey) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    const keyToCheck = registrationKey.trim();

    // Check school registration key. Fallback to "KIDUNI2026" if not set in Settings > Secrets.
    const expectedRegKey = (process.env.REGISTRATION_KEY || "KIDUNI2026").trim();

    if (keyToCheck !== expectedRegKey) {
      return res.status(400).json({ error: "Invalid school registration key" });
    }

    if (cleanUsername.length < 2) {
      return res.status(400).json({ error: "Username must be at least 2 characters" });
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const key = cleanUsername.toLowerCase();
    
    // Check static whitelist
    const staticUsers = (process.env.ALLOWED_USERS || "")
      .split(",")
      .filter(Boolean)
      .map(entry => {
        const [u, p] = entry.split(":");
        return { u: u?.trim().toLowerCase(), p: p?.trim() };
      });

    const isReservedInStatic = staticUsers.some(u => u.u === key);
    if (isReservedInStatic) {
      return res.status(400).json({ error: "Username is already reserved" });
    }

    // Check and save to user DB
    const users = loadUsersDatabase();
    if (users[key]) {
      return res.status(400).json({ error: "Username already exists" });
    }

    users[key] = {
      username: cleanUsername,
      password: cleanPassword,
      paid: true,
      registeredAt: new Date().toISOString()
    };

    if (saveUsersDatabase(users)) {
      console.log(`[Database] User registered successfully via registration key: ${cleanUsername}`);
      return res.json({ success: true, username: cleanUsername });
    } else {
      return res.status(500).json({ error: "Failed to write user account to server" });
    }
  });

  // Secure Server-Side Login to support a customizable environment variable APP_PASSWORD or specific accounts
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check dynamic database users.json FIRST (allows overrides of static/default passwords)
    const users = loadUsersDatabase();
    const dbUser = users[cleanUsername];
    if (dbUser && dbUser.password === cleanPassword) {
      // Allow if:
      // - The user is "teacher"
      // - The user's account is verified paid (dbUser.paid === true)
      // - Or the user registered with a school registration key, and therefore does not have a Billplz billing ID (dbUser.billId is undefined)
      if (cleanUsername === "teacher" || dbUser.paid === true || !dbUser.billId) {
        console.log(`[Auth] Database login successful: ${dbUser.username}`);
        return res.json({ success: true, username: dbUser.username, isSubscribed: true });
      } else {
        console.warn(`[Auth] Login rejected for ${dbUser.username}: Payment not paid/verified.`);
        return res.status(401).json({ error: "Access Denied. Your subscription payment is not verified. Please register & buy a subscription to log in." });
      }
    }

    // 2. Check static whitelist fallback (e.g. ALLOWED_USERS=student1:123,student2:456)
    const allowedUsersEnv = process.env.ALLOWED_USERS || "";
    if (allowedUsersEnv) {
      const staticUsersList = allowedUsersEnv.split(",").filter(Boolean);
      for (const entry of staticUsersList) {
        const [u, p] = entry.split(":");
        if (u && p && u.trim().toLowerCase() === cleanUsername && p.trim() === cleanPassword) {
          console.log(`[Auth] Static Whitelist login successful: ${u.trim()}`);
          return res.json({ success: true, username: u.trim() });
        }
      }
    }

    return res.status(401).json({ error: "Invalid username or password" });
  });

  // Secure password customization to satisfy Google/Chrome leak check warnings
  app.post("/api/auth/change-password", (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanCurrentPassword = currentPassword.trim();
    const cleanNewPassword = newPassword.trim();

    if (cleanNewPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    if (cleanCurrentPassword === cleanNewPassword) {
      return res.status(400).json({ error: "New password cannot be the same as the old password" });
    }

    const users = loadUsersDatabase();
    let dbUser = users[cleanUsername];

    // If user is not yet in users.json but is the default 'teacher' or in ALLOWED_USERS whitelist
    if (!dbUser) {
      if (cleanUsername === "teacher" && cleanCurrentPassword === "123456") {
        dbUser = {
          username: "Teacher",
          password: "123456",
          paid: true,
          registeredAt: new Date().toISOString()
        };
      } else {
        // Check static whitelist
        const allowedUsersEnv = process.env.ALLOWED_USERS || "";
        let foundInWhitelist = false;
        if (allowedUsersEnv) {
          const staticUsersList = allowedUsersEnv.split(",").filter(Boolean);
          for (const entry of staticUsersList) {
            const [u, p] = entry.split(":");
            if (u && p && u.trim().toLowerCase() === cleanUsername && p.trim() === cleanCurrentPassword) {
              dbUser = {
                username: u.trim(),
                password: p.trim(),
                paid: true,
                registeredAt: new Date().toISOString()
              };
              foundInWhitelist = true;
              break;
            }
          }
        }

        if (!foundInWhitelist) {
          return res.status(401).json({ error: "Current username and password combination is invalid" });
        }
      }
    } else {
      // Validate existing db password
      if (dbUser.password !== cleanCurrentPassword) {
        return res.status(401).json({ error: "Incorrect current password" });
      }
    }

    // Update password
    dbUser.password = cleanNewPassword;
    users[cleanUsername] = dbUser;

    if (saveUsersDatabase(users)) {
      console.log(`[Database] Successfully changed password for user: ${dbUser.username}`);
      return res.json({ success: true, message: "Password updated successfully" });
    } else {
      return res.status(500).json({ error: "Failed to write updated password to server" });
    }
  });

  // Secure username change to allow customizable user identifiers
  app.post("/api/auth/change-username", (req, res) => {
    const { username, currentPassword, newUsername } = req.body;
    if (!username || !currentPassword || !newUsername) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanCurrentPassword = currentPassword.trim();
    const cleanNewUsername = newUsername.trim();
    const newKey = cleanNewUsername.toLowerCase();

    if (cleanNewUsername.length < 2) {
      return res.status(400).json({ error: "New username must be at least 2 characters" });
    }

    if (cleanUsername === newKey) {
      return res.status(400).json({ error: "New username cannot be the same as the current username" });
    }

    const users = loadUsersDatabase();

    // Check if new username is already taken
    if (users[newKey]) {
      return res.status(400).json({ error: "That username is already taken. Please choose another one." });
    }

    // Check static whitelist to see if new username is reserved
    const staticUsers = (process.env.ALLOWED_USERS || "")
      .split(",")
      .filter(Boolean)
      .map(entry => {
        const [u, p] = entry.split(":");
        return { u: u?.trim().toLowerCase(), p: p?.trim() };
      });

    const isReserved = staticUsers.some(u => u.u === newKey);
    if (isReserved) {
      return res.status(400).json({ error: "That username is already reserved" });
    }

    let dbUser = users[cleanUsername];

    // If user is not yet in users.json but is the default 'teacher' or in ALLOWED_USERS whitelist
    if (!dbUser) {
      if (cleanUsername === "teacher" && cleanCurrentPassword === "123456") {
        dbUser = {
          username: "Teacher",
          password: "123456",
          paid: true,
          registeredAt: new Date().toISOString()
        };
      } else {
        // Check static whitelist
        const allowedUsersEnv = process.env.ALLOWED_USERS || "";
        let foundInWhitelist = false;
        if (allowedUsersEnv) {
          const staticUsersList = allowedUsersEnv.split(",").filter(Boolean);
          for (const entry of staticUsersList) {
            const [u, p] = entry.split(":");
            if (u && p && u.trim().toLowerCase() === cleanUsername && p.trim() === cleanCurrentPassword) {
              dbUser = {
                username: u.trim(),
                password: p.trim(),
                paid: true,
                registeredAt: new Date().toISOString()
              };
              foundInWhitelist = true;
              break;
            }
          }
        }

        if (!foundInWhitelist) {
          return res.status(401).json({ error: "Current username and password combination is invalid" });
        }
      }
    } else {
      // Validate existing db password
      if (dbUser.password !== cleanCurrentPassword) {
        return res.status(401).json({ error: "Incorrect password" });
      }
    }

    // Update username
    dbUser.username = cleanNewUsername;
    users[newKey] = dbUser;

    // Delete old user session record if old username key is different
    if (cleanUsername !== newKey) {
      delete users[cleanUsername];
    }

    if (saveUsersDatabase(users)) {
      console.log(`[Database] Successfully changed username from ${username} to ${cleanNewUsername}`);
      return res.json({ success: true, username: cleanNewUsername, message: "Username updated successfully" });
    } else {
      return res.status(500).json({ error: "Failed to write updated username to server" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware loaded");
    } catch (e) {
      console.error("Vite failed to start:", e);
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
