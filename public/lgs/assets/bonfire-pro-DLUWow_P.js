const e="bonfire-pro",t="Bonfire Pro: what happens to a bid, stage by stage",a="Portal pedia · 10",n="Bonfire Pro: what happens to a bid, from one login to the board",s="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. Two bids are followed the whole way. One dies at triage. One reaches the board as a YES at score 92. That winner is Canadian, on a portal our own map still describes as a United States only slice. The files say otherwise, and the files win.",o=[{value:"2,626",label:"in snapshot"},{value:"367",label:"new since last run"},{value:"7",label:"triage says open"},{value:"5",label:"yes"},{value:"1",label:"maybe"},{value:"1",label:"no"}],r="Every count above is copied from data/bonfire-pro/daily/2026-07-28/stats.json (464 bytes). The other 360 new bids were SKIPped at triage and cost one title-and-scope read each. One caution on the second number: the previous archive folder is 2026-07-24, so those 367 are everything new across four days, not one night. The portal is set to run every day (cadence_days: 1) and has 22 archive days on record since 20 June.",i=["Bid A · CA.109644 · District of North Saanich Harvest Hub Operator. Dies at triage.","Bid B · CA.109556 · Right-of-Way Brush Maintenance, Énergie NB Power. Ends as YES, score 92."],l=[{n:"0",title:"Is it due tonight?",who:"scripts/portal_due.py --batch portals",summary:["Before anything runs, one script looks at the newest folder under data/bonfire-pro/daily/ and asks whether it is old enough. Bonfire Pro is set to one day, so almost any night makes it due.","Cadence is read from the shared database first, and from the registry file only if that lookup fails."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the portal list"},{path:"data/bonfire-pro/daily/*",size:"22 folders, oldest 2026-06-20"}],blocks:[],notes:[],tables:[]},{label:"Out · the registry row this portal is gated by",paths:[],blocks:[`{
 "slug": "bonfire-pro",
 "label": "Bonfire Pro (login)",
 "engine": "",
 "batch": "portals",
 "cadence_days": 1,
 "authed": true,
 "enrich_passes": ["bonfire-pro c+d", "bonfire-pro docs"],
 "watch": "v2-recipe",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:['Note "engine": "". Every other portal names an engine file here. This one has none, because the sweep is five hand-written scripts instead. Anything that looks a portal up by engine name gets a blank.'],tables:[]}],notes:[],then:"the orchestrator hands the whole portal to a child agent"},{n:"1",title:"Dispatch, last and alone",who:"child agent → .claude/skills/bonfire-pro/SKILL.md",summary:["There is no single script that runs this portal. A child agent reads the skill file and runs five Python scripts in order, checking the result of each one before the next.","It goes last, in the final batch, together with the other paid-login portal. That is on purpose. A real vendor account is being used, so it is paced instead of hammered in parallel with everything else."],cells:[{label:"In → Out",paths:[{path:".claude/skills/bonfire-pro/SKILL.md",size:"the runbook the agent follows"},{path:"a running child agent",size:"one session, one login"}],blocks:[],notes:[],tables:[]},{label:"The five scripts, in the order they run",paths:[],blocks:[`data/bonfire-ports/scripts/extended/
 login.py only if the pull 401s
 pull_opps.py the whole open universe
 dedup_new.py --mode daily
 overlap_test.py informational only
 compile_report.py report + archive`],notes:["The code lives under the other slug, bonfire-ports. So do the working files: every runs/extended/… path on this page means data/bonfire-ports/runs/extended/, never a bonfire-pro folder. Only the finished daily archive is written under bonfire-pro. Anyone grepping the bonfire-pro folder for the scraper finds nothing."],tables:[]}],notes:[],then:"the session cookie is the key to everything after this"},{n:"2",title:"The one login of the day",who:"data/bonfire-ports/scripts/extended/login.py",summary:["Bonfire's login is two steps: type the email, press Continue, then type the password. A stealth browser does it and solves the Cloudflare check on the way in. What gets saved is the browser's cookies. That cookie jar is the authentication. There is no usable token.","This step is normally skipped. The puller is the probe: if the saved cookie still works, login never runs. On 28 July it did run."],cells:[{label:"In → Out",paths:[{path:"data/auth/bonfire.env",size:"the account"},{path:"data/auth/bonfire-cookies.json",size:"3,976 bytes · written 17:18"},{path:"data/auth/bonfire-token.txt",size:"35 bytes · last written 20 June"}],blocks:[],notes:[],tables:[]},{label:"How we know login ran that night",paths:[],blocks:[`file write times, 28 July 2026
17:18 data/auth/bonfire-cookies.json
17:19 all-raw-2026-07-28.json
17:19 all-mapped-2026-07-28.json
17:25 triage-verdicts-2026-07-28.json
17:31 judge-verdicts-2026-07-28.json
17:37 data/bonfire-pro/daily/2026-07-28/report.md`],notes:["A fresh cookie one minute before the pull. The token file has not been touched since 20 June, which matches what the code says: the token is written but never used. The cookie is the whole story, and how long it lives is unknown, somewhere between hours and a day."],tables:[]}],notes:[],then:"one search endpoint, 100 rows a page, until the whole open set is in memory"},{n:"3",title:"Pull the whole open universe",who:"data/bonfire-ports/scripts/extended/pull_opps.py",summary:["One authenticated search endpoint returns every open opportunity across the network, 100 at a time. That night it came back with 2,626 of them.","The thing that makes this portal different from every other one: the full scope text is already inside the list. All 2,626 rows had a real statement of work. No second page fetch is needed to judge a bid."],cells:[{label:"In → Out",paths:[{path:"data/auth/bonfire-cookies.json",size:"sent as one Cookie header"},{path:"runs/extended/all-raw-2026-07-28.json",size:"5.62 MB · 2,626 rows"},{path:"runs/extended/all-mapped-2026-07-28.json",size:"3.28 MB · 2,626 rows"}],blocks:[`by network prefix on ProjectID
US 2,102
CA 521 not a US-only slice
EU 3`],notes:[],tables:[]},{label:"Real raw record Bid B",paths:[],blocks:[`{
 "ProjectUUID": "8ada2668-9ea0-4b3c-…",
 "ProjectName": "Right-of-Way Brush Maintenance
 – Fredericton to Norton",
 "ReferenceID": "XXXX-26-C244-6",
 "StatementOfWork": "The Work shall be the cutting
 of all trees and brush, the trimming of trees on
 Right-of-Way (R.O.W.) edge, the disposal of all
 disposable waste material…",
 "ProjectID": "CA.109556",
 "ProjectType": "RFT",
 "DateOpen": "2026-07-27 18:00:00",
 "DateClose": "2026-08-11 16:30:00",
 "ExternalLink": null,
 "Organization": {
 "Domain": "nbpower.bonfirehub.ca",
 "OrganizationName": "Énergie NB Power",
 "Network": "bonfire"
 },
 "Locations": ["CA"],
 "Summary": [
 "Brush and tree clearing work along an
 existing right-of-way corridor.",
 "Scope includes tree cutting, brush cutting,
 and edge trimming.",
 "All cleared vegetative waste must be
 disposed of by the contractor.",
 "Additional clearing tasks may be directed
 on-site by the Owner's Representative."
 ]
}`],notes:[],tables:[]}],notes:["Two things in that record we do not use, and one that could bite. Bonfire ships a ready-made bullet summary on 2,226 of the 2,626 rows and we throw it away. And the mapper says: use the statement of work, or else fall back to the summary. But the summary is a list, and the fallback line calls a text function on it. If a row ever arrives without a statement of work, that line crashes the whole pull. On 28 July zero rows lacked one, so the landmine sat there untouched."],then:"a flat list of ids is the entire memory"},{n:"4",title:"Cut it down to what is genuinely new",who:"data/bonfire-ports/scripts/extended/dedup_new.py --mode daily",summary:["The memory here is not a database. It is one flat file of every project id ever pulled, 6,146 of them. Anything already in that list is dropped. What is left, 367 rows, has never been read by anyone.","In daily mode there is no keyword filter. Every new bid goes to the AI, whatever the title says. The keyword filter in this script exists only for the first big backfill."],cells:[{label:"In → Out",paths:[{path:"runs/extended/all-mapped-2026-07-28.json",size:"2,626 rows"},{path:"runs/extended/seen-bids.json",size:"78 KB · 6,146 ids"},{path:"runs/extended/new-uniques-2026-07-28.json",size:"459 KB · 367 rows"},{path:"runs/extended/triage-candidates-2026-07-28.json",size:"201 KB · 367 rows"}],blocks:[],notes:['2,626 minus 367 is 2,259. That number is written into stats.json as carryover_count, and the word is misleading. Nothing is carried forward. It just means "we had seen these before".'],tables:[]},{label:"Real candidate record Bid A",paths:[],blocks:[`{
 "idx": 0,
 "title": "District of North Saanich Harvest
 Hub Operator",
 "buyer": "District of North Saanich",
 "state": "CA.BC",
 "id": "CA.109644",
 "scope": "The District of North Saanich is
 requesting proposals from qualified individuals,
 organizations, co-operatives, or businesses
 interested in operating the North Saanich
 Harvest Hub…"
}`],notes:["Six fields, scope cut to 600 characters. The AI reads this and nothing else."],tables:[]}],notes:[],then:"a side check that changes nothing"},{n:"5",title:"How much of this is also on DemandStar?",who:"data/bonfire-ports/scripts/extended/overlap_test.py",summary:["Bonfire and DemandStar partly carry each other's bids. This step counts how many titles appear on both. It drops nothing and it never has. The number goes into the report so the operator can see the relationship.","The match is on cleaned-up titles only, which is why the file itself calls the answer a floor rather than the truth."],cells:[{label:"In → Out",paths:[{path:"runs/extended/all-mapped-2026-07-28.json",size:null},{path:"data/demandstar/bids/all-bids.json",size:"active rows only"},{path:"runs/extended/overlap-2026-07-28.json",size:"288 bytes"}],blocks:[],notes:[],tables:[]},{label:"The whole file, as written",paths:[],blocks:[`{
 "date": "2026-07-28",
 "bonfire_unique": 2603,
 "demandstar_unique": 1865,
 "overlap_by_title": 429,
 "bonfire_only": 2174,
 "pct_bonfire_on_demandstar": 16.5,
 "note": "title-match is a FLOOR; cross-platform
 titles differ + DemandStar snapshot may miss its
 Extended Network"
}`],notes:["2,603 unique titles out of 2,626 rows. The 23 extra rows come from just 15 repeated titles, and one of those appears 7 times inside Bonfire's own pull."],tables:[]}],notes:[],then:"367 titles and scopes go to the AI, in three parallel chunks"},{n:"6",title:"Pass 1: open it, or drop it",who:"max-triage · AI (dispatched by the child agent)",summary:["An AI reads the title and the short scope of all 367 and answers with one word each. Default is drop. Geography is not a reason to drop. Pure monitoring work is a drop.","The answer that night: 7 OPEN, 360 SKIP. The 367 were split into three chunk files and run at the same time to keep it fast."],cells:[{label:"In → Out",paths:[{path:"triage-candidates-2026-07-28.json",size:"367 rows"},{path:"triage-chunk-1/2/3-2026-07-28.json",size:"64 KB · 70 KB · 67 KB"},{path:"triage-verdicts-2026-07-28.json",size:"40 KB · 367 rows"}],blocks:[`id idx reason
US.246753 3 tree pruning, 2226 acres state land
US.246735 14 agencywide tree services contract
US.246736 17 fire debris removal and disposal
CA.109538 171 cryptic title, electric utility buyer
CA.109556 175 utility ROW brush clearing
CA.109548 186 utility ROW brush clearing
US.242057 337 wetland vegetation maintenance, flood
 district`],notes:[],tables:[]},{label:"Real records Bid A · droppedBid B · opened",paths:[],blocks:[`{
 "id": "CA.109644",
 "idx": 0,
 "decision": "SKIP",
 "reason": "food hub operator, wrong vertical"
}`,`{
 "id": "CA.109556",
 "idx": 175,
 "decision": "OPEN",
 "reason": "utility ROW brush clearing"
}`],notes:["Bid A's journey ends here. Pulled, diffed, one read. Four fields is the entire record of it. Note what is not in the answer: no title, no buyer, no state. The AI returns the id and nothing to check it against."],tables:[]}],notes:[],then:"and now the stage that does nothing"},{n:"7",title:"Fetch the detail page: skipped, on purpose",who:"(nothing runs)",summary:["On most portals this is where a browser opens each promising bid to go and get the description. Here there is nothing to get. The scope arrived inside the list at stage 3.","That is this portal's one real advantage. Seven bids reach the scorer with their full real scope and zero extra page loads. Documents and named contacts are a different matter, and they are handled much later."],cells:[{label:"Proof there is nothing here",paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Check","Result"]},{header:!1,cells:["Rows in the pull with real scope text","2,626 of 2,626"]},{header:!1,cells:["Detail-fetch output file for 28 July","none exists, and none is modelled"]},{header:!1,cells:["Judge input description source","the same scope string that came out of the search endpoint"]}]]}],notes:[],then:"seven bids, full scope, get a score"},{n:"8",title:"Pass 2: would LGS actually bid this?",who:"max-bid-judge · AI (dispatched by the child agent)",summary:["The seven OPENs are rebuilt into a small input file with the full scope attached, and an AI scores each one out of 100 with one reason and a list of warnings.","That night: 5 YES, 1 MAYBE, 1 NO. The two highest scores, both 92, are the two NB Power right-of-way brush jobs. Both are flagged as out of core geography and both are still called YES, which is the stated rule: geography is a flag, not a filter."],cells:[{label:"In → Out",paths:[{path:"runs/extended/judge-input-2026-07-28.json",size:"7,341 bytes · 7 rows"},{path:"runs/extended/judge-verdicts-2026-07-28.json",size:"5,318 bytes · 7 rows"}],blocks:[`id verdict score buyer
CA.109556 yes 92 Énergie NB Power
CA.109548 yes 92 Énergie NB Power
US.246735 yes 80 Metropolitan Development
 and Housing Agency
US.246753 yes 68 MNBuys
US.246736 yes 66 Floyd County GA
US.242057 maybe 50 Harris County
CA.109538 no 25 Énergie NB Power`],notes:["The judge answer has no category field. Look at the record on the right: eleven fields, and category is not one of them. The archive writer fills it with an empty string, so every Bonfire Pro card on the board carries a blank category forever."],tables:[]},{label:"Real record Bid B · YES, 92",paths:[],blocks:[`{
 "id": "CA.109556",
 "identifier": "XXXX-26-C244-6",
 "title": "Right-of-Way Brush Maintenance
 – Fredericton to Norton",
 "agency": "Énergie NB Power",
 "state": "CA",
 "due_date": "2026-08-11",
 "link": "https://nbpower.bonfirehub.ca/
 opportunities/109556",
 "would_lgs_bid": "yes",
 "score": 92,
 "primary_reason": "Cutting all trees and brush,
 edge trimming, and disposal along an electric
 utility right-of-way corridor is the exact
 Category 2 ROW clearing work LGS wins year
 after year.",
 "red_flags": [
 "canada_out_of_core_geography",
 "cross_border_mobilization_and_licensing"
 ]
}`],notes:[],tables:[]}],notes:[],then:"the portal's own night ends with five files"},{n:"9",title:"Write the report, remember the ids, build the archive",who:"data/bonfire-ports/scripts/extended/compile_report.py",summary:["Three jobs. Write a human report. Fold all 2,626 ids pulled tonight into the memory file so tomorrow's diff works. Then write the five standard files under the bonfire-pro slug so the rest of the system can treat this like any other portal.","The verdict rows are rebuilt by joining the judge's answer back onto the pull that was judged, so a fact the AI did not repeat still reaches the archive."],cells:[{label:"The archive · data/bonfire-pro/daily/2026-07-28/",paths:[],blocks:[],notes:['The report says a wrong thing, then gets overwritten. The source line written here ends "…full StatementOfWork scope in-list. Standalone; not published to Supabase/PortalPro". That has not been true for a long time: 41 Bonfire Pro cards are live in the board fixture right now. But stage 11 rewrites this report.md the same night, so the operator never reads the stale line. It survives only in the run copy, data/bonfire-ports/runs/extended/report-2026-07-28.md, and in archives old enough to predate the rewriter, such as 2026-06-20.'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","367 rows, everything new","482 KB"]},{header:!1,cells:["triage.json","367 decisions","40 KB"]},{header:!1,cells:["verdicts.json","7 scored bids","5,553 bytes"]},{header:!1,cells:["stats.json","the funnel counts","464 bytes"]},{header:!1,cells:["report.md","human summary","3,486 bytes"]}]]},{label:"Real archive record Bid B",paths:[],blocks:[`{
 "bid_id": "CA.109556",
 "title": "Right-of-Way Brush Maintenance
 – Fredericton to Norton",
 "buyer": "Énergie NB Power",
 "state": "CA",
 "would_lgs_bid": "yes",
 "score": 92,
 "category": "",
 "primary_reason": "Cutting all trees and brush,
 edge trimming, and disposal along an electric
 utility right-of-way corridor is the exact
 Category 2 ROW clearing work LGS wins year
 after year.",
 "red_flags": [
 "canada_out_of_core_geography",
 "cross_border_mobilization_and_licensing"
 ],
 "due_date": "2026-08-11",
 "detail_url": "https://nbpower.bonfirehub.ca/
 opportunities/109556",
 "bid_key": "bonfire-pro:CA.109556"
}`],notes:["Same bid, third id spelling: ProjectID in the raw, source_external_id and id in the run files, bid_id plus a new bid_key here."],tables:[]}],notes:[`Memory is a diff store, not a verdict store. The 6,146-id file only answers "have we seen this before". It holds no scores. So verdicts.json here contains only the 7 bids judged today, never yesterday's. Older bids stay visible because the board database keeps its rows and because the ledger walks every archive folder ever written.`],then:"the portal is done. the shared machinery takes over"},{n:"10",title:"Carry forward: this portal is not in it",who:"2.5 · scripts/carry_forward_verdicts.py",summary:[`On some portals a safety net re-applies yesterday's verdicts to bids that are still open today. The registry decides who gets it. Bonfire Pro's setting is carry_forward: "engine-internal", which means the orchestrator leaves it alone.`,"In plain words: the engine is trusted to handle its own history, so the shared net is not thrown over it. Running it too would apply the same thing twice."],cells:[{label:"What that looks like on disk for 28 July",paths:[],blocks:[`data/bidnet/daily/2026-07-28/_carryforward_audit.json
data/centralauctionhouse/daily/2026-07-28/_carryforward_audit.json
data/ms-dfa/daily/2026-07-28/_carryforward_audit.json
data/napc/daily/2026-07-28/_carryforward_audit.json
data/nc-evp/daily/2026-07-28/_carryforward_audit.json
data/norta/daily/2026-07-28/_carryforward_audit.json
data/planhouseplanroom/daily/2026-07-28/_carryforward_audit.json

data/bonfire-pro/daily/2026-07-28/ ... no such file`],notes:["The gap is the finding. The stage model lists _carryforward_audit.json as an output of this stage. It does not exist for this portal, and it should not. Seven other portals got one that night. Bonfire Pro's folder has exactly the five files stage 9 wrote. That is the setting working as intended, visible on disk."],tables:[]}],notes:[],then:"the report is rewritten and the YES bids become board cards"},{n:"11",title:"One report layout, then the board fixture",who:"2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["First the report is thrown away and rewritten in the layout every portal shares. Then a second script walks every Bonfire Pro archive folder ever written and pulls out the YES verdicts, cumulatively, into the file the board reads.","MAYBE verdicts are left behind. Only federal feeds keep them, and this is not one. That night's single MAYBE, the Harris County wetland job at score 50, never becomes a card."],cells:[{label:"In → Out",paths:[{path:"data/bonfire-pro/daily/*/verdicts.json",size:"all 22 folders"},{path:"data/bonfire-pro/daily/2026-07-28/report.md",size:"rewritten · 3,486 bytes"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards · 41 bonfire-pro"}],blocks:[],notes:['All 41 are verdict "yes". Checked bid by bid: of the seven judged on 28 July, the five YES are all in the fixture with first_seen: "2026-07-28", and the MAYBE and the NO are both absent. Not one MAYBE anywhere in the 41.'],tables:[]},{label:"The rewritten report's own header line",paths:[],blocks:[`# bonfire-pro — 2026-07-28

**Source:** common-production-api-global...
/v1.0/projects/search/free · engine
\`bonfire-authn-search\` · state CA.BC`],notes:['"state CA.BC" is wrong, and here is exactly why. The rewriter wants a state for the header. It looks for a portal config file, which this portal does not have. So it falls back to the first row of new-bids.json. The first row is Bid A, the North Saanich food hub in British Columbia. A portal covering 2,626 bids across the US, Canada, the EU and the Bahamas is labelled with one Canadian province, every single day, because of an array index.'],tables:[]}],notes:[],then:"bids stop being Bonfire-shaped here"},{n:"12",title:"Onto the shared board, and into clusters",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → apply_llm_dedup.py",summary:["The 41 cards are pushed into the shared bids table and grouped with every other portal's bids. One solicitation seen on Bonfire Pro, on the anonymous Bonfire feed and on DemandStar collapses into one row the operator reads once.","Two guards matter here. One cluster can never span two different named buyers. And because Bonfire Pro is not an aggregator, its buyer name wins over an aggregator's when they disagree."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"41 bonfire-pro cards"},{path:"tables: portals, bids, clusters, sweep_runs",size:null}],blocks:[],notes:["Contact is zero here by design, not by failure. The fixture is built from the daily archives, which never held a contact. Contacts are patched straight onto the board row at the next stage."],tables:[[{header:!0,cells:["Field","Of the 41 cards"]},{header:!1,cells:["has_documents","27 true"]},{header:!1,cells:["contact_name / email / phone","0 filled"]},{header:!1,cells:["category","empty on every one"]}]]},{label:"Real board card Bid B",paths:[],blocks:[`{
 "id": "69a5a62de8371edf",
 "portal": "bonfire-pro",
 "portal_label": "Bonfire Pro (login)",
 "source_bid_id": "CA.109556",
 "title": "Right-of-Way Brush Maintenance
 – Fredericton to Norton",
 "buyer": "Énergie NB Power",
 "state": "CA",
 "solicitation_no": null,
 "federal": false,
 "score": 92,
 "verdict": "yes",
 "category": "",
 "description": "The Work shall be the cutting
 of all trees and brush, the trimming of trees on
 Right-of-Way (R.O.W.) edge…",
 "due_date": "2026-08-11",
 "contact_name": null,
 "contact_email": null,
 "fit_signals": [],
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:['The description is the real scope from stage 3, not a stub. That is what having the scope in the list buys you. solicitation_no is null even though the raw record had "XXXX-26-C244-6", because the archive drops the identifier.'],tables:[]}],notes:[],then:"now go and fetch what the pull could not: contacts, files, page text"},{n:"13",title:"Contacts, documents, page text, requirements",who:"2.85 bonfire_enrich.py · enrich_pro_docs.py · page_text_public_capture.py → 2.87 requirements",summary:["Three different visits to the same page, for three different reasons.","Contact and description, no login. The public tenant page is fetched anonymously with a Cloudflare solve, and the named buyer contact is patched onto the board row. Platform helpdesk addresses are deliberately rejected, which is why some agencies show no contact at all: they publish none.","Documents, login required. This is the one part that spends the day's login. Each doc-less bid's page is opened inside the logged-in browser, each file is clicked and captured, uploaded, and recorded. Roughly 60 to 90 seconds per bid for the challenge solve, and the whole pass is capped at one hour.","One exception, and it catches our own tracer. Tenants on bonfirehub.ca are a separate Canadian instance our .com account cannot reach, so the pass drops them before it starts. Four of the 41 board cards sit on .ca tenants, Bid B among them, and all four show no documents. The skip is a bare continue, so no reason is recorded anywhere, even though the file's own header says those bids keep a documents gap reason.","Page text, no login. Bonfire's page text is public. Only the files are gated. So the text capture runs every day and never touches the login budget."],cells:[{label:"The document pass, as its own state file records it",paths:[{path:"runs/extended/doc-state.json",size:"5,231 bytes · 33 bids tracked"}],blocks:[`walls recorded across the 33
no_per_file_links 22
none (complete) 9
unauth 2

files captured in total 185
last checked 6 bids on 2026-07-29,
 24 on 2026-07-24, 3 on 2026-07-23`],notes:["The wall has a name. no_per_file_links on 22 of 33 means the page showed documents but gave no link to any single file. Bonfire's download is a script button, not a link, and the direct file address answers 404. That is the recorded reason, not a blank."],tables:[]},{label:"One real entry from doc-state.json",paths:[],blocks:[`{
 "a2f82ddb-d0a4-414c-aa43-7a32a4a452c0": {
 "auth_fails": 2,
 "checked": "2026-07-29",
 "complete": false,
 "expected": 0,
 "have": 0,
 "wall": "unauth"
 }
}`,`{
 "001e8c31-4ca5-461e-998f-4457c01a59bf": {
 "checked": "2026-07-24",
 "complete": true,
 "expected": 12,
 "have": 12,
 "wall": null
 }
}`],notes:["The document pass only sees published bids. It reads its targets from the board database. A bid that never reached the board, a MAYBE for instance, has no target and is never attempted. There is no queue it waits in.","Twelve expected, twelve captured, no wall. When the login holds, the document pass works completely. When it does not, it says unauth and counts the failures instead of pretending."],tables:[]}],notes:['Then the requirements read. Whatever documents and page text exist per cluster are extracted, packed, and read by an AI that pulls out bonds, insurance, licences and deadlines, each with a word-for-word quote. Clusters with no material at all get a plain "no material" row, so the board never shows an unexplained blank. This runs even after a partial enrichment, by rule.'],then:"now that the facts are filled in, look for twins again"},{n:"14",title:"Second look for duplicates",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The first dedup at stage 12 ran on thin morning data. Now buyers, due dates and solicitation numbers have been filled in, so pairs that could not be compared before get judged again.","This matters more for this portal than most. Bonfire and DemandStar partly carry each other, and stage 5 measured it: 429 titles that night appeared on both. So this is where a Bonfire Pro bid finally merges with its DemandStar twin."],cells:[{label:"In → Out",paths:[{path:"tables: clusters, bids",size:"pairs involving a cluster new today"},{path:"data/portals/llm-dedup-merges.json",size:"the pairs judged the same bid"}],blocks:[],notes:["If there are no candidate pairs, the AI and the apply step are both skipped. Verdicts are stored durably, so the same pair is never paid for twice."],tables:[]}],notes:[],then:"what changed since last time, and who gets told"},{n:"15",title:"Watch it, then show it",who:"2.88 watch_v2.py · digests · packs · roll-ups · sentinel",summary:["Watch re-opens the page of every accepted, still-live Bonfire Pro bid inside the same single logged-in session and compares it against the stored copy. That is how a late addendum or a new question-and-answer file gets caught. It never opens a second login.","Then everything the operator actually looks at is rebuilt: the board, four digest documents, a bid pack per cluster, and the counting sheets."],cells:[{label:"Watch is in shadow, and it did not run that night",paths:[],blocks:[`enrich_engine/PROMOTED.json
{ "promoted": [] }

data/portals/v2/shadow/bonfire-pro/
2026-07-11.json 7,755 bytes
2026-07-12.json 23,439 bytes
2026-07-22.json 477 bytes
2026-07-23.json 9,624 bytes
2026-07-24.json 8,891 bytes
no 2026-07-28.json`],notes:["Two honest facts. First, the promoted list is empty, so watch writes page text and local copies but never writes fields back. Second, the newest shadow file is 24 July. On the anchor night of 28 July, watch produced nothing for this portal. 16 stored page copies sit under data/portals/v2/pages/bonfire-pro/ (a text file and a link list each, 32 files), all from earlier runs."],tables:[]},{label:"Where this portal shows up at the end",paths:[],blocks:[],notes:['One row from the live ledger, verbatim, shows the id trap from stage 3 surviving all the way here: "state": "US.KY" on a Mississippi county debris job. Newer rows say "TX". Both spellings sit in the same file.'],tables:[[{header:!0,cells:["Terminal","Bonfire Pro on 2026-07-28"]},{header:!1,cells:["data/portals/cumulative-yes.json","27 live rows, 41 archived rows, out of 2,054 unique bids"]},{header:!1,cells:["PortalPro board","41 cards, all verdict yes"]},{header:!1,cells:["Bid packs, roll-up, monitor, overview","included by registry setting, not by a hardcoded list"]},{header:!1,cells:["Four email digests","written to disk; sending is a silent no-op until the mail key is set"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:['"US slice only" is not true. The pull returned 2,102 US, 521 Canadian and 3 EU rows on 28 July',"the map and the skill file both say the global search gives a US-only slice; two of the five YES bids that night were Canadian NB Power jobs at score 92. The model is stale. Believe the file."]},{header:!1,cells:["State codes have four spellings at once: US.TX in archives before 24 July, TX after, CA.BC never stripped, and a bare US on 18 rows","the strip only removes a leading US., so Canadian codes keep their prefix and older archives keep theirs. Any state filter or count is wrong unless it normalizes first."]},{header:!1,cells:["The daily report header says state CA.BC","no portal config file exists, so the rewriter takes the state of the first row of new-bids.json. A 2,626-bid multi-country portal is labelled with one province, every day."]},{header:!1,cells:['compile_report.py still writes "Standalone; not published to Supabase/PortalPro"',"false since the registry turned on board publishing — 41 cards are live. Stage 11 overwrites the archived report.md the same night, so the operator does not see it. The line survives in the run copy runs/extended/report-2026-07-28.md and in archives older than the rewriter."]},{header:!1,cells:['Judge output has no category field, and the archive writer defaults it to ""',"every Bonfire Pro card on the board shows a blank category, forever. Nothing warns."]},{header:!1,cells:["The scope fallback is a landmine: if a row has no statement of work, the mapper calls a text function on Summary, which is a list on 2,226 of 2,626 rows","it would crash the entire pull. It has never fired, because on 28 July every one of the 2,626 rows had a statement of work."]},{header:!1,cells:["Documents are a script button, not a link. Anonymously the actions column is a bare dash, and the direct file address answers 404","files must be clicked inside a logged-in browser and captured. no_per_file_links is the recorded wall on 22 of the 33 tracked bids."]},{header:!1,cells:[".ca tenants are dropped by the document pass, silently. The code continues before it writes any state, while its own header says those bids keep a gap reason","4 of the 41 board cards live on bonfirehub.ca, including both NB Power YES bids at score 92. All four show no documents and no recorded reason why."]},{header:!1,cells:["Eight of seventeen agencies publish no named contact. The only address on the page is the platform helpdesk, which we reject on purpose",'a blank contact on those bids is the truth, not an extraction miss. Do not "fix" it.']},{header:!1,cells:["MAYBE verdicts never reach the board, and the document pass only reads published bids","a MAYBE gets no card, so it gets no document target, so it is never attempted. An old doc-gap note in this portal's folder promises the opposite. The note is wrong."]},{header:!1,cells:["Two archive files from 24 July have no writer anywhere in the code: doc-gaps.json and page-text.json","an agent wrote them by hand during a manual sweep. They look like pipeline output and are not. Neither exists in the 28 July folder."]},{header:!1,cells:["Watch is shadow only, and its newest output is 24 July","page text and local copies are written; no field ever gets updated from a watch. On the anchor night nothing was produced at all."]},{header:!1,cells:["PORTAL.md is a stale 14 July draft saying batch standalone and engine bonfire-pro",'the registry says batch portals and engine "". Its whole "How we drive it" section is still TODO. Everything real lives in the skill file and the README.']},{header:!1,cells:["The scraper lives under the other slug, data/bonfire-ports/scripts/extended/","the bonfire-pro folder holds only daily/, a README and a stale PORTAL.md. There is no code there to find."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk. Every count traces to data/bonfire-pro/daily/2026-07-28/stats.json, a row count, a byte size or a directory listing. Both tracer bids exist and were followed end to end. Baseline map: docs/portal-dataflow/bonfire-pro.md, evidence-cited to file:line; where it disagrees with the files, the files are what is written here. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk. Every count traces to data/bonfire-pro/daily/2026-07-28/stats.json, a row count, a byte size or a directory listing. Both tracer bids exist and were followed end to end. Baseline map: docs/portal-dataflow/bonfire-pro.md, evidence-cited to file:line; where it disagrees with the files, the files are what is written here. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar).",c="docs/portal-dataflow/pedia-bonfire-pro.html",p={slug:e,title:t,eyebrow:a,headline:n,lede:s,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,r as funnel_note,n as headline,s as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
