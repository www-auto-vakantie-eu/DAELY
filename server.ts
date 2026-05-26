import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { challenges as seedChallenges, creators as seedCreators, recipes as seedRecipes } from "./data/seedData";
import { EVENTS_DATA } from "./src/data/appData";
import { getFitbitAuthUrl, getFitbitAccessToken, getFitbitSteps } from "./fitbit";

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

db.exec(`
  CREATE TABLE IF NOT EXISTS nutrition_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    barcode TEXT,
    name TEXT NOT NULL,
    brand TEXT,
    country TEXT,
    language TEXT,
    category TEXT,
    item_type TEXT NOT NULL,
    image_url TEXT,
    label_image_url TEXT,
    source TEXT NOT NULL DEFAULT 'user',
    verification_status TEXT NOT NULL DEFAULT 'unverified',
    confidence_score REAL NOT NULL DEFAULT 0.3,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_nutrition_products_barcode ON nutrition_products(barcode);
  CREATE INDEX IF NOT EXISTS idx_nutrition_products_name ON nutrition_products(name);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS nutrition_product_nutrients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    per_unit TEXT NOT NULL DEFAULT '100g',
    kcal REAL NOT NULL DEFAULT 0,
    protein REAL NOT NULL DEFAULT 0,
    carbs REAL NOT NULL DEFAULT 0,
    fats REAL NOT NULL DEFAULT 0,
    sugar REAL NOT NULL DEFAULT 0,
    salt REAL NOT NULL DEFAULT 0,
    sodium REAL NOT NULL DEFAULT 0,
    fiber REAL NOT NULL DEFAULT 0,
    caffeine REAL NOT NULL DEFAULT 0,
    creatine REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES nutrition_products(id)
  );

  CREATE INDEX IF NOT EXISTS idx_nutrition_product_nutrients_product_id ON nutrition_product_nutrients(product_id);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS nutrition_product_contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    anonymous_user_id TEXT,
    device_id TEXT,
    submitted_barcode TEXT,
    submitted_name TEXT,
    submitted_brand TEXT,
    submitted_country TEXT,
    submitted_language TEXT,
    submitted_item_type TEXT,
    submitted_nutrition_json TEXT,
    submitted_image_url TEXT,
    submitted_label_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES nutrition_products(id)
  );

  CREATE INDEX IF NOT EXISTS idx_nutrition_product_contributions_status ON nutrition_product_contributions(status);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS nutrition_product_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    anonymous_user_id TEXT,
    device_id TEXT,
    reason TEXT NOT NULL,
    corrected_values_json TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES nutrition_products(id)
  );

  CREATE INDEX IF NOT EXISTS idx_nutrition_product_reports_product_id ON nutrition_product_reports(product_id);
`);

