import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { challenges as seedChallenges, creators as seedCreators, recipes as seedRecipes } from "./data/seedData";
import { EVENTS_DATA } from "./src/data/appData";

const SUPPORTED_COUNTRIES = ["NL", "FR", "BE", "DE", "ES", "GB", "US"] as const;
type CountryCode = (typeof SUPPORTED_COUNTRIES)[number];

type RegionMeta = {
  global?: boolean;
  countries?: CountryCode[];
};

type PartnerItem = {
  id: string;
  name: string;
  url: string;
  domain: string;
  category: "supplements" | "nutrition" | "apparel" | "memberships";
} & RegionMeta;

const creatorRegionMeta: Record<string, RegionMeta> = {
  c4: { global: true },
  c5: { countries: ["NL", "BE", "FR"] },
  c6: { countries: ["NL", "DE", "GB"] },
};

const eventRegionMeta: Record<string, RegionMeta> = {
  "mud-masters": { countries: ["NL", "BE", "DE"] },
  "strong-viking": { countries: ["NL", "BE", "DE"] },
  "hyrox-rotterdam": { global: true },
  "hyrox-utrecht": { global: true },
  "spartan-zandvoort": { global: true },
  "lowlands-throwdown": { countries: ["NL", "BE", "DE"] },
  "dutch-throwdown": { countries: ["NL", "BE"] },
  "ifbb-nederland": { countries: ["NL", "BE"] },
  "nk-powerliften": { countries: ["NL", "BE", "DE"] },
  "nk-gewichtheffen": { countries: ["NL", "BE", "DE"] },
  "euro-muscle-show": { global: true },
  festyfit: { countries: ["NL", "BE"] },
  "nl-actief-congres": { countries: ["NL"] },
  "hfa-european-congress": { global: true },
  "dutch-fitness-awards": { countries: ["NL", "BE"] },
};

const challengeRegionMeta: Record<string, RegionMeta> = {
  ch1: { global: true },
  ch2: { countries: ["NL", "BE", "DE"] },
  ch3: { countries: ["NL", "FR", "ES"] },
  ch4: { countries: ["GB", "US", "NL"] },
};

const seedPartners: PartnerItem[] = [
  { id: "bodyfit", name: "Body & Fit", url: "https://www.bodyandfit.com", domain: "bodyandfit.com", category: "supplements", countries: ["NL", "BE"] },
  { id: "xxl", name: "XXL Nutrition", url: "https://xxlnutrition.com", domain: "xxlnutrition.com", category: "supplements", countries: ["NL", "BE", "DE"] },
  { id: "optimum", name: "Optimum Nutrition", url: "https://www.optimumnutrition.com", domain: "optimumnutrition.com", category: "supplements", global: true },
  { id: "esn", name: "ESN", url: "https://www.esn.com", domain: "esn.com", category: "supplements", countries: ["DE", "NL", "BE"] },
  { id: "bulk", name: "Bulk", url: "https://www.bulk.com", domain: "bulk.com", category: "supplements", countries: ["GB", "NL", "FR", "DE", "ES"] },
  { id: "musclemeals", name: "Muscle Meals", url: "https://www.musclemeals.nl", domain: "musclemeals.nl", category: "nutrition", countries: ["NL", "BE"] },
  { id: "fitchef", name: "FitChef", url: "https://www.fitchef.nl", domain: "fitchef.nl", category: "nutrition", countries: ["NL", "BE"] },
  { id: "fuelyourbody", name: "Fuel Your Body", url: "https://www.fuelyourbody.nl", domain: "fuelyourbody.nl", category: "nutrition", countries: ["NL"] },
  { id: "cleanmeals", name: "Clean Meals", url: "https://www.cleanmeals.nl", domain: "cleanmeals.nl", category: "nutrition", countries: ["NL"] },
  { id: "prepthefood", name: "Prep The Food", url: "https://www.prepthefood.nl", domain: "prepthefood.nl", category: "nutrition", countries: ["NL"] },
  { id: "nike", name: "Nike", url: "https://www.nike.com", domain: "nike.com", category: "apparel", global: true },
  { id: "adidas", name: "Adidas", url: "https://www.adidas.com", domain: "adidas.com", category: "apparel", global: true },
  { id: "underarmour", name: "Under Armour", url: "https://www.underarmour.com", domain: "underarmour.com", category: "apparel", global: true },
  { id: "puma", name: "Puma", url: "https://www.puma.com", domain: "puma.com", category: "apparel", global: true },
  { id: "gymshark", name: "Gymshark", url: "https://www.gymshark.com", domain: "gymshark.com", category: "apparel", global: true },
  { id: "basicfit", name: "Basic-Fit", url: "https://www.basic-fit.com", domain: "basic-fit.com", category: "memberships", countries: ["NL", "BE", "FR", "DE", "ES"] },
  { id: "sportcity", name: "SportCity", url: "https://www.sportcity.nl", domain: "sportcity.nl", category: "memberships", countries: ["NL"] },
  { id: "trainmore", name: "TrainMore", url: "https://trainmore.nl", domain: "trainmore.nl", category: "memberships", countries: ["NL"] },
  { id: "anytime", name: "Anytime Fitness", url: "https://www.anytimefitness.nl", domain: "anytimefitness.nl", category: "memberships", global: true },
];

