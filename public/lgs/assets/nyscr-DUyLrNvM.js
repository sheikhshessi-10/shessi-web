const e="nyscr",t="NY State Contract Reporter: what happens to a bid, stage by stage",a="Portal pedia · 34",s="NY State Contract Reporter: what happens to a bid, from a public card to the board",n="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. Two bids are followed the whole way, and a third is followed because it is the only kind of bid this night actually decided anything about. The headline: NYSCR judged six bids that night and not one came back YES. The four YES bids in the report are older verdicts being carried inside the archive.",r=[{value:"901",label:"in snapshot"},{value:"807",label:"carryover"},{value:"94",label:"new to triage"},{value:"22",label:"triage says open"},{value:"879",label:"triage says skip"},{value:"4",label:"yes"},{value:"8",label:"maybe"},{value:"10",label:"no"}],o=`Every number above is a key in data/nyscr/daily/2026-07-28/stats.json (447 bytes). Two of them need a warning. "94 new" is not one night's worth - the previous daily folder is 2026-07-24, so the diff reached back four days (data/nyscr/runs/_funnel.json: prior_archive_ids_compared_against: 859). And 4 / 8 / 10 is the standing verdict set, not this night's work: it counts all 22 rows in daily/2026-07-28/verdicts.json (25,739 bytes). Six of those were written that night, and they were 2 maybe and 4 no. The other 16, including all four YES, are standing answers from earlier nights.`,i=["Bid A · 2137494 - Pneumatic Tube System Preventative Maintenance, SUNY. Marked SKIP.","Bid B · 2137026 - 2026 Tree Removal, Pruning, Stump Grinding, Garden City. Sits on the board as YES 85.","Bid C · 2137550 - Street Right of Way Stocking Plan, City of Dunkirk. Genuinely new that night."],l=[{n:"0",title:"The gate, and the memory",who:"scripts/portal_due.py --batch portals",summary:["Before anything runs, one question: is this portal due today? The answer is the age of the newest folder under data/nyscr/daily/, checked against the cadence in the registry. NYSCR is cadence 1, so it is due every day.","That same folder is also the portal's whole memory. There is no database here. What NYSCR knows about yesterday is one file: the newest daily/<date>/triage.json."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"cadence_days: 1 · batch: portals"},{path:"data/nyscr/daily/",size:"36 dated folders on record"}],blocks:[],notes:[],tables:[]},{label:"The gap that shaped this run",paths:[],blocks:[`… 2026-07-15
 2026-07-16
 2026-07-20
 2026-07-21
 2026-07-23
 2026-07-24 <- the memory this run compared against
 2026-07-25 missing
 2026-07-26 missing
 2026-07-27 missing
 2026-07-28 <- this run`],notes:["Cadence says daily. The folders say otherwise. Nothing in the run flags the missing days - the diff simply reaches back to the newest folder it can find."],tables:[]}],notes:[],then:"five plain web page reads, no login anywhere"},{n:"1",title:"Pull the open ad list",who:"data/nyscr/scripts/run_daily.py (step 1) → engines/nyscr.pull",summary:["Asks nyscr.ny.gov for its open ads, 200 to a page, and reads the result cards out of the returned HTML. Each card gives an id, a title, an agency, a due date, a category, an issue date and a location. No browser, no login, no keyword filter.","What a card never carries is a scope. The engine writes description as the empty string at pull time, on purpose. The real RFP text lives on the detail page, and the detail page needs an account."],cells:[{label:"In → Out",paths:[{path:"https://www.nyscr.ny.gov/Ads/Search?Skip=N&Status=Open&Top=200",size:"5 pages"},{path:"data/nyscr/bids/all-bids.json",size:"483,801 bytes · 901 rows · 13 fields"},{path:"data/nyscr/bids/index.json",size:"216 bytes"}],blocks:[`[2026-07-28T20:52:11Z] NYSCR pull · state=NY
 skip=0: 200 cards, 200 new (total 200)
 skip=200: 200 cards, 200 new (total 400)
 skip=400: 200 cards, 200 new (total 600)
 skip=600: 200 cards, 200 new (total 800)
 skip=800: 101 cards, 101 new (total 901)
wrote 901 open ads -> …/bids/all-bids.json`],notes:["Verbatim from data/nyscr/logs/pull_log.txt, timestamps shortened. The fifth page came back short, so the loop stopped. The ceiling is 6 pages, or 1,200 ads."],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "2137494",
 "title": "CRER-0423 Pneumatic Tube System
 Preventative Maintenance and Annual
 Software Maintenance",
 "buyer": "State University of New York (SUNY)",
 "state": "NY",
 "due_date": null,
 "due_date_raw": "",
 "category": "Medical &amp; Health Care",
 "issue_date": "2026-07-24",
 "location": "",
 "status": "Open",
 "detail_url": "https://www.nyscr.ny.gov/
 Ads/Details/2137494",
 "description": "",
 "_detail_ok": false
}`],notes:["Two things worth seeing. The category arrives HTML-encoded and is stored that way - Medical &amp; Health Care is the literal value on disk. And this ad has no due date at all: the card left it blank, so due_date_raw is empty and due_date is null."],tables:[]}],notes:['One missing guard. If a page request throws, the loop breaks and keeps whatever it collected so far - a short snapshot lands with no error. There is no "refuse to write zero rows" check in this engine, unlike its sibling engines, so a parse failure would write an empty all-bids.json and wipe the diff memory. It did not happen on 28 July: 901 rows, five clean pages.'],then:"today's ads are matched against the 24 July archive"},{n:"2",title:"Diff first - what is actually new",who:"data/nyscr/scripts/run_daily.py (step 2) → platform_sweep.prep",summary:["Every ad id in today's snapshot is looked up in the newest archived triage.json. Already seen means carryover: the old decision is copied forward, free. Not seen means new: it goes in the queue for the AI.","807 carried over, 94 were new. That is the whole reason a 901-ad portal costs almost nothing to run."],cells:[{label:"In → Out",paths:[{path:"data/nyscr/daily/2026-07-24/triage.json",size:"859 known ids"},{path:"runs/triage-input.json",size:"21,723 bytes · 94 rows"},{path:"runs/triage-carryover.json",size:"91,405 bytes · 807 rows"},{path:"runs/judge-input.json",size:"494,512 bytes · 901 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "bid_id": "2137494",
 "decision": "SKIP",
 "reason": "pneumatic tube maintenance,
 non-fit"
}`],notes:[],tables:[]},{label:"Real record Bid B in judge-input.json",paths:[],blocks:[`{
 "idx": 430,
 "bid_id": "2137026",
 "title": "2026 Tree Removal, Pruning, Stump
 Grinding, Planting, & Emergency Calls",
 "buyer": "Garden City, Inc. Village of",
 "state": "NY",
 "due_date": "2026-07-30",
 "detail_url": "https://www.nyscr.ny.gov/
 Ads/Details/2137026",
 "description_full": "Title: 2026 Tree Removal,
 Pruning, Stump Grinding, Planting, & Emergency
 Calls\\nBuyer: Garden City, Inc. Village of\\n
 State: NY\\nCloses: 2026-07-30\\nSource URL:
 https://www.nyscr.ny.gov/Ads/Details/2137026\\n
 \\nRFP body (truncated to 6KB):\\nNYS Contract
 Reporter Login to your account to access
 NYSCR resources. Username Password Sign In
 Forgot your password? Don't have an account?
 Register here."
}`],notes:["Read the orange part. That is not an RFP. That is the NYSCR login page, stored as the bid's scope on some earlier night and merged forward ever since. 11 of the 901 rows in this file carry it. Hold that thought - stage 4 is where it gets undone."],tables:[]}],notes:[],then:"only the 94 new ads are shown to the AI"},{n:"3",title:"Triage Pass 1 - open or skip, on the title alone",who:"max-triage · AI, dispatched on runs/triage-input.json",summary:["The AI gets six fields per ad: a position number, the id, the title, the agency, the state and the due date. That is everything. There is no description to send, and the detail page is walled, so a title is the entire case a bid gets to make.","Default is SKIP. That night: 88 SKIP, 6 OPEN, out of 94."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"94 rows"},{path:"runs/triage-verdicts.json",size:"11,340 bytes · 94 rows · 88 SKIP / 6 OPEN"}],blocks:[],notes:["Neither tracer is here. Bid A and Bid B were both already known on 24 July, so they sat in the carryover file and cost nothing. Bid C is the one being followed through this stage because it is genuinely new."],tables:[]},{label:"Real records Bid C - in, then out",paths:[],blocks:[`{
 "idx": 10,
 "bid_id": "2137550",
 "title": "Implementation of Street Right of
 Way Stocking Plan",
 "buyer": "Dunkirk, City of",
 "state": "NY",
 "due_date": "2026-08-18"
}`,`{
 "bid_id": "2137550",
 "decision": "OPEN",
 "reason": "Street right of way stocking;
 ROW vegetation work"
}`],notes:[],tables:[]}],notes:[],then:"the 6 OPENs get their detail page fetched - and hit the wall"},{n:"4",title:"Go get the scope - the login wall",who:"data/nyscr/scripts/_phase4_enrich.py (step 1) → engines/nyscr.enrich_details",summary:["Each OPEN ad's detail page is fetched with six threads, stripped to plain text, and the first 6,000 characters are meant to become the description. NYSCR redirects every one of those requests to its login page. So the fetch works, and brings back nothing worth having.",'The engine calls a fetch "ok" only if it returned more than 200 characters. The login page is shorter. Six fetched, zero enriched - and that is the honest answer, not a bug.'],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"the 6 OPEN ids"},{path:"https://www.nyscr.ny.gov/Ads/Details/<id>",size:"redirects to /Account/Login"},{path:"data/nyscr/bids/all-bids.json",size:"rewritten in place"}],blocks:[`[20:55:36Z] enrich_details: fetching 6 NYSCR
 ad detail pages
[20:55:38Z] enrich_details: 0/6 enriched`],notes:["Two seconds, six pages, nothing gained. Same result on 24 July (0/2) and 23 July (0/1)."],tables:[]},{label:"Real record Bid B in all-bids.json today",paths:[],blocks:[`{
 "bid_id": "2137026",
 "title": "2026 Tree Removal, Pruning, Stump
 Grinding, Planting, & Emergency Calls",
 "buyer": "Garden City, Inc. Village of",
 "state": "NY",
 "due_date": "2026-07-30",
 "due_date_raw": "7/30/2026",
 "category": "Agriculture, Forestry, Gardening,
 Landscaping, Lawn Maintenance &amp; Snow Removal",
 "issue_date": "2026-07-10",
 "location": "Garden City, NY",
 "status": "Open",
 "detail_url": "https://www.nyscr.ny.gov/
 Ads/Details/2137026",
 "description": "",
 "_detail_ok": false,
 "_detail_gap_reason": "NYSCR detail page is
 login-gated; no public RFP body"
}`],notes:[],tables:[]}],notes:[`Something cleaned this file, and it was not this repo's Python. The snapshot on disk now has 0 of 901 rows with any description and 17 rows carrying _detail_gap_reason. But the engine code writes the fetched text into description whether the fetch succeeded or not, and it never writes a field called _detail_gap_reason - grep the whole repo for that name and the only hit is a list of "our own scraper's markers" in scripts/normalize.py:652, which reads it, never writes it. The file was last written at 20:56:19 UTC, 41 seconds after the enricher logged its finish. So the login-page text was removed and an honest reason put in its place by a step that lives outside the scripts modelled here. Good outcome, unowned mechanism.`],then:"the judge's queue is rebuilt from the cleaned snapshot"},{n:"5",title:"Build the judge queue",who:"data/nyscr/scripts/_phase4_enrich.py (step 2) → platform_sweep.build_judge_input_open",summary:["Not every OPEN ad goes to the judge. The queue is: tonight's new OPENs, plus any carried-over OPEN that has never been judged, plus anything already judged whose material changed. On 28 July the middle two groups were empty - all 16 carryover OPENs already had a standing verdict - so the queue was exactly the 6 new OPENs.","22 ads were OPEN. 6 reached the judge. The other 16 keep the answer they were given on an earlier night."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + runs/triage-carryover.json",size:"who is OPEN"},{path:"daily/2026-07-24/verdicts.json",size:"who already has an answer"},{path:"runs/judge-input-open.json",size:"6,096 bytes · 6 rows"}],blocks:[],notes:['This file does not match the code either. platform_sweep.py:293-296 builds the description block as Title / Buyer / State / Closes / Source URL / "RFP body:". The file on disk has two extra lines, Category and Location, and a written-out explanation where the body should be. Same 20:56:19 timestamp as the cleaned snapshot. The result is better than what the code produces - the judge is told plainly that there is no scope, instead of being handed a login page - but nothing in the repo produces it.'],tables:[]},{label:"Real record Bid C - what the judge was actually shown",paths:[],blocks:[`{
 "idx": 10,
 "bid_id": "2137550",
 "title": "Implementation of Street Right of
 Way Stocking Plan",
 "buyer": "Dunkirk, City of",
 "state": "NY",
 "due_date": "2026-08-18",
 "detail_url": "https://www.nyscr.ny.gov/
 Ads/Details/2137550",
 "description_full": "Title: Implementation of
 Street Right of Way Stocking Plan\\nBuyer:
 Dunkirk, City of\\nState: NY\\nCategory:
 Agriculture, Forestry, Gardening, Landscaping,
 Lawn Maintenance &amp; Snow Removal\\nLocation:
 City of Dunkirk\\nCloses: 2026-08-18\\nSource URL:
 https://www.nyscr.ny.gov/Ads/Details/2137550\\n
 \\nRFP body: NOT AVAILABLE. NYSCR gates every ad
 detail page behind a member login and we do not
 authenticate (detection discipline). Judge on
 title + buyer + category + location only.",
 "category": "Agriculture, Forestry, Gardening,
 Landscaping, Lawn Maintenance &amp; Snow Removal",
 "location": "City of Dunkirk"
}`],notes:[],tables:[]}],notes:[],then:"six bids are scored, on a title and a category"},{n:"6",title:"Judge Pass 2 - and the night's real answer",who:"max-bid-judge · AI, dispatched on runs/judge-input-open.json",summary:["Six bids scored. Two MAYBE, four NO, zero YES. The two maybes scored 52 and 42. Every one of the four nos scored 30 or below.","This is the honest headline of the run. The report for 28 July shows four YES bids, and every one of them was decided on an earlier night and folded forward by the compile step. Not one of them is in runs/judge-verdicts.json."],cells:[{label:"Out · runs/judge-verdicts.json · 8,573 bytes · 6 rows",paths:[],blocks:[`2137550 maybe 52 Implementation of Street
 Right of Way Stocking Plan
2137359 maybe 42 MBE/WBE/SDVOB Opportunity:
 Seneca Bluffs Natural Habitat…
2137369 no 30 DBE/MBE/WBE/SDVOB subcontractors…
2137410 no 20 Phase 1a (Terrace Park)
2137456 no 18 Neighborhood Blight Elimination
 Project
2137501 no 8 McNair Road over Tuscarora Creek
 Superstructure Replacement`],notes:["Where the four YES actually came from. Three of them carry _first_judged: 2026-07-15 in the archive (2137026, 2137012, 2137090). The fourth, 2137371, carries no _first_judged value at all - 12 of the 22 standing verdicts have that field empty, so the archive cannot say when it was decided."],tables:[]},{label:"Real record Bid C - MAYBE, 52",paths:[],blocks:[`{
 "bid_id": "2137550",
 "title": "Implementation of Street Right of
 Way Stocking Plan",
 "buyer": "Dunkirk, City of",
 "verdict": "maybe",
 "would_lgs_bid": "maybe",
 "score": 52,
 "lgs_score": 52,
 "reasoning": "Forestry category plus a street
 right of way scope is real municipal tree work,
 and 'Implementation of' means field work rather
 than a planning document, so the plan/study
 exclusion does not apply. But the operative noun
 is stocking, which in forestry means planting,
 and standalone planting is not one of the six
 categories LGS wins on. No RFP body is available,
 so scale and whether removal or pruning ride
 along is unknown. Worth pulling the packet
 before deciding.",
 "service_match": "adjacent",
 "scale_match": "unknown",
 "buyer_match": "core",
 "red_flags": [
 "out_of_core_state",
 "thin_description_pull_rfp_packet",
 "scope_is_planting_not_removal",
 "no_removal_or_trimming_verb_in_title"
 ],
 "out_of_core_state": true
}`],notes:['scale_match: "unknown" and thin_description_pull_rfp_packet are the wall showing up in the verdict. The judge says so out loud rather than guessing.'],tables:[]}],notes:[],then:"new answers and old answers are merged into one folder"},{n:"7",title:"Compile the archive",who:"platform_sweep.compile_archive → data/nyscr/daily/2026-07-28/",summary:["Carryover plus tonight's triage becomes one 901-row decision list. Prior verdicts for ads still in the snapshot are folded forward and joined with tonight's six. Five files land in a dated folder, plus a row on the portal's INDEX table.","This folder is the memory tomorrow's run will diff against, and the thing every cross-portal step downstream reads."],cells:[{label:"The archive · data/nyscr/daily/2026-07-28/",paths:[],blocks:[],notes:['Note the name. new-bids.json holds all 901 ads, the same bytes as bids/all-bids.json. On this portal it means "the snapshot as of this date", not "the new ones".'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","901 rows: the whole snapshot, not just the new ones","483,801 B"]},{header:!1,cells:["triage.json","901 decisions, tomorrow's memory","102,742 B"]},{header:!1,cells:["verdicts.json","22 standing verdicts, 6 of them new","25,739 B"]},{header:!1,cells:["stats.json","the funnel counts","447 B"]},{header:!1,cells:["report.md","human summary","5,126 B"]}]]},{label:"Real record Bid B in verdicts.json",paths:[],blocks:[`{
 "bid_id": "2137026",
 "title": "2026 Tree Removal, Pruning, Stump
 Grinding, Planting, & Emergency Calls",
 "would_lgs_bid": "yes",
 "score": 85,
 "primary_reason": "Verbatim match to LGS's
 Category 4 win pattern - annual municipal tree
 contract covering removal, pruning, stump
 grinding, and emergency calls.",
 "red_flags": ["out_of_core_state"],
 "_first_judged": "2026-07-15",
 "verdict": "yes",
 "lgs_score": 85,
 "buyer": "Garden City, Inc. Village of",
 "due_date": "2026-07-30",
 "state": "NY",
 "out_of_core_state": true
}`,`{
 "bid_id": "2137494",
 "decision": "SKIP",
 "reason": "pneumatic tube maintenance,
 non-fit"
}`],notes:[],tables:[]}],notes:[],then:"the portal's own night is over - the shared machinery takes over"},{n:"8",title:"Carry forward - this portal is deliberately not in it",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Across the whole system there is a safety net that re-attaches yesterday's verdicts to bids that fell out of one night's pull. It only runs for portals whose registry entry says carry_forward: "orchestrator". NYSCR says "engine-internal", so the script never opens its archive.`,"What that means in plain words: NYSCR does its own carrying, inside compile at stage 7. Running the shared net here as well would apply the same merge twice."],cells:[{label:"Except that it has run here, three times",paths:[],blocks:[],notes:["Three nights broke the contract. Because compile already merges prior verdicts, those runs may have applied the same merge on top of itself. All three are 15 July or earlier, and this run's folder is clean - no audit file in daily/2026-07-28/. Reported, not fixed."],tables:[[{header:!0,cells:["File found on disk","What writes it"]},{header:!1,cells:["data/nyscr/daily/2026-06-09/_carryforward_audit.json","scripts/carry_forward_verdicts.py - the script that is supposed to skip this portal entirely"]},{header:!1,cells:["data/nyscr/daily/2026-06-23/_carryforward_audit.json"]},{header:!1,cells:["data/nyscr/daily/2026-07-15/_carryforward_audit.json"]}]]}],notes:[],then:"the ledger, the report and the board fixture are rebuilt"},{n:"9",title:"Ledger, report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three passes over the durable archive. The cumulative ledger folds every YES this portal has ever written into the all-portal list. The report NYSCR just wrote is overwritten with the shared layout every portal uses. Then the board fixture is rebuilt from every dated folder at once.","Only YES rows become cards. MAYBE and NO stay in the archive."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"all portals"},{path:"data/nyscr/daily/2026-07-28/report.md",size:"5,126 B · rewritten 22:37:28 UTC"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards · 10 of them nyscr"}],blocks:[],notes:[`10 cards, not 4. The fixture is cumulative over the whole 36-day archive, so it carries YES ads from June that are no longer in tonight's live verdict set - 2136590 (90), 2136342 (85), 2136455 (82), 2136711 (82), 2136286 (72), 2134972 (70). Tonight's live four are 2137026, 2137090, 2137012 and 2137371. Do not read "10 nyscr cards" as "10 open NY bids".`],tables:[]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "c918f44cff4b8a7e",
 "portal": "nyscr",
 "portal_label": "NY State Contract Reporter",
 "source_bid_id": "2137026",
 "title": "2026 Tree Removal, Pruning, Stump
 Grinding, Planting, & Emergency Calls",
 "buyer": "Garden City, Inc. Village of",
 "solicitation_no": null,
 "score": 85,
 "verdict": "yes",
 "category": "",
 "description": "Verbatim match to LGS's
 Category 4 win pattern - annual municipal tree
 contract covering removal, pruning, stump
 grinding, and emergency calls.",
 "due_date": "2026-07-30",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "first_seen": "2026-07-10",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["The card's description is the AI's own reasoning sentence, because the portal never had a scope to give it. Contact fields null, documents false, category emptied - the login wall, visible on the board."],tables:[]}],notes:[],then:"bids stop being NYSCR bids here"},{n:"10",title:"Publish, cluster, dedup",who:"2.85 publish_to_supabase.py → llm_dedup_candidates.py → apply_llm_dedup.py",summary:["Every portal's YES rows go into one shared table and get grouped into clusters, so the same job advertised in three places becomes one row for the operator.","NYSCR gets a specific treatment here: it is on the aggregator list. New York's Contract Reporter is a place agencies post notices, not the agency itself. So when a cluster picks which buyer name to display, a named buyer from a direct portal beats the NYSCR label."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"the 10 nyscr cards"},{path:"daily/2026-07-28/stats.json + new-bids.json",size:null},{path:"supabase: bids, clusters, bids.cluster_id, sweep_runs, portals",size:null}],blocks:[],notes:["Matching is hard for this portal. NYSCR has no solicitation number field at all, and no contact and no documents. A cluster can only match it on title, agency and due date. Its buyer is at least real - it comes straight off the card's own Agency field, not from an AI guess."],tables:[]},{label:"2.85b · the walls, written down instead of left blank",paths:[],blocks:[],notes:["Both strings are verbatim from scripts/gap_reasons.py:46-49. No enrichment pass targets NYSCR - the registry says enrich_passes: [] and that is accurate. What the bid page gets instead of a blank box is a sentence saying why the box is empty."],tables:[[{header:!0,cells:["Field","Registered reason"]},{header:!1,cells:["documents",'gated_login - "NYS Contract Reporter gates bid details + files behind a reCAPTCHA-v3 login."']},{header:!1,cells:["contact",'gated_login - "NYS Contract Reporter gates the buyer contact behind its login."']}]]}],notes:[],then:"the board tries to read the documents - there are none"},{n:"11",title:"Documents and requirements",who:"2.87 extract_doc_text.py + requirements-extractor · 2.875 dedup re-pass",summary:["Requirements extraction reads a cluster's documents and pulls out what a bidder must do: bonds, licences, insurance, deadlines. It works on clusters, not portals.",'NYSCR captures zero documents. An NYSCR-only cluster arrives at this stage with nothing to read, and gets a neutral "no material" row plus the gated_login reason, so the board never claims extraction is still pending.'],cells:[{label:"The one route to real requirements for an NYSCR bid",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["A person uploads the packet in PortalPro","It becomes a document row like any capture, and requirements extraction reads it normally. This is exactly what the engine's own instructions tell the operator to do - pull the packet from LGS's own NYSCR account by hand."]},{header:!1,cells:["The dedup re-pass at 2.875","Re-checks pairs that became comparable after enrichment filled in blank buyers and dates. For NYSCR this stage adds little: with no solicitation number, its matching keys did not change."]}]]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"12",title:"Watch, mail, packs, boards",who:"2.88 watch + digests + sentinel · 2.89 bid packs · 2.9-2.96 boards · P3-P4 roll-up",summary:["Watch mode for NYSCR is none: no page is re-captured to spot an addendum, because there is no readable page to re-capture. Its bids still reach the digests through their clusters."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Page re-capture watcher",'off for this portal - registry watch: "none"']},{header:!1,cells:["New-bid and watch digests, deadline alerts","written to data/portals/daily-new-bids.md and daily-watch-digest.md, but sending is a silent no-op until RESEND_API_KEY exists in data/auth/resend.env"]},{header:!1,cells:["Bid packs","an NYSCR ad appears as a page inside its cluster's pack with little more than title, agency and due date"]},{header:!1,cells:["Monitor, overview and matrix boards","NYSCR becomes one row on each, rebuilt from data/nyscr/daily/*/; its state is hardcoded NY in the metrics builder"]},{header:!1,cells:["Sentinel + roll-up + scorecard","the /portals roll-up (run_portals.py · build_rollup) and the sentinel both read this run's stats.json and verdicts.json - not triage.json, which is only tomorrow's diff memory. FAILED comes from the run manifest's own stage status; a missing stats.json on a stage the manifest called done flips the row to NO-ARCHIVE instead. The scorecard reads Supabase only, never these files"]}]]}],notes:[],then:"and one script that runs beside all of this, connected to nothing"},{n:"13",title:"The login capture that nothing reads",who:"data/nyscr/scripts/save_login.py · out of band",summary:["This script opens a visible browser so a person can log into NYSCR past its reCAPTCHA, then saves the signed-in session to data/auth/nyscr-state.json. It is the obvious answer to every wall on this page.","Nothing in the pipeline reads that file. Searching every Python file in the repo for the name nyscr-state finds one file - this script, on the line that writes the path and in its own docstring. Zero readers. The enricher at stage 4 builds a fresh session with no cookies instead."],cells:[{label:"What is on disk in data/auth/",paths:[],blocks:[],notes:['This is why the registry says authed: true and the run is anonymous. Three files disagree about this portal: the registry says authenticated, data/nyscr/config.json says "auth": "none", and the sweep skill says "No auth, ever. Public listing only." The code agrees with the last two. The flag matters because it is what makes PORTAL.md print a detection-discipline warning about a paid account that this sweep never touches.'],tables:[[{header:!1,cells:["nyscr-creds.txt","present"]},{header:!1,cells:["nyscr-state.json","absent - the capture has not been run, and would change nothing if it were"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["The detail page is login-gated, so 0 of 901 rows have a description","triage and judge both run on a title, an agency and a category. Every OPEN carries thin_description_pull_rfp_packet and the operator is expected to pull the packet by hand"]},{header:!1,cells:["The four YES bids were not judged on the anchor night",`stats.json scoring counts the standing verdict set (22 rows), not the night's work (6 rows). Quoting "4 YES" as "found today" is wrong on this portal, every day it carries verdicts forward`]},{header:!1,cells:["Daily folders jump 24 July → 28 July",'"94 new" covers four days. The funnel file says so plainly (prior_archive_ids_compared_against: 859) but the report and the stats do not']},{header:!1,cells:["The enricher stores whatever it fetched, success or not","login-page text became the bid scope on an earlier night and merged forward; 11 of 901 rows in this run's runs/judge-input.json still carry it"]},{header:!1,cells:["Two files were corrected at 20:56:19 UTC by something outside this repo's Python",`_detail_gap_reason has no writer in any .py here, and the "RFP body: NOT AVAILABLE" wording plus the Category and Location lines do not match platform_sweep.py:293-296. The outcome is honest and better than the code's; the mechanism is unowned and would not survive a rerun`]},{header:!1,cells:["17 rows carry a gap reason, but 22 rows are OPEN","the reason is sticky, because the pull merge keeps a non-empty prior value, so it accumulates on OPENs as they are enriched. Five OPENs (2136576, 2136546, 2136506, 2136470, 2136246) have neither a description nor a reason"]},{header:!1,cells:["No zero-row guard in the pull","a page error breaks the loop silently and a parse failure would write an empty snapshot, resetting the diff memory. Sibling engines refuse to do this; this one does not check"]},{header:!1,cells:["Carry-forward audit files exist for 2026-06-09, 06-23 and 07-15",'the shared carry-forward is supposed to skip this portal (carry_forward: "engine-internal"). It ran anyway on three nights, on top of a compile that already merges prior verdicts']},{header:!1,cells:["Five files in runs/ have no writer in any script","_triage_raw.json (5,985 B, 71 rows, no bid_id at all), triage-batch1/2-input and -output (8,714 / 3,829 / 8,628 / 3,630 B). Hand-made slices from a night when triage was split across parallel agents. They are stale scratch, not inputs - do not read them as this run's data"]},{header:!1,cells:["Six more tb1/tb2/tb3 files sit beside them","32, 32 and 30 rows each, same shape, same story - older parallel-triage scratch left in place"]},{header:!1,cells:["new-bids.json is not the new bids",'it is the full 901-row snapshot, byte-for-byte the same size as bids/all-bids.json. The name means "the snapshot as of this date" here']},{header:!1,cells:["The category field keeps its HTML encoding",'"Medical &amp; Health Care" is the literal stored value. Anything that renders it without decoding shows the raw code to the operator']},{header:!1,cells:["NYSCR is on the aggregator list","in a shared cluster its Agency label loses to a named buyer from a direct portal. That is correct here, since NYSCR republishes other bodies' notices, but it means the buyer you see may not be the one NYSCR printed"]},{header:!1,cells:["Three sources disagree on whether this portal is authenticated","registry says yes, config.json says no, the sweep skill says never. The code is anonymous. Until it is settled, PORTAL.md warns about protecting an account the sweep does not use"]}]],paragraphs:[]},{heading:"Where the written model and the files disagree",tables:[[{header:!0,cells:["Document says","The files on 28 July say"]},{header:!1,cells:['docs/portal-dataflow/nyscr.md: "859 open ads in the 2026-07-24 snapshot"',"901 ads. 859 was the 24 July pull; the model was written against that run, not this one"]},{header:!1,cells:["Same doc: 11 of 859 rows carry login-page text as their description","half true now. The snapshot has 0 descriptions and 17 honest gap reasons; the prep-time judge-input.json still carries the login text on 11 rows, and the judge's own queue is clean"]},{header:!1,cells:['data/nyscr/PORTAL.md: "description coverage 88%"',"0 of 901 rows have any description. That 88% cannot be this portal's own capture. PORTAL.md is a 2026-07-14 auto-generated draft with a TODO field map"]},{header:!1,cells:['PORTAL.md lists engine/connectors/scrape/nyscr.py among "the files that actually exist" for driving this portal',"the nightly sweep never imports it. It is a legacy connector, wired into engine/run_all_active.py only, and it points at /contracts.cfm - not the /Ads/Search endpoint the live engine uses"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk and copied, not typed. Some blocks show a subset of a record's fields; long strings are shortened only with a trailing ellipsis. Every count traces to data/nyscr/daily/2026-07-28/stats.json, a file's byte size, or a row count. Baseline map: docs/portal-dataflow/nyscr.md (evidence-cited to file:line), with its disagreements against disk listed above."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk and copied, not typed. Some blocks show a subset of a record's fields; long strings are shortened only with a trailing ellipsis. Every count traces to data/nyscr/daily/2026-07-28/stats.json, a file's byte size, or a row count. Baseline map: docs/portal-dataflow/nyscr.md (evidence-cited to file:line), with its disagreements against disk listed above.",c="docs/portal-dataflow/pedia-nyscr.html",u={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:r,funnel_note:o,legend:i,stages:l,sections:d,footer:h,source_page:c};export{u as default,a as eyebrow,h as footer,r as funnel,o as funnel_note,s as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
