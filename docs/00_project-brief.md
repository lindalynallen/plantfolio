# 🌿 Plantfolio: Project Brief (Edited for Word Flow & Clarity)

## Overview

**Plantfolio** is a personal website that displays my collection of 50+ houseplants, each with a visual timeline that captures its growth over time.

This serves both as a **portfolio project** for potential employers and a **public gallery** for plant enthusiasts and friends.

**Target Audiences:**

* **Public Visitors:** Friends, family, and anyone interested in plants.
* **Recruiters / Engineers:** See demenstrated technical skills, design choices, and architectural decisions.
* **Myself (Owner):** Visually manage and track the growth of my plants.

---

## The Problem

My collection currently lives within the **Planta mobile app**, which presents several limitations:

* No support for **public sharing**.
* Its **public API** exposes only a single image per plant, with no access to historical photo data.

**The Core Challenge:**

> How can a historical photo timeline be built when the API only provides the most recent image?

---

## The Solution

Plantfolio builds a **self-maintaining, historical photo archive** by combining two sources of data:

1. **Manual Backfill:** Archived plant photos are uploaded and organized within Supabase storage.
2. **Automated Sync:** A scheduled process polls the Planta API daily to detect and store new images as they become available.

Both metadata and images are stored in Supabase, while the front end presents each plant’s growth timeline in a beautiful, efficient format.

---

## Tech Stack

| Layer                  | Technology                          | Purpose                                       |
| ---------------------- | ----------------------------------- | --------------------------------------------- |
| **Framework**          | Next.js (App Router) + TypeScript   | Full-stack React framework for modern apps    |
| **Styling**            | Tailwind CSS + shadcn/ui (optional) | Themeable UI with rapid styling capabilities  |
| **Database & Storage** | Supabase                            | Houses plant metadata and historical photos   |
| **Hosting**            | Vercel                              | Enables CI/CD and cron job scheduling         |
| **API Source**         | Planta API                          | Retrieves the latest plant data and images    |
| **Image Viewer**       | `yet-another-react-lightbox`        | Provides an interactive gallery experience    |
| **AI Tools**           | ChatGPT / Cursor / Claude Code      | Supports development, automation, and writing |

---

## Key Features

1. **📸 Growth Timelines** – Chronological photo galleries showing each plant’s progress.
2. **🪴 Individual Plant Pages** – Detailed views with names, species, and location metadata.
3. **🔄 Auto-Sync with Planta** – A daily sync fetches the latest photos from the API.
4. **🗂️ Structured Backfill System** – Archived photos are organized into Supabase folders.
5. **🌐 Public Gallery** – A responsive, easy-to-browse grid of all plants.
6. **📱 Mobile-Optimized UI** – Fully responsive design for smooth viewing on all devices.
7. **💾 Read-Only Architecture** – Public users can view but not modify content.

---

## Outcome

Plantfolio transforms a **closed mobile app experience** into an **open, interactive web platform**, while serving as a **living demonstration of modern full-stack development** and **API-driven architecture**.