# Plintoo website: product requirements

| | |
|---|---|
| Status | Draft 0.1 |
| Date | 2026-10-11 |
| Owner | Ralf Lindemann (DEIXIS DESIGN LTD) |
| Repo | `plintoo-web` (the public site). The hosting edge and the scheduled data loading jobs live in a separate repo, `plintoo-data`. |

Every statement about Plintoo below comes from Ralf's own notes, dated where the date matters. Anything he has not decided is marked **OPEN** and collected in section 11. Nothing in this file invents a price, a customer, a date or a feature.

---

## 1. What this site is for

The Plintoo website does four jobs:

1. Explains what Plintoo is and who it is for.
2. Lets a company pay for Plintoo and download or open it.
3. Holds the full documentation, visible to customers who are logged in.
4. Gives a prospect a way to talk to Ralf (demo, quote, custom workflow).

Out of scope: the Plintoo platform itself (chat, memory, tools), the hosting edge and the data loading jobs (`plintoo-data`), and the decision-capture app DIKTON as a product (it is part of Plintoo and appears on this site only as a feature).

## 2. Background

- **Plintoo** is an AI workspace platform for companies. It is a chat front door plus company memory, an application programming interface (API) layer and connected tools. It is model-agnostic, and teams connect and work from the same memory. It runs on the open-source LibreChat and is never branded as LibreChat.
- It started as a tool Ralf built for himself: he wanted to stay model-agnostic (including running free or cheap models locally) and wanted one command centre to control different things, organise them and grow memory.
- **Audience:** small and mid-size architecture and design teams, adaptable to other businesses. Ralf wants the majority of firms that are smaller than OmniChat's customers.
- **Competitors Ralf has named:** OmniChat, AEC Foundry, vBRIEF. He also sees practices building their own retrieval-augmented generation (RAG) systems and chat interfaces as a threat.
- **Build status (his note, 2026-10-02):** the infrastructure is basically there, but Plintoo is not ready to run end to end. Agents still need to be built and connected per workflow.
- **Ways to get it that Ralf has described:** rented (hosted by DEIXIS); custom developed for a company with a head start; and, as an idea for small offices and single architects, installed through Docker on their own desktops.

## 3. Positioning the site must carry

Chosen on 2026-10-09 for the incubator pitch. Not yet confirmed as the website's positioning. Treat as the working draft.

- **Core idea:** "decisions, not documents". Plintoo's distinct part is the record of a practice's decisions and the reasons behind them (DIKTON inside it). Memory and model choice are supporting features.
- **Claim:** "Architects have enough tools. I build the structure underneath them: the one part of the practice that survives when every tool, every model and every person changes."
- **Strapline:** "Change every tool. Keep every reason."
- **Wording to use:** "command centre".
- **Do not lead with the chat.** Ralf sees chat as a commodity regardless of interface.
- **Do not sound like an operating system for firms.** That is AckroydLowrie's idea.
- **Do not sound like OmniChat.**
- **Never mention LibreChat as the brand.**

## 4. Goals and non-goals

**Goals**
- A visitor understands within one screen what Plintoo is, who it is for and how it differs from a chat window.
- A buyer can get from the Pricing page to a working account without talking to Ralf (hosted route), once the product is ready.
- A prospect who is not ready to buy can ask for a demo, a quote or a custom workflow.
- A customer can find any answer in the documentation after login.

**Non-goals**
- Showing the platform itself in marketing material. Ralf will not show the platform in the incubator video; whether the site shows screenshots is **OPEN**.
- A blog or content engine in the first release.
- Case studies before there is a customer.

What Ralf wants from the incubator, which shapes what the site needs to do: first customers and go-to-market help.

## 5. Users

| User | What they need from the site |
|---|---|
| Principal or director of a small practice | Understand it fast, see a price, start without IT help |
| Digital or technology lead in a mid-size team | Security and data answers, model choice, how it connects to existing tools |
| Technical buyer or IT contact | Hosting options, data location, isolation between customers, install steps |
| Company wanting a custom workflow (for example Parametric Climate, a lead who found Honcho, an open-source agent memory layer, and is weighing building memory in-house) | See Plintoo is the whole system and Honcho is one component (memory); a route to a paid engagement |
| Existing customer | Log in, manage seats and billing, download, read the documentation, get support |
| Plintoo staff | Customers, workspaces, licences and usage (internal, outside this repo) |

## 6. Site map

```
PUBLIC SITE
Home
Product
   Overview (the command centre)
   Decision record (DIKTON)
   Models
   Connected tools
   Workflows
      Index by practice domain
      One page per workflow
   Security and data
How you get it
   Hosted by us
   Installed on your own machine (Docker)
   Built for you (custom workflows)
Pricing
Documentation (public front page only)
About
Contact / Request a demo
Legal: terms, privacy, cookies

CUSTOMER AREA (login)
Sign up / Sign in
Checkout
Dashboard
Downloads
Team and seats
Billing and invoices
Full documentation
Support
Account settings
```