const normalizeCountry = (value: unknown): CountryCode => {
  const raw = typeof value === "string" ? value.trim().toUpperCase() : "NL";
  return (SUPPORTED_COUNTRIES as readonly string[]).includes(raw) ? (raw as CountryCode) : "NL";
};

const isVisibleForCountry = (meta: RegionMeta | undefined, country: CountryCode) => {
  if (!meta) return true;
  if (meta.global) return true;
  return !!meta.countries?.includes(country);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    time TEXT NOT NULL,
    exercises TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    payload TEXT,
    created_at TEXT NOT NULL,
    received_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS feedback_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    submitted_at TEXT,
    form_version TEXT,
    overall_satisfaction INTEGER,
    usability_rating INTEGER,
    navigation_rating INTEGER,
    speed_rating INTEGER,
    design_rating INTEGER,
    most_used_parts TEXT,
    workout_level TEXT,
    workout_frustrations TEXT,
    workout_frustration_other TEXT,
    helps_goals TEXT,
    motivation_rating INTEGER,
    missing_features TEXT,
    first_improve TEXT,
    best_thing TEXT,
    raw_form TEXT,
    received_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add exercises column to existing table if it doesn't exist
try {
  db.exec(`ALTER TABLE workouts ADD COLUMN exercises TEXT;`);
} catch (e) {
  // Column likely already exists, ignore error
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8081;
  const HMR_PORT = Number(process.env.HMR_PORT) || 24679;

  const toIntOrNull = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.trunc(value);
    }
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const toStringOrNull = (value: unknown): string | null => {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
    return String(value);
  };

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/content/recipes", (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";

    const recipes = query
      ? seedRecipes.filter((recipe) => {
          const haystack = [
            recipe.name,
            recipe.category,
            ...(recipe.ingredients || []),
            ...(recipe.instructions || []),
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(query);
        })
      : seedRecipes;

    res.json(recipes);
  });

  app.get("/api/content/creators", (req, res) => {
    const country = normalizeCountry(req.query.country);
    const creators = seedCreators.filter((creator) => isVisibleForCountry(creatorRegionMeta[creator.id], country));
    res.json(creators);
  });

  app.get("/api/content/events", (req, res) => {
    const country = normalizeCountry(req.query.country);
    const events = EVENTS_DATA.filter((event) => isVisibleForCountry(eventRegionMeta[event.id], country));
    res.json(events);
  });

  app.get("/api/content/challenges", (req, res) => {
    const country = normalizeCountry(req.query.country);
    const challenges = seedChallenges.filter((challenge) => isVisibleForCountry(challengeRegionMeta[challenge.id], country));
    res.json(challenges);
  });

  app.get("/api/content/partners", (req, res) => {
    const country = normalizeCountry(req.query.country);
    const partners = seedPartners
      .filter((partner) => isVisibleForCountry(partner, country))
      .map(({ global, countries, ...partner }) => partner);
    res.json(partners);
  });

  app.post("/api/ai/chat", async (req, res) => {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Je bent een behulpzame, motiverende en deskundige fitness coach voor de app "DAELY Performance".
Geef een kort, bondig en praktisch antwoord op de volgende vraag van een gebruiker.
Gebruik een vriendelijke toon en emojis waar gepast.

Vraag: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ text: response.text || "Sorry, ik kon even geen antwoord bedenken." });
    } catch (error) {
      console.error("Error generating AI chat response:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  app.post("/api/settings-requests", (req, res) => {
    try {
      const { requestId, type, payload, createdAt } = req.body;

      if (!requestId || !type || !createdAt) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const stmt = db.prepare(
        "INSERT INTO settings_requests (request_id, type, payload, created_at) VALUES (?, ?, ?, ?)"
      );
      stmt.run(
        String(requestId),
        String(type),
        payload ? JSON.stringify(payload) : null,
        String(createdAt)
      );

      if (String(type) === "feedback-form" && payload && typeof payload === "object") {
        const feedbackPayload = payload as Record<string, unknown>;
        const feedbackStmt = db.prepare(
          `INSERT INTO feedback_responses (
            request_id,
            created_at,
            submitted_at,
            form_version,
            overall_satisfaction,
            usability_rating,
            navigation_rating,
            speed_rating,
            design_rating,
            most_used_parts,
            workout_level,
            workout_frustrations,
            workout_frustration_other,
            helps_goals,
            motivation_rating,
            missing_features,
            first_improve,
            best_thing,
            raw_form
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        feedbackStmt.run(
          String(requestId),
          String(createdAt),
          toStringOrNull(feedbackPayload.submittedAt),
          toStringOrNull(feedbackPayload.formVersion),
          toIntOrNull(feedbackPayload.overallSatisfaction),
          toIntOrNull(feedbackPayload.usabilityRating),
          toIntOrNull(feedbackPayload.navigationRating),
          toIntOrNull(feedbackPayload.speedRating),
          toIntOrNull(feedbackPayload.designRating),
          toStringOrNull(feedbackPayload.mostUsedParts),
          toStringOrNull(feedbackPayload.workoutLevel),
          toStringOrNull(feedbackPayload.workoutFrustrations),
          toStringOrNull(feedbackPayload.workoutFrustrationOther),
          toStringOrNull(feedbackPayload.helpsGoals),
          toIntOrNull(feedbackPayload.motivationRating),
          toStringOrNull(feedbackPayload.missingFeatures),
          toStringOrNull(feedbackPayload.firstImprove),
          toStringOrNull(feedbackPayload.bestThing),
          toStringOrNull(feedbackPayload.rawForm)
        );
      }

      res.status(201).json({ success: true });
    } catch (error: any) {
      // If the request was already persisted, return success to keep retries idempotent.
      if (error && typeof error.message === "string" && error.message.includes("UNIQUE")) {
        return res.status(200).json({ success: true, duplicate: true });
      }
      console.error("Error saving settings request:", error);
      res.status(500).json({ error: "Failed to save settings request" });
    }
  });

  app.get("/api/feedback-responses", (req, res) => {
    try {
      const stmt = db.prepare(
        "SELECT * FROM feedback_responses ORDER BY received_at DESC"
      );
      const rows = stmt.all();
      res.json(rows);
    } catch (error) {
      console.error("Error fetching feedback responses:", error);
      res.status(500).json({ error: "Failed to fetch feedback responses" });
    }
  });

  app.get("/api/feedback-analytics", (req, res) => {
    try {
      const totalResponses = db.prepare(
        "SELECT COUNT(*) AS count FROM feedback_responses"
      ).get() as { count: number };

      const averages = db.prepare(
        `SELECT
          ROUND(AVG(overall_satisfaction), 2) AS overallSatisfaction,
          ROUND(AVG(usability_rating), 2) AS usability,
          ROUND(AVG(navigation_rating), 2) AS navigation,
          ROUND(AVG(speed_rating), 2) AS speed,
          ROUND(AVG(design_rating), 2) AS design,
          ROUND(AVG(motivation_rating), 2) AS motivation
        FROM feedback_responses`
      ).get() as {
        overallSatisfaction: number | null;
        usability: number | null;
        navigation: number | null;
        speed: number | null;
        design: number | null;
        motivation: number | null;
      };

      const workoutLevelBreakdown = db.prepare(
        `SELECT
          workout_level AS label,
          COUNT(*) AS count
        FROM feedback_responses
        WHERE workout_level IS NOT NULL AND workout_level != ''
        GROUP BY workout_level
        ORDER BY count DESC`
      ).all() as Array<{ label: string; count: number }>;

      const helpsGoalsBreakdown = db.prepare(
        `SELECT
          helps_goals AS label,
          COUNT(*) AS count
        FROM feedback_responses
        WHERE helps_goals IS NOT NULL AND helps_goals != ''
        GROUP BY helps_goals
        ORDER BY count DESC`
      ).all() as Array<{ label: string; count: number }>;

      res.json({
        totalResponses: totalResponses.count,
        averages: {
          overallSatisfaction: averages.overallSatisfaction,
          usability: averages.usability,
          navigation: averages.navigation,
          speed: averages.speed,
          design: averages.design,
          motivation: averages.motivation,
        },
        breakdowns: {
          workoutLevel: workoutLevelBreakdown,
          helpsGoals: helpsGoalsBreakdown,
        },
      });
    } catch (error) {
      console.error("Error building feedback analytics:", error);
      res.status(500).json({ error: "Failed to build feedback analytics" });
    }
  });

  // Get all workouts
  app.get("/api/workouts", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM workouts ORDER BY date ASC, created_at ASC");
      const workouts = stmt.all().map((w: any) => ({
        ...w,
        exercises: w.exercises ? JSON.parse(w.exercises) : []
      }));
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ error: "Failed to fetch workouts" });
    }
  });

  // Add a new workout
  app.post("/api/workouts", (req, res) => {
    try {
      const { date, title, type, time, exercises } = req.body;
      if (!date || !title || !type || !time) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const exercisesJson = exercises ? JSON.stringify(exercises) : '[]';

      const stmt = db.prepare("INSERT INTO workouts (date, title, type, time, exercises) VALUES (?, ?, ?, ?, ?)");
      const info = stmt.run(date, title, type, time, exercisesJson);
      
      const newWorkout = db.prepare("SELECT * FROM workouts WHERE id = ?").get(info.lastInsertRowid) as any;
      res.status(201).json({
        ...newWorkout,
        exercises: newWorkout.exercises ? JSON.parse(newWorkout.exercises) : []
      });
    } catch (error) {
      console.error("Error adding workout:", error);
      res.status(500).json({ error: "Failed to add workout" });
    }
  });

  // Delete a workout
  app.delete("/api/workouts/:id", (req, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare("DELETE FROM workouts WHERE id = ?");
      stmt.run(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ error: "Failed to delete workout" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { port: HMR_PORT },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