// Add exercises column to existing table if it doesn't exist
try {
  db.exec(`ALTER TABLE workouts ADD COLUMN exercises TEXT;`);
} catch (e) {
  // Column likely already exists, ignore error
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8085;
  const HMR_PORT = Number(process.env.HMR_PORT) || 24679;
  const PRODUCT_ITEM_TYPES = ["food", "drink", "supplement"] as const;
  const PRODUCT_SOURCES = ["user", "open_food_facts", "usda", "brand", "admin"] as const;
  const VERIFICATION_STATUSES = ["unverified", "community_verified", "label_verified", "admin_verified", "brand_verified"] as const;
  const CONTRIBUTION_STATUSES = ["pending", "approved", "rejected", "merged"] as const;
  const REPORT_STATUSES = ["open", "resolved", "rejected"] as const;
  const PER_UNIT_VALUES = ["100g", "100ml", "serving"] as const;

  const toNutritionNumber = (...values: unknown[]): number => {
    for (const value of values) {
      if (typeof value === "number" && Number.isFinite(value)) {
        return Math.max(0, Number(value.toFixed(2)));
      }
      if (typeof value === "string") {
        const normalized = value.replace(",", ".").trim();
        if (!normalized) continue;
        const parsed = Number.parseFloat(normalized);
        if (Number.isFinite(parsed)) {
          return Math.max(0, Number(parsed.toFixed(2)));
        }
      }
    }
    return 0;
  };

  const parseServingFromText = (value: unknown): { size: number | null; unit: string | null } => {
    if (typeof value !== "string") {
      return { size: null, unit: null };
    }

    const match = value.trim().match(/(\d+[\d.,]*)\s*(g|gram|gr|ml|l|kg|cl)\b/i);
    if (!match) {
      return { size: null, unit: null };
    }

    const rawSize = Number.parseFloat(match[1].replace(",", "."));
    if (!Number.isFinite(rawSize)) {
      return { size: null, unit: null };
    }

    const rawUnit = match[2].toLowerCase();
    if (rawUnit === "gram" || rawUnit === "gr") {
      return { size: rawSize, unit: "gram" };
    }
    if (rawUnit === "kg") {
      return { size: Number((rawSize * 1000).toFixed(2)), unit: "gram" };
    }
    if (rawUnit === "l") {
      return { size: Number((rawSize * 1000).toFixed(2)), unit: "ml" };
    }
    if (rawUnit === "cl") {
      return { size: Number((rawSize * 10).toFixed(2)), unit: "ml" };
    }

    return { size: rawSize, unit: rawUnit };
  };

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

  const toStringOrUndefined = (value: unknown): string | undefined => {
    if (typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  const toNonNegativeNumber = (value: unknown): number => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.max(0, Number(value.toFixed(2)));
    }

    if (typeof value === "string") {
      const cleaned = value.replace(",", ".").trim();
      if (!cleaned) return 0;
      const parsed = Number.parseFloat(cleaned);
      if (Number.isFinite(parsed)) {
        return Math.max(0, Number(parsed.toFixed(2)));
      }
    }

    return 0;
  };

  const parseNutritionPayload = (payload: unknown) => {
    const source = typeof payload === "string" ? (() => {
      try {
        return JSON.parse(payload);
      } catch {
        return {};
      }
    })() : (payload || {});

    const obj = typeof source === "object" && source !== null ? (source as Record<string, unknown>) : {};
    const perUnitRaw = toStringOrUndefined(obj.perUnit) || "100g";
    const perUnit = (PER_UNIT_VALUES as readonly string[]).includes(perUnitRaw) ? perUnitRaw : "100g";

    return {
      perUnit,
      kcal: toNonNegativeNumber(obj.kcal),
      protein: toNonNegativeNumber(obj.protein),
      carbs: toNonNegativeNumber(obj.carbs),
      fats: toNonNegativeNumber(obj.fats),
      sugar: toNonNegativeNumber(obj.sugar),
      salt: toNonNegativeNumber(obj.salt),
      sodium: toNonNegativeNumber(obj.sodium),
      fiber: toNonNegativeNumber(obj.fiber),
      caffeine: toNonNegativeNumber(obj.caffeine),
      creatine: toNonNegativeNumber(obj.creatine),
    };
  };

  const computeConfidenceScore = (data: {
    barcode?: string;
    name?: string;
    brand?: string;
    imageUrl?: string;
    nutrients: ReturnType<typeof parseNutritionPayload>;
  }) => {
    let score = 0.2;
    if (data.barcode) score += 0.25;
    if (data.name) score += 0.2;
    if (data.brand) score += 0.1;
    if (data.imageUrl) score += 0.1;

    const nutrientFields = [
      data.nutrients.kcal,
      data.nutrients.protein,
      data.nutrients.carbs,
      data.nutrients.fats,
      data.nutrients.sugar,
      data.nutrients.salt,
      data.nutrients.sodium,
      data.nutrients.fiber,
      data.nutrients.caffeine,
      data.nutrients.creatine,
    ];

    const positiveNutrients = nutrientFields.filter((value) => value > 0).length;
    if (positiveNutrients >= 4) {
      score += 0.15;
    } else if (positiveNutrients >= 2) {
      score += 0.08;
    }

    return Number(Math.min(0.95, score).toFixed(2));
  };

  const mapProductRow = (row: any) => ({
    id: row.id,
    barcode: row.barcode || undefined,
    name: row.name,
    brand: row.brand || undefined,
    country: row.country || undefined,
    language: row.language || undefined,
    category: row.category || undefined,
    itemType: row.item_type,
    imageUrl: row.image_url || undefined,
    labelImageUrl: row.label_image_url || undefined,
    source: row.source,
    verificationStatus: row.verification_status,
    confidenceScore: Number(row.confidence_score || 0),
    nutrients: {
      perUnit: row.per_unit || "100g",
      kcal: toNonNegativeNumber(row.kcal),
      protein: toNonNegativeNumber(row.protein),
      carbs: toNonNegativeNumber(row.carbs),
      fats: toNonNegativeNumber(row.fats),
      sugar: toNonNegativeNumber(row.sugar),
      salt: toNonNegativeNumber(row.salt),
      sodium: toNonNegativeNumber(row.sodium),
      fiber: toNonNegativeNumber(row.fiber),
      caffeine: toNonNegativeNumber(row.caffeine),
      creatine: toNonNegativeNumber(row.creatine),
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

  type NutritionSearchSource = "daely" | "open_food_facts" | "usda";

  type NutritionSearchResult = {
    externalId: string;
    source: NutritionSearchSource;
    name: string;
    brand?: string;
    barcode?: string;
    itemType: "food" | "drink" | "supplement";
    kcal: number;
    protein: number;
    carbs: number;
    fats: number;
    sugar: number;
    salt: number;
    sodium: number;
    servingSize: number;
    servingUnit: string;
    imageUrl?: string;
    verificationStatus?: string;
    confidenceScore?: number;
  };

  const normalizeBarcode = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const compact = value.replace(/\s+/g, "").trim();
    return compact.length > 0 ? compact : undefined;
  };

  const inferItemType = (name: unknown, brand?: unknown, categories?: unknown): "food" | "drink" | "supplement" => {
    const haystack = `${toStringOrUndefined(name) || ""} ${toStringOrUndefined(brand) || ""} ${toStringOrUndefined(categories) || ""}`.toLowerCase();

    if (/whey|protein powder|supplement|capsule|tablet|creatine|pre[- ]?workout|multivitamin|bcaa|omega/.test(haystack)) {
      return "supplement";
    }
    if (/drink|juice|water|cola|soda|milk|tea|coffee|beverage|smoothie/.test(haystack)) {
      return "drink";
    }
    return "food";
  };

  const buildSearchDedupKey = (item: NutritionSearchResult): string => {
    if (item.barcode) {
      return `barcode:${item.barcode}`;
    }
    const name = item.name.trim().toLowerCase();
    const brand = (item.brand || "").trim().toLowerCase();
    return `name:${name}|brand:${brand}`;
  };

  const mapPerUnitToServing = (perUnit: unknown): { servingSize: number; servingUnit: string } => {
    const normalized = toStringOrUndefined(perUnit) || "100g";
    if (normalized === "100ml") return { servingSize: 100, servingUnit: "ml" };
    if (normalized === "serving") return { servingSize: 1, servingUnit: "portie" };
    return { servingSize: 100, servingUnit: "gram" };
  };

  const safeResultString = (value: unknown, fallback: string): string => {
    const normalized = toStringOrUndefined(value);
    return normalized || fallback;
  };

  app.use(express.json());
  app.use((req, res, next) => {
      // --- FITBIT API ---

      // 1. Authorisatie URL ophalen
      app.get("/api/fitbit/auth/url", (req, res) => {
        try {
          const url = getFitbitAuthUrl();
          res.json({ authorizeUrl: url });
        } catch (error: any) {
          res.status(500).json({ error: "Failed to build FitBit authorization URL", details: error?.message });
        }
      });

      // 2. OAuth callback: code omwisselen voor token
      app.get("/api/fitbit/oauth/callback", async (req, res) => {
        const code = typeof req.query.code === "string" ? req.query.code.trim() : "";
        if (!code) return res.status(400).json({ error: "Missing OAuth code" });
        try {
          const token = await getFitbitAccessToken(code);
          res.json({ token });
        } catch (error: any) {
          res.status(500).json({ error: "Failed to exchange OAuth code", details: error?.message });
        }
      });

      // 3. Haal stappen-data op
      app.get("/api/fitbit/steps", async (req, res) => {
        const accessToken = typeof req.headers.authorization === "string" && req.headers.authorization.startsWith("Bearer ")
          ? req.headers.authorization.slice("Bearer ".length).trim()
          : (typeof req.query.accessToken === "string" ? req.query.accessToken.trim() : null);
        if (!accessToken) return res.status(401).json({ error: "Missing FitBit access token" });
        try {
          const date = typeof req.query.date === "string" ? req.query.date : "today";
          const steps = await getFitbitSteps(accessToken, date);
          res.json(steps);
        } catch (error: any) {
          res.status(500).json({ error: "Failed to fetch FitBit steps", details: error?.message });
        }
      });
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-whoop-access-token");
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  const getWhoopAccessTokenFromRequest = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.slice("Bearer ".length).trim();
    }

    const tokenHeader = req.headers["x-whoop-access-token"];
    if (typeof tokenHeader === "string" && tokenHeader.trim().length > 0) {
      return tokenHeader.trim();
    }

    const queryToken = req.query.accessToken;
    if (typeof queryToken === "string" && queryToken.trim().length > 0) {
      return queryToken.trim();
    }

    return null;
  };

  app.get("/api/whoop/auth/url", async (req, res) => {
    try {
      const state =
        typeof req.query.state === "string" && req.query.state.trim().length > 0
          ? req.query.state.trim()
          : `daely-${Date.now()}`;
      const redirectUri =
        typeof req.query.redirectUri === "string" && req.query.redirectUri.trim().length > 0
          ? req.query.redirectUri.trim()
          : undefined;

      const { getWhoopAuthorizeUrl } = await import("./whoop");
      const authorizeUrl = getWhoopAuthorizeUrl(state, redirectUri);

      res.json({ authorizeUrl, state });
    } catch (error: any) {
      console.error("WHOOP auth URL error:", error);
      res.status(500).json({ error: "Failed to build WHOOP authorization URL", details: error?.message });
    }
  });

  app.get("/api/whoop/oauth/callback", async (req, res) => {
    const code = typeof req.query.code === "string" ? req.query.code.trim() : "";
    const state = typeof req.query.state === "string" ? req.query.state.trim() : "";

    if (!code) {
      return res.status(400).json({ error: "Missing OAuth code" });
    }

    try {
      const { exchangeWhoopCodeForToken } = await import("./whoop");
      const token = await exchangeWhoopCodeForToken(code);
      res.json({ state, token });
    } catch (error: any) {
      console.error("WHOOP token exchange error:", error);
      res.status(500).json({ error: "Failed to exchange OAuth code", details: error?.message });
    }
  });

  app.post("/api/whoop/oauth/exchange", async (req, res) => {
    const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
    const redirectUri = typeof req.body?.redirectUri === "string" ? req.body.redirectUri.trim() : "";
    const state = typeof req.body?.state === "string" ? req.body.state.trim() : "";

    if (!code) {
      return res.status(400).json({ error: "Missing OAuth code" });
    }

    if (!redirectUri) {
      return res.status(400).json({ error: "Missing redirectUri" });
    }

    try {
      const { exchangeWhoopCodeForToken } = await import("./whoop");
      const token = await exchangeWhoopCodeForToken(code, redirectUri);
      res.json({ state, token });
    } catch (error: any) {
      console.error("WHOOP token exchange error:", error);
      res.status(500).json({ error: "Failed to exchange OAuth code", details: error?.message });
    }
  });

  app.post("/api/whoop/oauth/refresh", async (req, res) => {
    const refreshToken = typeof req.body?.refreshToken === "string" ? req.body.refreshToken.trim() : "";

    if (!refreshToken) {
      return res.status(400).json({ error: "Missing refreshToken" });
    }

    try {
      const { refreshWhoopAccessToken } = await import("./whoop");
      const token = await refreshWhoopAccessToken(refreshToken);
      res.json(token);
    } catch (error: any) {
      console.error("WHOOP token refresh error:", error);
      res.status(500).json({ error: "Failed to refresh token", details: error?.message });
    }
  });

  app.get("/api/whoop/profile", async (req, res) => {
    const accessToken = getWhoopAccessTokenFromRequest(req);

    if (!accessToken) {
      return res.status(401).json({ error: "Missing WHOOP access token" });
    }

    try {
      const { getWhoopProfile } = await import("./whoop");
      const profile = await getWhoopProfile(accessToken);
      res.json(profile);
    } catch (error: any) {
      console.error("WHOOP profile error:", error);
      res.status(500).json({ error: "Failed to fetch WHOOP profile", details: error?.message });
    }
  });

  app.get("/api/whoop/body-measurement", async (req, res) => {
    const accessToken = getWhoopAccessTokenFromRequest(req);

    if (!accessToken) {
      return res.status(401).json({ error: "Missing WHOOP access token" });
    }

    try {
      const { getWhoopBodyMeasurement } = await import("./whoop");
      const bodyMeasurement = await getWhoopBodyMeasurement(accessToken);
      res.json(bodyMeasurement);
    } catch (error: any) {
      console.error("WHOOP body measurement error:", error);
      res.status(500).json({ error: "Failed to fetch WHOOP body measurement", details: error?.message });
    }
  });

  app.get("/api/whoop/recovery", async (req, res) => {
    const accessToken = getWhoopAccessTokenFromRequest(req);

    if (!accessToken) {
      return res.status(401).json({ error: "Missing WHOOP access token" });
    }

    try {
      const { getWhoopRecoveryCollection } = await import("./whoop");
      const recovery = await getWhoopRecoveryCollection(accessToken, {
        limit: typeof req.query.limit === "string" ? req.query.limit : undefined,
        start: typeof req.query.start === "string" ? req.query.start : undefined,
        end: typeof req.query.end === "string" ? req.query.end : undefined,
        nextToken: typeof req.query.nextToken === "string" ? req.query.nextToken : undefined,
      });
      res.json(recovery);
    } catch (error: any) {
      console.error("WHOOP recovery error:", error);
      res.status(500).json({ error: "Failed to fetch WHOOP recovery", details: error?.message });
    }
  });

  app.get("/api/whoop/sleep", async (req, res) => {
    const accessToken = getWhoopAccessTokenFromRequest(req);

    if (!accessToken) {
      return res.status(401).json({ error: "Missing WHOOP access token" });
    }

    try {
      const { getWhoopSleepCollection } = await import("./whoop");
      const sleep = await getWhoopSleepCollection(accessToken, {
        limit: typeof req.query.limit === "string" ? req.query.limit : undefined,
        start: typeof req.query.start === "string" ? req.query.start : undefined,
        end: typeof req.query.end === "string" ? req.query.end : undefined,
        nextToken: typeof req.query.nextToken === "string" ? req.query.nextToken : undefined,
      });
      res.json(sleep);
    } catch (error: any) {
      console.error("WHOOP sleep error:", error);
      res.status(500).json({ error: "Failed to fetch WHOOP sleep", details: error?.message });
    }
  });

  app.get("/api/whoop/workout", async (req, res) => {
    const accessToken = getWhoopAccessTokenFromRequest(req);

    if (!accessToken) {
      return res.status(401).json({ error: "Missing WHOOP access token" });
    }

    try {
      const { getWhoopWorkoutCollection } = await import("./whoop");
      const workout = await getWhoopWorkoutCollection(accessToken, {
        limit: typeof req.query.limit === "string" ? req.query.limit : undefined,
        start: typeof req.query.start === "string" ? req.query.start : undefined,
        end: typeof req.query.end === "string" ? req.query.end : undefined,
        nextToken: typeof req.query.nextToken === "string" ? req.query.nextToken : undefined,
      });
      res.json(workout);
    } catch (error: any) {
      console.error("WHOOP workout error:", error);
      res.status(500).json({ error: "Failed to fetch WHOOP workout", details: error?.message });
    }
  });
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

  app.get("/api/nutrition/search", async (req, res) => {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!query) {
      return res.json([]);
    }

    const results: NutritionSearchResult[] = [];

    try {
      const like = `%${query}%`;
      const stmt = db.prepare(
        `SELECT p.*,
                (SELECT per_unit FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS per_unit,
                (SELECT kcal FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS kcal,
                (SELECT protein FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS protein,
                (SELECT carbs FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS carbs,
                (SELECT fats FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS fats,
                (SELECT sugar FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS sugar,
                (SELECT salt FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS salt,
                (SELECT sodium FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS sodium
           FROM nutrition_products p
          WHERE (p.name LIKE ? OR p.brand LIKE ? OR p.barcode LIKE ?)
            AND (p.verification_status != 'unverified' OR p.confidence_score >= 0.65)
          ORDER BY p.confidence_score DESC, p.updated_at DESC
          LIMIT 20`
      );

      const daelyRows = stmt.all(like, like, like) as any[];
      for (const row of daelyRows) {
        const serving = mapPerUnitToServing(row.per_unit);
        results.push({
          externalId: `daely-${row.id}`,
          source: "daely",
          name: safeResultString(row.name, "Onbekend product"),
          brand: toStringOrUndefined(row.brand),
          barcode: normalizeBarcode(row.barcode),
          itemType: inferItemType(row.name, row.brand, row.category),
          kcal: toNutritionNumber(row.kcal),
          protein: toNutritionNumber(row.protein),
          carbs: toNutritionNumber(row.carbs),
          fats: toNutritionNumber(row.fats),
          sugar: toNutritionNumber(row.sugar),
          salt: toNutritionNumber(row.salt),
          sodium: toNutritionNumber(row.sodium),
          servingSize: serving.servingSize,
          servingUnit: serving.servingUnit,
          imageUrl: toStringOrUndefined(row.image_url),
          verificationStatus: toStringOrUndefined(row.verification_status),
          confidenceScore: toNutritionNumber(row.confidence_score),
        });
      }
    } catch (error) {
      console.error("DAELY nutrition search error:", error);
    }

    try {
      const fetchOffProducts = async (url: string): Promise<any[]> => {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "DAELY/1.0 (+https://daely.app)",
          },
        });

        if (!response.ok) {
          return [];
        }

        const payload = (await response.json()) as any;
        return Array.isArray(payload?.products) ? payload.products : [];
      };

      const primaryOffUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=1&page_size=12`;
      const fallbackOffUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=1&page_size=24`;

      let products = await fetchOffProducts(primaryOffUrl);
      if (products.length === 0) {
        products = await fetchOffProducts(fallbackOffUrl);
      }

      for (const product of products) {
          const nutriments = product?.nutriments || {};
          const parsedServing = parseServingFromText(product?.serving_size);
          const servingSize = toNutritionNumber(product?.serving_quantity, parsedServing.size, 100) || 100;
          const servingUnit =
            toStringOrUndefined(product?.serving_quantity_unit)?.toLowerCase() ||
            parsedServing.unit ||
            (inferItemType(product?.product_name, product?.brands, product?.categories) === "drink" ? "ml" : "gram");

          results.push({
            externalId: `off-${safeResultString(product?._id, `${Date.now()}-${Math.random()}`)}`,
            source: "open_food_facts",
            name: safeResultString(product?.product_name || product?.product_name_en, "Onbekend product"),
            brand: toStringOrUndefined(product?.brands)?.split(",")[0]?.trim(),
            barcode: normalizeBarcode(product?.code),
            itemType: inferItemType(product?.product_name, product?.brands, product?.categories),
            kcal: toNutritionNumber(
              nutriments["energy-kcal_serving"],
              nutriments["energy-kcal_100g"],
              nutriments["energy-kcal"]
            ),
            protein: toNutritionNumber(nutriments?.proteins_serving, nutriments?.proteins_100g, nutriments?.proteins),
            carbs: toNutritionNumber(nutriments?.carbohydrates_serving, nutriments?.carbohydrates_100g, nutriments?.carbohydrates),
            fats: toNutritionNumber(nutriments?.fat_serving, nutriments?.fat_100g, nutriments?.fat),
            sugar: toNutritionNumber(nutriments?.sugars_serving, nutriments?.sugars_100g, nutriments?.sugars),
            salt: toNutritionNumber(nutriments?.salt_serving, nutriments?.salt_100g, nutriments?.salt),
            sodium: toNutritionNumber(nutriments?.sodium_serving, nutriments?.sodium_100g, nutriments?.sodium),
            servingSize,
            servingUnit,
            imageUrl: toStringOrUndefined(product?.image_front_url) || toStringOrUndefined(product?.image_url),
          });
      }
    } catch (error) {
      console.error("Open Food Facts search error:", error);
    }

    const usdaApiKey = toStringOrUndefined(process.env.USDA_API_KEY);
    if (usdaApiKey) {
      try {
        const usdaUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(usdaApiKey)}&query=${encodeURIComponent(query)}&pageSize=10`;
        const response = await fetch(usdaUrl);
        if (response.ok) {
          const payload = (await response.json()) as any;
          const foods = Array.isArray(payload?.foods) ? payload.foods : [];

          const readNutrient = (food: any, names: string[]) => {
            const nutrients = Array.isArray(food?.foodNutrients) ? food.foodNutrients : [];
            for (const name of names) {
              const match = nutrients.find((n: any) =>
                typeof n?.nutrientName === "string" && n.nutrientName.toLowerCase().includes(name.toLowerCase())
              );
              if (match) {
                return toNutritionNumber(match.value);
              }
            }
            return 0;
          };

          for (const food of foods) {
            const servingSize = toNutritionNumber(food?.servingSize, 100) || 100;
            const servingUnit = toStringOrUndefined(food?.servingSizeUnit)?.toLowerCase() || "gram";
            results.push({
              externalId: `usda-${safeResultString(food?.fdcId, `${Date.now()}-${Math.random()}`)}`,
              source: "usda",
              name: safeResultString(food?.description, "Onbekend product"),
              brand: toStringOrUndefined(food?.brandOwner),
              barcode: normalizeBarcode(toStringOrUndefined(food?.gtinUpc)),
              itemType: inferItemType(food?.description, food?.brandOwner, food?.foodCategory),
              kcal: readNutrient(food, ["energy"]),
              protein: readNutrient(food, ["protein"]),
              carbs: readNutrient(food, ["carbohydrate"]),
              fats: readNutrient(food, ["total lipid", "fat"]),
              sugar: readNutrient(food, ["sugar"]),
              salt: readNutrient(food, ["salt"]),
              sodium: readNutrient(food, ["sodium"]),
              servingSize,
              servingUnit,
            });
          }
        }
      } catch (error) {
        console.error("USDA search error:", error);
      }
    }

    const deduped = new Map<string, NutritionSearchResult>();
    for (const item of results) {
      const name = item.name.trim();
      if (!name) continue;
      const key = buildSearchDedupKey(item);
      if (!deduped.has(key)) {
        deduped.set(key, item);
      }
      if (deduped.size >= 20) break;
    }

    return res.json(Array.from(deduped.values()).slice(0, 20));
  });

  app.get("/api/nutrition/products/search", (req, res) => {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!query) {
      return res.json([]);
    }

    const like = `%${query}%`;
    const stmt = db.prepare(
      `SELECT p.*,
              (SELECT per_unit FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS per_unit,
              (SELECT kcal FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS kcal,
              (SELECT protein FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS protein,
              (SELECT carbs FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS carbs,
              (SELECT fats FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS fats,
              (SELECT sugar FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS sugar,
              (SELECT salt FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS salt,
              (SELECT sodium FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS sodium,
              (SELECT fiber FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS fiber,
              (SELECT caffeine FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS caffeine,
              (SELECT creatine FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS creatine
         FROM nutrition_products p
        WHERE (p.name LIKE ? OR p.brand LIKE ? OR p.barcode LIKE ?)
          AND (p.verification_status != 'unverified' OR p.confidence_score >= 0.65)
        ORDER BY
          CASE p.verification_status
            WHEN 'admin_verified' THEN 1
            WHEN 'brand_verified' THEN 2
            WHEN 'label_verified' THEN 3
            WHEN 'community_verified' THEN 4
            ELSE 5
          END,
          p.confidence_score DESC,
          p.updated_at DESC
        LIMIT 20`
    );

    const rows = stmt.all(like, like, like);
    res.json(rows.map(mapProductRow));
  });

  app.get("/api/nutrition/products/barcode/:barcode", (req, res) => {
    const barcodeRaw = typeof req.params.barcode === "string" ? req.params.barcode.trim() : "";
    const barcode = barcodeRaw.replace(/\s+/g, "");
    if (!barcode) {
      return res.status(400).json({ error: "Invalid barcode" });
    }

    const stmt = db.prepare(
      `SELECT p.*,
              (SELECT per_unit FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS per_unit,
              (SELECT kcal FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS kcal,
              (SELECT protein FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS protein,
              (SELECT carbs FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS carbs,
              (SELECT fats FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS fats,
              (SELECT sugar FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS sugar,
              (SELECT salt FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS salt,
              (SELECT sodium FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS sodium,
              (SELECT fiber FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS fiber,
              (SELECT caffeine FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS caffeine,
              (SELECT creatine FROM nutrition_product_nutrients n WHERE n.product_id = p.id ORDER BY n.updated_at DESC, n.id DESC LIMIT 1) AS creatine
         FROM nutrition_products p
        WHERE p.barcode = ?
        ORDER BY p.confidence_score DESC, p.updated_at DESC
        LIMIT 1`
    );

    const row = stmt.get(barcode);
    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(mapProductRow(row));
  });

  app.post("/api/nutrition/products/contribute", (req, res) => {
    try {
      const anonymousUserId = toStringOrUndefined(req.body?.anonymousUserId);
      const deviceId = toStringOrUndefined(req.body?.deviceId);
      if (!anonymousUserId && !deviceId) {
        return res.status(400).json({ error: "anonymousUserId or deviceId is required" });
      }

      const submittedBarcode = toStringOrUndefined(req.body?.submittedBarcode)?.replace(/\s+/g, "");
      const submittedName = toStringOrUndefined(req.body?.submittedName);
      const submittedBrand = toStringOrUndefined(req.body?.submittedBrand);
      const submittedCountry = toStringOrUndefined(req.body?.submittedCountry);
      const submittedLanguage = toStringOrUndefined(req.body?.submittedLanguage);
      const submittedItemTypeRaw = toStringOrUndefined(req.body?.submittedItemType) || "food";
      const submittedItemType = (PRODUCT_ITEM_TYPES as readonly string[]).includes(submittedItemTypeRaw)
        ? submittedItemTypeRaw
        : null;

      if (!submittedItemType) {
        return res.status(400).json({ error: "Invalid submittedItemType" });
      }

      if (!submittedBarcode && !submittedName) {
        return res.status(400).json({ error: "submittedBarcode or submittedName is required" });
      }

      const submittedImageUrl = toStringOrUndefined(req.body?.submittedImageUrl);
      const submittedLabelImageUrl = toStringOrUndefined(req.body?.submittedLabelImageUrl);
      const sourceRaw = toStringOrUndefined(req.body?.source) || "user";
      const source = (PRODUCT_SOURCES as readonly string[]).includes(sourceRaw) ? sourceRaw : "user";
      const category = toStringOrUndefined(req.body?.submittedCategory);
      const nutrients = parseNutritionPayload(req.body?.submittedNutritionJson);
      const confidenceScore = computeConfidenceScore({
        barcode: submittedBarcode,
        name: submittedName,
        brand: submittedBrand,
        imageUrl: submittedImageUrl,
        nutrients,
      });

      let productId: number | null = null;

      if (submittedBarcode) {
        const existingByBarcode = db.prepare(
          `SELECT id
             FROM nutrition_products
            WHERE barcode = ?
            ORDER BY confidence_score DESC, updated_at DESC
            LIMIT 1`
        ).get(submittedBarcode) as { id: number } | undefined;

        if (existingByBarcode?.id) {
          productId = existingByBarcode.id;
        }
      }

      if (!productId && submittedName) {
        const insertProduct = db.prepare(
          `INSERT INTO nutrition_products (
             barcode,
             name,
             brand,
             country,
             language,
             category,
             item_type,
             image_url,
             label_image_url,
             source,
             verification_status,
             confidence_score,
             created_at,
             updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unverified', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
        );

        const insertProductInfo = insertProduct.run(
          submittedBarcode || null,
          submittedName,
          submittedBrand || null,
          submittedCountry || null,
          submittedLanguage || null,
          category || null,
          submittedItemType,
          submittedImageUrl || null,
          submittedLabelImageUrl || null,
          source,
          confidenceScore
        );

        productId = Number(insertProductInfo.lastInsertRowid);
      }

      if (productId) {
        const insertNutrients = db.prepare(
          `INSERT INTO nutrition_product_nutrients (
             product_id,
             per_unit,
             kcal,
             protein,
             carbs,
             fats,
             sugar,
             salt,
             sodium,
             fiber,
             caffeine,
             creatine,
             created_at,
             updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
        );

        insertNutrients.run(
          productId,
          nutrients.perUnit,
          nutrients.kcal,
          nutrients.protein,
          nutrients.carbs,
          nutrients.fats,
          nutrients.sugar,
          nutrients.salt,
          nutrients.sodium,
          nutrients.fiber,
          nutrients.caffeine,
          nutrients.creatine
        );
      }

      const contributionStatus = "pending";
      if (!(CONTRIBUTION_STATUSES as readonly string[]).includes(contributionStatus)) {
        return res.status(500).json({ error: "Invalid contribution status configuration" });
      }

      const contributionInsert = db.prepare(
        `INSERT INTO nutrition_product_contributions (
           product_id,
           anonymous_user_id,
           device_id,
           submitted_barcode,
           submitted_name,
           submitted_brand,
           submitted_country,
           submitted_language,
           submitted_item_type,
           submitted_nutrition_json,
           submitted_image_url,
           submitted_label_image_url,
           status,
           created_at,
           updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      );

      const contributionInfo = contributionInsert.run(
        productId,
        anonymousUserId || null,
        deviceId || null,
        submittedBarcode || null,
        submittedName || null,
        submittedBrand || null,
        submittedCountry || null,
        submittedLanguage || null,
        submittedItemType,
        JSON.stringify(nutrients),
        submittedImageUrl || null,
        submittedLabelImageUrl || null,
        contributionStatus
      );

      res.status(201).json({
        contributionId: Number(contributionInfo.lastInsertRowid),
        productId,
        status: contributionStatus,
      });
    } catch (error: any) {
      console.error("Error creating nutrition contribution:", error);
      res.status(500).json({ error: "Failed to create contribution", details: error?.message });
    }
  });

  app.post("/api/nutrition/products/:id/report", (req, res) => {
    try {
      const productId = Number.parseInt(req.params.id, 10);
      if (!Number.isFinite(productId) || productId <= 0) {
        return res.status(400).json({ error: "Invalid product id" });
      }

      const productExists = db.prepare("SELECT id FROM nutrition_products WHERE id = ? LIMIT 1").get(productId) as { id: number } | undefined;
      if (!productExists?.id) {
        return res.status(404).json({ error: "Product not found" });
      }

      const anonymousUserId = toStringOrUndefined(req.body?.anonymousUserId);
      const deviceId = toStringOrUndefined(req.body?.deviceId);
      if (!anonymousUserId && !deviceId) {
        return res.status(400).json({ error: "anonymousUserId or deviceId is required" });
      }

      const reason = toStringOrUndefined(req.body?.reason);
      if (!reason) {
        return res.status(400).json({ error: "reason is required" });
      }

      const correctedValues = parseNutritionPayload(req.body?.correctedValuesJson);
      const reportStatus = "open";
      if (!(REPORT_STATUSES as readonly string[]).includes(reportStatus)) {
        return res.status(500).json({ error: "Invalid report status configuration" });
      }

      const insertReport = db.prepare(
        `INSERT INTO nutrition_product_reports (
           product_id,
           anonymous_user_id,
           device_id,
           reason,
           corrected_values_json,
           status,
           created_at,
           updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      );

      const info = insertReport.run(
        productId,
        anonymousUserId || null,
        deviceId || null,
        reason,
        JSON.stringify(correctedValues),
        reportStatus
      );

      res.status(201).json({
        reportId: Number(info.lastInsertRowid),
        productId,
        status: reportStatus,
      });
    } catch (error: any) {
      console.error("Error creating nutrition product report:", error);
      res.status(500).json({ error: "Failed to create report", details: error?.message });
    }
  });

  app.get("/api/nutrition/barcode/:barcode", async (req, res) => {
    const barcodeRaw = typeof req.params.barcode === "string" ? req.params.barcode.trim() : "";
    const barcode = barcodeRaw.replace(/\s+/g, "");

    if (!/^\d{8,14}$/.test(barcode)) {
      return res.status(400).json({ error: "Invalid barcode" });
    }

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`);
      if (!response.ok) {
        return res.status(502).json({ error: "Barcode lookup failed" });
      }

      const payload = (await response.json()) as any;
      if (!payload || payload.status !== 1 || !payload.product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = payload.product || {};
      const nutriments = product.nutriments || {};

      const parsedServing = parseServingFromText(product.serving_size);
      const servingQuantity = toNutritionNumber(product.serving_quantity, parsedServing.size);
      const servingUnit = typeof product.serving_quantity_unit === "string" && product.serving_quantity_unit.trim().length > 0
        ? product.serving_quantity_unit.trim().toLowerCase()
        : (parsedServing.unit || "gram");

      const normalized = {
        name:
          (typeof product.product_name === "string" && product.product_name.trim()) ||
          (typeof product.product_name_en === "string" && product.product_name_en.trim()) ||
          "Onbekend product",
        brand:
          (typeof product.brands === "string" && product.brands.split(",")[0]?.trim()) ||
          undefined,
        barcode,
        imageUrl:
          (typeof product.image_front_url === "string" && product.image_front_url.trim()) ||
          (typeof product.image_url === "string" && product.image_url.trim()) ||
          undefined,
        kcal: toNutritionNumber(
          nutriments["energy-kcal_serving"],
          nutriments["energy-kcal_100g"],
          nutriments["energy-kcal"],
          nutriments["energy-kcal_value"]
        ),
        protein: toNutritionNumber(nutriments.proteins_serving, nutriments.proteins_100g, nutriments.proteins),
        carbs: toNutritionNumber(nutriments.carbohydrates_serving, nutriments.carbohydrates_100g, nutriments.carbohydrates),
        fats: toNutritionNumber(nutriments.fat_serving, nutriments.fat_100g, nutriments.fat),
        sugar: toNutritionNumber(nutriments.sugars_serving, nutriments.sugars_100g, nutriments.sugars),
        salt: toNutritionNumber(nutriments.salt_serving, nutriments.salt_100g, nutriments.salt),
        servingSize: servingQuantity > 0 ? servingQuantity : 100,
        servingUnit,
      };

      if (!(VERIFICATION_STATUSES as readonly string[]).includes("unverified")) {
        return res.status(500).json({ error: "Invalid verification status configuration" });
      }

      res.json(normalized);
    } catch (error: any) {
      console.error("Barcode lookup error:", error);
      res.status(500).json({ error: "Failed to lookup barcode", details: error?.message });
    }
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