## 7. Page requirements

Status key: **READY** can be built now. **BLOCKED** needs a decision in section 11 first.

| Page | Purpose | Must contain | Primary action | Status |
|---|---|---|---|---|
| Home | Say what it is and who it is for | Strapline, one-sentence claim, three-line description, who it is for, how you get it | Request a demo | READY (wording draft) |
| Product / Overview | Explain the command centre | One place to control tools, models and memory; what company memory means in practice | Request a demo | READY |
| Product / Decision record | Show the distinct part | What a decision record holds (the decision, the reasons, the evidence, who owned it); DIKTON as a feature | Request a demo | READY |
| Product / Models | Model choice | Model-agnostic: which providers and local models are supported (list to confirm from the platform) | None | BLOCKED on the confirmed model list |
| Product / Connected tools | Tools and API layer | Which tools connect (list to confirm from the platform) | None | BLOCKED on the confirmed tool list |
| Product / Workflows (index and pages) | Show what agents do per practice domain | Each workflow page follows Ralf's mapping: pain point (from his research) → client need → Plintoo function → client benefit | Request a demo | BLOCKED on which domains and workflows come first |
| Product / Security and data | Answer the buyer's data questions | How customers are kept apart; where data lives; what is retained and for how long; who can see what | Contact | BLOCKED on the isolation test result and the retention check |
| How you get it (three pages) | Explain hosted, own-machine and custom routes | What each route is, who it suits, what you get, what you do next | Pricing or Contact | READY for hosted and custom; own-machine page BLOCKED on whether Docker install is offered |
| Pricing | Show what it costs | Plans, seats, price shown both **per month and per year**, what is included | Checkout, or Request a quote while checkout is off | BLOCKED on pricing |
| Documentation (public) | Show docs exist | Contents list, what the full docs cover, login prompt | Sign in | READY |
| About | Who is behind it | Ralf, DEIXIS, why Plintoo exists (it began as his own tool) | Contact | READY |
| Contact / Request a demo | Capture the lead | Name, company, size, route of interest, message | Submit | READY |
| Legal | Terms, privacy, cookies | Company details, data handling | None | BLOCKED on company details and legal text |
| Sign up / Sign in | Customer accounts | Email and password or single sign-on (OPEN), password reset | Sign in | BLOCKED on authentication choice |
| Checkout | Take payment | Plan, seats, payment, invoice details | Pay | BLOCKED on pricing, payment provider and product readiness |
| Dashboard | Customer home | Plan, status, link to open the workspace | Open workspace | BLOCKED on `plintoo-data` provisioning |
| Downloads | Deliver the install | Docker package, licence key, install steps | Download | BLOCKED on whether Docker install is offered and how licences are enforced |
| Team and seats | Manage people | Invite, remove, seat count | Invite | BLOCKED on pricing model |
| Billing and invoices | Manage payment | Invoices, card, plan change, cancel | Update | BLOCKED on payment provider |
| Full documentation | Help | Search, install guides, admin guides, workflow guides | Search | READY to scaffold; content follows the product |
| Support | Get help | Contact route, status | Submit | READY |
| Account settings | Profile | Name, email, password, delete account | Save | BLOCKED on authentication choice |

## 8. Main journeys

1. **Evaluate:** Home → Product → How you get it → Request a demo.
2. **Buy, hosted:** Pricing → Checkout → Sign up → workspace set up by `plintoo-data` → Dashboard → Open workspace.
3. **Buy, own machine:** Pricing → Checkout → Sign up → Downloads → install → licence key.
4. **Custom workflow:** How you get it / Built for you → Contact. Ralf's preference is to leave the choice of workflow with the company, who come back with the idea, so the form asks what the company wants automated rather than proposing a workflow.
5. **Existing customer:** Sign in → Dashboard, Documentation or Support.

## 9. Functional requirements

- **Accounts:** sign up, sign in, password reset, one organisation per account with several users. Method **OPEN**.
- **Payments:** subscription billing per seat, invoices, plan changes, cancellation. Provider **OPEN**.
- **Prices:** every recurring figure is shown both per month and per year, never one only.
- **Provisioning link:** after payment the site asks `plintoo-data` to create the customer's workspace and shows its status on the Dashboard. The interface between the two repos is **OPEN** and needs a short technical note once the stack is chosen.
- **Licences and downloads:** issue a licence key, serve the Docker package to logged-in customers only. Mechanism **OPEN**.
- **Documentation:** full text behind login; the public front page lists contents only. Search inside the docs.
- **Forms:** demo request, quote request, support. Each sends to a mailbox and is stored. Spam protection.
- **Request-access mode:** a switch that turns Checkout off and shows a request form instead. Needed because the product is not ready to run end to end.
- **Analytics and cookie consent** that comply with UK rules.
- **Search engine and generative-engine visibility:** page titles, descriptions, structured data, a sitemap file.

