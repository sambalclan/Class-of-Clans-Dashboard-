# Sambal Balado — Clash of Clans Dashboard

A statistics dashboard for the clan **Sambal Balado** (`#2RVRP900V`), built on **Cloudflare Workers**, **Cloudflare D1**, and the **Clash of Clans API**.

This project displays clan data, wars, Clan War League (CWL), and Raid Weekend, including history collected over time.

> **AI credit:** The code and development of this project were created with the help of **Claude (Anthropic)**, **Gemini (Google)**, and **ChatGPT (OpenAI)**. The AI output was reviewed, adjusted, and integrated for the needs of this project. This project is not an official product of those AI providers or of Supercell.

## Features

- Clan and member information.
- **Current War** status and war archive.
- **Raid Weekend** statistics and Raid history.
- **Clan War League (CWL)** data and history.
- Data storage in **Cloudflare D1**.
- Automatic updates through **Cron Triggers**.
- JSON-based API that the frontend can use.
- Protection of older Raid member data when later API responses no longer include `members[]`.

> **Note:** Historical data is only available as far as it was successfully collected. The protection cannot restore member details that were lost before it was introduced.

## Technology

- JavaScript
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- Clash of Clans API (through the RoyaleAPI proxy configured in the Worker)
- HTML/CSS/JavaScript for the dashboard, if included in the repository

## 1. Fork the Repository

1. Open this project's GitHub repository page.
2. Click the **Fork** button at the top right.
3. Choose the destination GitHub account.
4. Click **Create fork**.
5. When it finishes, open your forked repository.

To download the code to a device that already has Git:

```bash
git clone https://github.com/USERNAME/REPO-NAME.git
cd REPO-NAME
```

Replace `USERNAME` and `REPO-NAME` with the address of your fork.

## 2. Preparation

Prepare:

- A GitHub account.
- A Cloudflare account.
- A valid Clash of Clans API token.
- A forked repository that already contains the project files, including `worker.js`.

**Never put the API token in a public repository.** Store the token as a Cloudflare Worker secret.

## 3. Create the Cloudflare D1 Database

1. Sign in to the Cloudflare dashboard.
2. Open **Workers & Pages → D1** (menu names may change).
3. Create a new database, for example `balado-archive`.
4. Note the database you created so you can connect it to the Worker.

The Worker code creates the `latest` and `history` tables if they do not exist, when it runs with the correct D1 binding.

## 4. Install the Cloudflare Worker

### Through the Cloudflare dashboard

1. Open **Workers & Pages**.
2. Create a new Worker or open an existing one.
3. Use the `worker.js` file already in the repository. You do not need to create a new file. If you deploy through the dashboard, use the code from that file.
4. Add a **D1 binding** with the variable name **`DB`**, then select the database created in the previous step.
5. Add a **Secret** named **`COC_API_TOKEN`** and fill it with your API token.
6. Adjust the `TAG` constant in `worker.js` to the clan tag you want to monitor.
7. Deploy the Worker.
8. Set a **Cron Trigger** for periodic updates, for example every 15 minutes (`*/15 * * * *`).

> Menu names and setting locations may change as the Cloudflare dashboard is updated.

### Through Wrangler (optional)

If the repository already has a suitable Wrangler configuration, you can deploy directly from the repository folder without adding new files:

```bash
npm install -g wrangler
wrangler login
wrangler secret put COC_API_TOKEN
wrangler deploy
```

Make sure the Wrangler configuration lists the Worker entry point and a D1 binding named `DB` that points to your database. The commands above do not replace that configuration.

## 5. Configuration

At the top of `worker.js`, adjust:

```javascript
const BASE = 'https://cocproxy.royaleapi.dev/v1';
const TAG = '#2RVRP900V';
```

- `BASE`: the API/proxy address used by the Worker.
- `TAG`: the clan tag you want to monitor.
- `COC_API_TOKEN`: a Cloudflare secret, **not** a constant written directly in the code.
- `DB`: the name of the Cloudflare D1 binding used by the Worker.

If you use a third-party proxy, make sure the service is still available and fits your API access needs.

## 6. Testing

After deploying, open your Worker URL and check the following endpoints:

| Endpoint | Description |
| --- | --- |
| `/health` | Worker status, D1 binding, and token presence |
| `/clan` | Latest stored clan data |
| `/currentwar` | Current war data |
| `/raid` | Latest Raid Weekend data |
| `/cwl` | Latest CWL data |
| `/cwl/groups` | CWL group data |
| `/war/history` | War history |
| `/raid/history` | Raid Weekend history |
| `/cwl/history` | CWL history |

Some endpoints are also available with an `/api/` prefix, for example `/api/raid/history`.

**Important:** The `/health` endpoint only checks basic conditions; the latest data becomes available after a data fetch has run successfully. The Worker in this project uses Cron for updates, not a public refresh endpoint.

## 7. Deploy the Frontend

Use `index.html`, the `js/` and `pages/` folders, and the other assets already in the repository. Deploy the frontend through a static hosting service of your choice, for example GitHub Pages or Cloudflare Pages. You do not need to recreate these files.

Make sure the API address in the frontend JavaScript points to the URL of your deployed Worker. The structure and build process of the frontend depend on the files available in each fork.

## 8. Updating from the Original Repository

To pull updates through Git:

```bash
git remote add upstream https://github.com/sambalclan/balado.git
git fetch upstream
git merge upstream/main
```

Run these commands from your forked repository folder. Adjust the branch name if the repository uses a branch other than `main`. If the `upstream` remote already exists, you do not need to add it again.

## 9. Security and Data Notes

- Do not publish API tokens, secrets, or Cloudflare credentials.
- Back up D1 before changing the schema or restoring data.
- **D1 Time Travel Restore overwrites the state of the live database**; do not use it without understanding the impact.
- Historical Raid data from the API may no longer include `members[]`. The Worker tries to keep member data that was stored earlier.
- Cron schedules, API quotas, and data availability can affect how complete the history is.

## Credits and Attribution

The **Sambal Balado** project was developed with the help of the following AI tools:

- **Claude** — Anthropic
- **Gemini** — Google
- **ChatGPT** — OpenAI

AI was used to help with writing code, explanations, troubleshooting, and feature development. Naming these tools is a matter of transparency about AI use, **not** a statement of endorsement or official partnership.

Clash of Clans is a trademark of Supercell. This project is an independent community project and is not affiliated with or endorsed by Supercell.