## 10. Quality requirements

- Accessible to Web Content Accessibility Guidelines (WCAG) 2.1 level AA.
- Works from phone width up.
- Never rely on red, green, orange or brown alone to tell states apart in any diagram or chart; use lightness, pattern and text labels (Ralf's standing rule for visuals).
- UK General Data Protection Regulation compliance for accounts, forms and analytics.
- Page speed and technology stack: **OPEN** (not yet stated).

## 11. Decisions Ralf still has to make

| # | Decision | Why it matters | What it blocks | What to do |
|---|---|---|---|---|
| 1 | Pricing and plans (seat price, tiers such as Silver, Gold and Platinum were floated, hosted versus Docker pricing) | Ralf's 2026-10-04 note says pricing comes before the other epics | Pricing, Checkout, Seats, Billing | Decide first. Until then publish Pricing as a request-a-quote page |
| 2 | Is Plintoo ready enough to sell? | His note says it does not yet run end to end | Checkout, Dashboard | Run in request-access mode until one customer can log in and finish one workflow |
| 3 | First practice domains and workflows | The Workflows pages have nothing to show without them | Workflows index and pages | Pick one or two and publish only those |
| 4 | Is Docker self-install offered, and how is a licence enforced? | Changes Downloads and one How-you-get-it page | Downloads, one page | Decide, or drop the page and the Downloads area for now |
| 5 | Payment provider | Needed before Checkout can be designed | Checkout, Billing | Choose one |
| 6 | Authentication method | Email and password, or single sign-on with Microsoft or Google | Sign in, Settings | Choose one; practices commonly use Microsoft |
| 7 | Result of the tenant isolation test (does one practice stay separate from another when configured by hand) | The vault one-pager of 2026-09-21 says it is not yet proven | Security and data | Run the test; write the page from the result |
| 8 | Retention wording, to be checked against the model providers' current terms | The 2026-09-21 one-pager notes 30-day retention on the most capable Anthropic models; the file is three weeks old | Security and data | Verify, then state it as a plain sentence |
| 9 | Does the site show the platform (screenshots, demo video)? | He is keeping it out of the incubator video | Home, Product | Decide |
| 10 | Is "decisions, not documents" the website's positioning, or only the pitch's? | Home wording depends on it | Home, Product | Confirm or replace |
| 11 | Is Plintoo the Decision Infrastructure half of DEIXIS's Decision Design? | He agreed and then questioned it on 2026-10-08; it changes how the About page describes the link to DEIXIS | About | Settle, or leave DEIXIS out of the first release |
| 12 | Company details and legal text for terms, privacy and cookies | Required to go live | Legal | Provide company name, number, address; legal text to be written or reviewed |
| 13 | Domain name and site technology stack | Not stated anywhere I have read | Everything | State them |

## 12. Order of build

This follows what is blocked, not a gradual launch.

1. **First:** Home, Product overview, Decision record, How you get it (hosted, custom), About, Contact and Request a demo, Documentation front page, Legal skeleton. All READY. Result: a site that explains Plintoo and collects leads.
2. **When decisions 1, 3 and 7 are made:** Pricing, Workflows, Security and data.
3. **When decisions 2, 4, 5 and 6 are made and `plintoo-data` can provision:** Sign up, Checkout, Dashboard, Downloads, Seats, Billing, Full documentation.

## 13. How success is judged

Targets are not set, because none have been stated. Set them before launch for: demo requests per month, paid conversations started per month, and customers who complete one workflow in their first month. First customers are the measure Ralf has named as his aim.

## 14. Risks

- The site promises more than the product does. Mitigation: request-access mode and a Security page written only from tested facts.
- Positioning drifts into an operating system or a generic chat product. Mitigation: section 3 is the checklist for every page.
- Practices build their own chat and retrieval systems. Mitigation: lead with the decision record, which a chat interface does not give them.
- The two repos disagree about customers and licences. Mitigation: write the interface note under decision 13.

## 15. Where this came from

- Ralf's notes in the Plintoo project, 2026-10-02 to 2026-10-09 (positioning, roadmap, repos, competitors, incubator, Parametric Climate).
- `strategy/09_Projects/internal/librechat/2026-09-21_one_pager.md` and `PROJECT.md` (isolation, retention, modules). Both predate the Plintoo name and the later decisions, so where they differ, the October notes win.
- A page tree agreed in conversation on 2026-10-11.
